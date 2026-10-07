'use client'

// The live 3D cable in the home hero, on every device that can draw WebGL.
// Loaded by <Scene3D>. It tunes its own quality while the welcome screen shows
// (see "Quality" below) and only then reports that it is ready to be seen.

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { HeroTier } from './capability'
import { CABLE_CYCLE_MS, cableColours, cableColourStore, useCableColour } from './cableColours'
import { CableHitArea, HeroCableModel, heroJacketCentre, JACKET_RADIUS, type CableMotion } from './HeroCable'
import { cardCamera, heroCamera, heroProgress } from './heroProgress'
import { heroAnchorFeed, type CalloutAnchors, type CalloutId } from '../calloutAnchors'
import { Studio } from './Studio'
import { MATCAP_URL } from './studioMatcap'

/** `hero`: the tall desktop column, turned by scrolling. `card`: the compact 4:3 phone framing. */
export type HeroVariant = 'hero' | 'card'
/** What the scene settled on, for the ?debug3d readout. */
export type HeroQuality = { tier: HeroTier; dpr: number; fps: number }

// Each framing's cable turns about its own middle, so the cut end turns towards
// you instead of swinging sideways.
const PIVOTS: Record<HeroVariant, [number, number, number]> = { hero: [0.45, -0.6, 0.45], card: [0.55, 0.35, 0.5] }
/** The frame rate the scene keeps to; below it, it draws fewer pixels. */
const TARGET_FPS = 50
/** The lowest resolution it will go to, as a fraction of a CSS pixel. */
const MIN_DPR = 0.5
/** The longest warm-up before the scene shows itself anyway. */
const WARMUP_MS = 2600
/** How long a tap keeps a touch-screen cable moving. */
const PULSE_MS = 2600

/** Jacket samples for the spec callouts: the upper jacket by the conductors, the jacket mid-way, the bend. */
const CALLOUT_SAMPLES: Array<{ id: CalloutId; t: number }> = [
  { id: 'heat', t: 0.95 },
  { id: 'fire', t: 0.8 },
  { id: 'flex', t: 0.64 },
]
const projectScratch = {
  point: new THREE.Vector3(),
  tangent: new THREE.Vector3(),
  local: new THREE.Vector3(),
  tip: new THREE.Vector3(),
  camera: new THREE.Vector3(),
  toward: new THREE.Vector3(),
  side: new THREE.Vector3(),
  right: new THREE.Vector3(),
  left: new THREE.Vector3(),
  ndc: new THREE.Vector3(),
}

/**
 * Projects the three jacket points onto the canvas, on the jacket's left edge
 * (the side facing the specs). Runs inside the scene's existing frame.
 */
function publishCalloutAnchors(space: THREE.Object3D, camera: THREE.Camera, size: { width: number; height: number }, motion: CableMotion) {
  space.updateWorldMatrix(true, true)
  const s = projectScratch
  camera.getWorldPosition(s.camera)
  const anchors = {} as CalloutAnchors
  for (const sample of CALLOUT_SAMPLES) {
    heroJacketCentre(sample.t, motion, s.point, s.tangent)
    s.local.copy(s.point)
    space.localToWorld(s.point)
    space.localToWorld(s.tip.copy(s.local).add(s.tangent))
    s.tangent.copy(s.tip).sub(s.point).normalize()
    s.toward.copy(s.camera).sub(s.point).normalize()
    s.side.crossVectors(s.tangent, s.toward).normalize()
    s.right.copy(s.point).addScaledVector(s.side, JACKET_RADIUS)
    s.left.copy(s.point).addScaledVector(s.side, -JACKET_RADIUS)
    const right = toCanvas(s.right, camera, size, s.ndc)
    const left = toCanvas(s.left, camera, size, s.ndc)
    anchors[sample.id] = right.x < left.x ? right : left
  }
  heroAnchorFeed.listener?.(anchors)
}

function toCanvas(point: THREE.Vector3, camera: THREE.Camera, size: { width: number; height: number }, ndc: THREE.Vector3) {
  ndc.copy(point).project(camera)
  return { x: (ndc.x * 0.5 + 0.5) * size.width, y: (-ndc.y * 0.5 + 0.5) * size.height }
}

const damp = THREE.MathUtils.damp
/** Eases a 0–1 value in and out, so motion starts and stops softly. */
const smooth = (x: number) => x * x * (3 - 2 * x)

type Pose = { rx: number; ry: number; x: number; y: number; z: number }
const POSE_KEYS = ['rx', 'ry', 'x', 'y', 'z'] as const
/**
 * The desktop cable's pose at each step of the scroll story (see heroProgress):
 * a turn about its middle, in radians, and a shift, in scene units. Each shows
 * the part its spec describes, and keeps the whole cable, conductors included,
 * clear of the site header on every screen from 1280 × 720 up.
 */
const STORY_POSES: Pose[] = [
  // The headline: exactly as on the still.
  { rx: 0, ry: 0, x: 0, y: 0, z: 0 },
  // Heat: the cut end turns towards you, showing the upper jacket and the conductors.
  { rx: 0.06, ry: 0.3, x: 0, y: -0.2, z: 0.25 },
  // Fire safety: back round to the side of the jacket, mid-way along.
  { rx: 0, ry: -0.15, x: 0, y: -0.1, z: 0.1 },
  // Durability: turned further, so the bend reads in profile.
  { rx: -0.1, ry: -0.35, x: -0.25, y: 0.05, z: -0.25 },
  // The hand-over: held, so nothing moves as the page scrolls on.
  { rx: -0.1, ry: -0.35, x: -0.25, y: 0.05, z: -0.25 },
]
const REST_POSE = STORY_POSES[0]
const storyScratch: Pose = { ...REST_POSE }

/** The pose between two steps, eased so the cable settles softly on each one. */
function storyPose(step: number) {
  const last = STORY_POSES.length - 1
  const s = THREE.MathUtils.clamp(step, 0, last)
  const i = Math.min(Math.floor(s), last - 1)
  const f = smooth(s - i)
  for (const k of POSE_KEYS) storyScratch[k] = STORY_POSES[i][k] + (STORY_POSES[i + 1][k] - STORY_POSES[i][k]) * f
  return storyScratch
}
/** The scene hears pointer events from the whole page; ignore the cable while the pointer is on a button or link in front of it (the colour swatches). */
const overControl = (e: { nativeEvent: Event }) => e.nativeEvent.target instanceof Element && !!e.nativeEvent.target.closest('a, button, input, select, textarea')
const isMouse = (e: { nativeEvent: Event }) => (e.nativeEvent as PointerEvent).pointerType === 'mouse'

/**
 * On desktop, eases between the scroll story's poses (STORY_POSES) and leans
 * slightly towards the pointer. With the pointer on the cable it comes slowly
 * alive: a gentle bend drifts along it, the stripped end turns, a soft
 * highlight glides across the jacket, and it moves through its colours.
 * Everything eases in and out, with no bounce. A click or tap shows the next
 * colour (on touch screens a tap also sets it moving for a moment). With
 * reduced motion the cable stays still.
 *
 * Quality: through a short warm-up, while the welcome screen still covers it,
 * the scene draws continuously and measures its frame rate (the median frame,
 * so a one-off pause such as preparing the shaders doesn't count). Below
 * TARGET_FPS it lowers its resolution step by step until it is smooth, then
 * calls onReady. Resolution only changes during the warm-up, never in front of
 * the visitor. The `low` tier (no graphics card) skips this: its cost is in
 * putting the picture on screen, which resolution barely changes.
 */
function LiveCable({
  animate,
  tier,
  variant,
  matcap,
  onReady,
  onQuality,
}: {
  animate: boolean
  tier: HeroTier
  variant: HeroVariant
  matcap?: THREE.Texture
  onReady?: () => void
  onQuality?: (q: HeroQuality) => void
}) {
  const pivot = PIVOTS[variant]
  const ref = useRef<THREE.Group>(null)
  const cableSpace = useRef<THREE.Group>(null)
  const sweep = useRef<THREE.DirectionalLight>(null)
  const invalidate = useThree((s) => s.invalidate)
  const setDpr = useThree((s) => s.setDpr)
  const colour = cableColours[useCableColour()]
  const motion = useRef<CableMotion>({ amp: 0, time: 0, twist: 0 })
  // `level` eases between 0 (at rest) and 1 (alive); the motion uses it smoothed.
  const hover = useRef({ on: false, changedAt: 0, level: 0, pulseUntil: 0 })
  const tune = useRef({ warm: true, started: 0, drawn: 0, frames: [] as number[], chained: false, settled: false })

  const setHovered = (on: boolean) => {
    const h = hover.current
    if (on === h.on) return
    h.on = on
    // The first new colour arrives a little sooner than the rest.
    if (on) h.changedAt = performance.now() - CABLE_CYCLE_MS * 0.5
    document.body.style.cursor = on ? 'pointer' : ''
    invalidate()
  }

  // With frameloop="demand" nothing draws until asked to: start the warm-up.
  useLayoutEffect(() => invalidate(), [invalidate])

  // Draw a frame only when something changes: a scroll (desktop, where scrolling
  // turns the cable), a pointer move, or motion still settling.
  useEffect(() => {
    if (!animate) return
    const kick = () => invalidate()
    if (variant === 'hero') window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('pointermove', kick, { passive: true })
    kick()
    return () => {
      window.removeEventListener('scroll', kick)
      window.removeEventListener('pointermove', kick)
    }
  }, [animate, invalidate, variant])

  // The callouts ask for a frame when their lines appear, with reduced motion too.
  useEffect(() => {
    if (variant !== 'hero') return
    const kick = () => invalidate()
    heroAnchorFeed.kick = kick
    return () => {
      if (heroAnchorFeed.kick === kick) heroAnchorFeed.kick = null
    }
  }, [invalidate, variant])

  useEffect(() => () => void (variant === 'hero' && heroAnchorFeed.listener?.(null)), [variant])

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const pose = variant === 'hero' ? storyPose(heroProgress.value) : REST_POSE
    // After an idle pause the first delta is long; cap it so nothing jumps
    // (but not so low that motion slows down on devices drawing fewer frames).
    const dt = Math.min(delta, 0.1)
    const m = motion.current
    const h = hover.current
    const now = performance.now()
    const alive = (h.on || now < h.pulseUntil) && animate

    // Colours change on the real clock while hovered, so they keep their pace even when frames drop.
    if (h.on && animate && now - h.changedAt >= CABLE_CYCLE_MS) {
      h.changedAt = now
      cableColourStore.next()
    }

    // Ease towards 1 while alive and back to 0 after, with no overshoot.
    h.level = damp(h.level, alive ? 1 : 0, 2.2, dt)
    if (h.level < 0.004 && !alive) h.level = 0
    const moving = h.level > 0
    if (moving) m.time += dt
    const e = smooth(Math.min(h.level, 1))
    m.amp = e
    m.twist = Math.sin(m.time * 0.6) * 0.9 * e

    // A soft highlight glides slowly across the jacket while the cable is alive.
    const l = sweep.current
    if (l) {
      l.intensity = 1.6 * e
      l.position.set(Math.cos(m.time * 0.6) * 5, 3 + Math.sin(m.time * 0.4) * 1.5, 4 + Math.sin(m.time * 0.6) * 2)
    }

    // The pointer is tracked across the whole page; only its position over the cable's column steers the lean.
    const px = THREE.MathUtils.clamp(state.pointer.x, -1, 1)
    const py = THREE.MathUtils.clamp(state.pointer.y, -1, 1)
    const ry = pose.ry + px * 0.08 + Math.sin(m.time * 0.4) * 0.08 * e
    const rx = pose.rx - py * 0.05
    const x = pivot[0] + pose.x
    const y = pivot[1] + pose.y
    const z = pivot[2] + pose.z + 0.28 * e
    g.rotation.y = damp(g.rotation.y, ry, 7, dt)
    g.rotation.x = damp(g.rotation.x, rx, 7, dt)
    g.position.x = damp(g.position.x, x, 7, dt)
    g.position.y = damp(g.position.y, y, 7, dt)
    g.position.z = damp(g.position.z, z, 7, dt)
    if (variant === 'hero' && heroAnchorFeed.listener && cableSpace.current) publishCalloutAnchors(cableSpace.current, state.camera, state.size, m)
    const settling =
      Math.abs(g.rotation.y - ry) + Math.abs(g.rotation.x - rx) + Math.abs(g.position.x - x) + Math.abs(g.position.y - y) + Math.abs(g.position.z - z) > 1e-4
    const busy = (settling || moving || alive) && animate

    // ── Quality: measure and adapt ──
    // Only frames that follow another drawn frame count, so idle gaps never do.
    const t = tune.current
    if (!t.started) t.started = now
    t.drawn += 1
    if (busy || t.warm) state.invalidate()
    const measuring = t.warm || busy
    if (measuring && t.chained) t.frames.push(delta)
    t.chained = measuring
    const n = t.frames.length
    if (n >= 20 || (n >= 6 && t.frames.reduce((a, b) => a + b, 0) >= 0.6)) {
      const fps = 1 / [...t.frames].sort((a, b) => a - b)[n >> 1]
      let dpr = state.viewport.dpr
      if (!t.settled) {
        if (tier !== 'low' && t.warm && fps < TARGET_FPS && dpr > MIN_DPR + 0.01) {
          dpr = Math.max(MIN_DPR, Math.round(dpr * 0.75 * 100) / 100)
          setDpr(dpr)
        } else {
          t.settled = true
        }
      }
      // Keeps reporting (for ?debug3d) after settling, e.g. while the cable is hovered.
      onQuality?.({ tier, dpr, fps: Math.round(fps) })
      t.frames = []
      t.chained = false
    }
    // Without a graphics card resolution makes little difference, so there is
    // nothing to tune: the scene is ready once it has drawn.
    const ready = tier === 'low' ? t.drawn >= 3 : t.settled
    if (t.warm && (ready || now - t.started > WARMUP_MS)) {
      t.warm = false
      requestAnimationFrame(() => onReady?.())
    }
  })

  return (
    <>
      <directionalLight ref={sweep} intensity={0} position={[5, 3, 4]} />
      <group ref={ref} position={pivot}>
        <group ref={cableSpace} position={[-pivot[0], -pivot[1], -pivot[2]]}>
          <HeroCableModel path={variant} colour={colour} motion={motion} quality={tier} matcap={matcap} />
          <CableHitArea
            path={variant}
            onPointerOver={(e) => isMouse(e) && setHovered(!overControl(e))}
            onPointerMove={(e) => isMouse(e) && setHovered(!overControl(e))}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
              if (overControl(e)) return
              cableColourStore.next()
              hover.current.changedAt = performance.now()
              if (!isMouse(e)) hover.current.pulseUntil = performance.now() + PULSE_MS
              invalidate()
            }}
          />
        </group>
      </group>
    </>
  )
}

/**
 * The baked studio lighting for the `low` tier (see studioMatcap). The scene
 * waits for it, so the cable never appears unlit; if it can't be fetched, the
 * cable falls back to real (simplified) lighting.
 */
function useMatcap(wanted: boolean) {
  const [state, setState] = useState<{ texture?: THREE.Texture; failed: boolean }>({ failed: false })
  useEffect(() => {
    if (!wanted) return
    let live = true
    const texture = new THREE.TextureLoader().load(
      MATCAP_URL,
      () => live && setState({ texture, failed: false }),
      undefined,
      () => live && setState({ failed: true }),
    )
    texture.colorSpace = THREE.SRGBColorSpace
    return () => {
      live = false
      texture.dispose()
    }
  }, [wanted])
  return state
}

export default function HeroScene({
  animate,
  tier,
  variant,
  onReady,
  onQuality,
}: {
  animate: boolean
  tier: HeroTier
  variant: HeroVariant
  onReady?: () => void
  onQuality?: (q: HeroQuality) => void
}) {
  const cam = variant === 'card' ? cardCamera : heroCamera
  const baked = useMatcap(tier === 'low')
  const waiting = tier === 'low' && !baked.texture && !baked.failed
  return (
    <Canvas
      // Up to 1.5× resolution (1× without a graphics card); the warm-up lowers it if needed.
      dpr={tier === 'low' ? 1 : [1, 1.5]}
      frameloop="demand"
      camera={{ position: cam.position, fov: cam.fov }}
      // Antialiasing costs too much without a graphics card.
      gl={{ antialias: tier !== 'low', alpha: true, powerPreference: 'high-performance' }}
      // Track the pointer across the whole page, so the canvas never blocks clicks,
      // measuring it from the canvas (which sits in the right-hand column).
      eventSource={document.body}
      onCreated={(state) =>
        state.setEvents({
          compute: (event, s) => {
            const r = s.gl.domElement.getBoundingClientRect()
            s.pointer.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1)
            s.raycaster.setFromCamera(s.pointer, s.camera)
          },
        })
      }
    >
      {/* Studio lights with a white rim, so every cable colour reads true. The low tier has them baked in instead. */}
      {!baked.texture && <Studio rim="#ffffff" lite={tier === 'low'} />}
      {variant === 'hero' && <fog attach="fog" args={['#050505', 9, 16]} />}
      {!waiting && <LiveCable animate={animate} tier={tier} variant={variant} matcap={baked.texture} onReady={onReady} onQuality={onQuality} />}
    </Canvas>
  )
}

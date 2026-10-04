'use client'

// The live 3D cable in the home hero. Loaded lazily by <Scene3D>, only on
// desktop screens with a GPU, once the page has loaded.

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { CABLE_CYCLE_MS, cableColours, cableColourStore, useCableColour } from './cableColours'
import { CableHitArea, HeroCableModel, type CableMotion } from './HeroCable'
import { heroCamera, heroProgress } from './heroProgress'
import { Ready } from './Ready'
import { Studio } from './Studio'

// The cable turns about its own middle rather than the scene's origin, so the
// cut end turns towards you instead of swinging sideways.
const PIVOT: [number, number, number] = [0.45, -0.6, 0.45]
const damp = THREE.MathUtils.damp
/** Eases a 0–1 value in and out, so motion starts and stops softly. */
const smooth = (x: number) => x * x * (3 - 2 * x)
/** The scene hears pointer events from the whole page; ignore the cable while the pointer is on a button or link in front of it (the colour swatches). */
const overControl = (e: { nativeEvent: Event }) => e.nativeEvent.target instanceof Element && !!e.nativeEvent.target.closest('a, button, input, select, textarea')

/**
 * Turns the cut end towards you as the page scrolls, and leans slightly towards
 * the pointer. Scroll progress arrives raw (unsmoothed) and is eased once here,
 * so the cable follows the scroll closely instead of trailing behind it.
 *
 * With the pointer on the cable, it comes slowly alive: a gentle bend drifts
 * along it, the stripped end turns, a soft highlight glides across the jacket,
 * and it moves through its colours. Everything eases in and out, with no
 * bounce. A click shows the next colour. With reduced motion the cable stays
 * still (the hero wrapper still cycles its colours on hover).
 */
function LiveCable({ animate, onTooSlow }: { animate: boolean; onTooSlow?: (fps: number) => void }) {
  const ref = useRef<THREE.Group>(null)
  const sweep = useRef<THREE.DirectionalLight>(null)
  const invalidate = useThree((s) => s.invalidate)
  const colour = cableColours[useCableColour()]
  const motion = useRef<CableMotion>({ amp: 0, time: 0, twist: 0 })
  // `level` eases between 0 (at rest) and 1 (alive); the motion uses it smoothed.
  const hover = useRef({ on: false, changedAt: 0, level: 0 })
  const perf = useRef({ frames: 0, time: 0, chained: false, done: false })

  const setHovered = (on: boolean) => {
    const h = hover.current
    if (on === h.on) return
    h.on = on
    // The first new colour arrives a little sooner than the rest.
    if (on) h.changedAt = performance.now() - CABLE_CYCLE_MS * 0.5
    document.body.style.cursor = on ? 'pointer' : ''
    invalidate()
  }

  // Draw a frame only when something changes: a scroll, a pointer move, or motion still settling.
  useEffect(() => {
    if (!animate) return
    const kick = () => invalidate()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('pointermove', kick, { passive: true })
    kick()
    return () => {
      window.removeEventListener('scroll', kick)
      window.removeEventListener('pointermove', kick)
    }
  }, [animate, invalidate])

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const p = heroProgress.value
    // After an idle pause the first delta is long; cap it so nothing jumps.
    const dt = Math.min(delta, 1 / 30)
    const m = motion.current
    const h = hover.current
    const alive = h.on && animate

    // Colours change on the real clock, so they keep their pace even when frames drop.
    if (alive && performance.now() - h.changedAt >= CABLE_CYCLE_MS) {
      h.changedAt = performance.now()
      cableColourStore.next()
    }

    // Ease towards 1 while hovered and back to 0 after, with no overshoot.
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
    const ry = 0.32 * p + px * 0.08 + Math.sin(m.time * 0.4) * 0.08 * e
    const rx = 0.14 * p - py * 0.05
    const z = 0.6 * p + 0.28 * e
    g.rotation.y = damp(g.rotation.y, ry, 7, dt)
    g.rotation.x = damp(g.rotation.x, rx, 7, dt)
    g.position.z = damp(g.position.z, PIVOT[2] + z, 7, dt)
    const settling = Math.abs(g.rotation.y - ry) + Math.abs(g.rotation.x - rx) + Math.abs(g.position.z - PIVOT[2] - z) > 1e-4
    const busy = (settling || moving || alive) && animate
    if (busy) state.invalidate()

    // Measure real smoothness over the first stretch of continuous animation. If
    // this device can't keep up (under about 24 fps, e.g. software rendering
    // behind a browser that hides its graphics card), hand back to the still.
    // Only frames that follow another animated frame count, so idle gaps never do.
    const pf = perf.current
    if (!pf.done) {
      if (busy && pf.chained) {
        pf.frames += 1
        pf.time += Math.min(delta, 1)
        if (pf.frames >= 40 || (pf.time >= 1.5 && pf.frames >= 4)) {
          pf.done = true
          const fps = pf.frames / pf.time
          if (fps < 24) onTooSlow?.(Math.round(fps))
        }
      }
      pf.chained = busy
    }
  })

  return (
    <>
      <directionalLight ref={sweep} intensity={0} position={[5, 3, 4]} />
      <group ref={ref} position={PIVOT}>
        <group position={[-PIVOT[0], -PIVOT[1], -PIVOT[2]]}>
          <HeroCableModel colour={colour} motion={motion} />
          <CableHitArea
            onPointerOver={(e) => setHovered(!overControl(e))}
            onPointerMove={(e) => setHovered(!overControl(e))}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
              if (overControl(e)) return
              cableColourStore.next()
              hover.current.changedAt = performance.now()
              invalidate()
            }}
          />
        </group>
      </group>
    </>
  )
}

export default function HeroScene({ animate, onReady, onTooSlow }: { animate: boolean; onReady?: () => void; onTooSlow?: (fps: number) => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="demand"
      camera={{ position: heroCamera.position, fov: heroCamera.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
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
      {/* A white rim light, so every cable colour reads true. */}
      <Studio rim="#ffffff" />
      <fog attach="fog" args={['#05070a', 9, 16]} />
      <LiveCable animate={animate} onTooSlow={onTooSlow} />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

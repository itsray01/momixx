'use client'

// The desktop cable story in 3D (see storyTimeline.ts for the script): the
// anatomy cable, a USB-C plug that forms on its end, and a plain phone it plugs
// into, all in one scene so the camera can pull back from one to the other.
// Everything follows `t`, set by scroll; nothing here re-renders React.

import { ContactShadows, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { CableAnatomyModel, CLOSED, JACKET_END, wireCentres, type Sweep } from './CableAnatomy'
import { AXIS_Y, BATTERY_FROM, BOOT, CABLE_R, FILL_SECONDS, makeEffects, PhoneModel, SHELL, UNPLUGGED } from './CableCharging'
import { cableColourById } from './cableColours'
import { anatomyColour, cableLayers, layerAnchors } from './cableLayers'
import { chargingView } from './chargingView'
import { Ready } from './Ready'
import { storyAt, storyHighlight, storySweep } from './storyTimeline'
import { Studio } from './Studio'
import { makeXray } from './xray'

const white = cableColourById(anatomyColour)!

/** The charging scene's parts are drawn at this scale, so its cable matches the anatomy's (radius 0.78). */
const S = 0.78 / CABLE_R
/** How far left the cable runs: past the edge of even the widest view. */
const REACH = -90
/** The plug, in story units: the strain relief starts just inside the closed jacket's end. */
const RELIEF_FROM = JACKET_END + CLOSED - 0.1
const RELIEF_LEN = 0.5 * S
const BOOT_FROM = RELIEF_FROM + RELIEF_LEN
const BOOT_FRONT = BOOT_FROM + BOOT.length * S
/** How far the cable travels into the port. */
const TRAVEL = -UNPLUGGED * S
/** The phone's port, once the plug is in. */
const PORT = BOOT_FRONT + 0.02 * S + TRAVEL
/** The table: the phone's underside, with the cable's axis at y = 0. */
const FLOOR = -AXIS_Y * S
/** Where the charging x-ray sweeps along the cable, in the wide view: from off the left edge into the plug. */
const CHARGE_SWEEP: [number, number] = [PORT - 40, PORT]

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
/** Close up on the stripped end (the anatomy's own view). */
const CLOSE = { position: v3(3.1, 2.15, 10.2), target: v3(0.55, -0.05, 0), hfov: 44 }
/** Wide, looking down at the phone: the charging scene's view, scaled into story units. */
const WIDE = {
  position: v3(PORT + S * chargingView.position[0], S * (chargingView.position[1] - AXIS_Y), S * chargingView.position[2]),
  target: v3(PORT + S * chargingView.target[0], S * (chargingView.target[1] - AXIS_Y), S * chargingView.target[2]),
  hfov: 40,
}

const vfov = (hfov: number, aspect: number) => (Math.atan(Math.tan((hfov * Math.PI) / 360) / aspect) * 360) / Math.PI
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

/** The room the page leaves the cable between its two rows of labels, in pixels from the top of the stage. */
export type StoryFrame = { top: number; bottom: number }

/**
 * The camera eases from the close-up to the wide view as the story goes on. In the
 * close-up the cable is centred in the room between the label rows, and drawn
 * smaller if that room is tight (wide, short screens), so no label ever sits on it.
 */
function Rig({ sceneRef, frameRef }: { sceneRef: RefObject<Scene>; frameRef: RefObject<StoryFrame | null> }) {
  const pos = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const drift = useRef({ x: 0, y: 0 })
  useFrame(({ camera, pointer, size }, delta) => {
    const cam = camera as THREE.PerspectiveCamera
    const u = easeInOut(storyAt(Math.max(0, sceneRef.current.t)).camera)
    const scale = THREE.MathUtils.lerp(1, 7, u)
    drift.current.x = THREE.MathUtils.damp(drift.current.x, pointer.x * 0.3, 3, delta)
    drift.current.y = THREE.MathUtils.damp(drift.current.y, pointer.y * 0.18, 3, delta)
    pos.lerpVectors(CLOSE.position, WIDE.position, u)
    pos.setX(pos.x + drift.current.x * scale).setY(pos.y + drift.current.y * scale)
    target.lerpVectors(CLOSE.target, WIDE.target, u)
    cam.position.copy(pos)

    const aspect = size.width / size.height
    let closeHfov = CLOSE.hfov
    let shift = 0
    const f = frameRef.current
    if (f && f.bottom - f.top > 40) {
      // Pixels per unit at the cable, in the close-up; the cable and its label dots need about 2.1 units of height.
      const v = (vfov(CLOSE.hfov, aspect) * Math.PI) / 180
      const perUnit = size.height / (2 * CLOSE.position.distanceTo(CLOSE.target) * Math.tan(v / 2))
      const fit = Math.min(1, (f.bottom - f.top) / (2.1 * perUnit))
      closeHfov = (2 * Math.atan(Math.tan((CLOSE.hfov * Math.PI) / 360) / fit) * 180) / Math.PI
      shift = (f.top + f.bottom) / 2 - size.height / 2
    }
    const fov = vfov(THREE.MathUtils.lerp(closeHfov, WIDE.hfov, u), aspect)
    const offset = -shift * (1 - u)
    const view = cam.view
    if (!view || view.fullWidth !== size.width || view.fullHeight !== size.height || Math.abs(view.offsetY - offset) > 0.5) {
      cam.setViewOffset(size.width, size.height, 0, offset, size.width, size.height)
    }
    if (Math.abs(cam.fov - fov) > 0.001) {
      cam.fov = fov
      cam.updateProjectionMatrix()
    }
    cam.lookAt(target)
  })
  return null
}

/** Places each label's dot on its layer, on the page, every frame. */
function Markers({ markers, explode }: { markers: RefObject<Array<HTMLElement | null>>; explode: RefObject<number> }) {
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, size }) => {
    const anchors = layerAnchors(explode.current)
    cableLayers.forEach((l, i) => {
      const el = markers.current[i]
      if (!el) return
      v.set(...anchors[l.id]).project(camera)
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -50%)`
      el.style.visibility = 'visible'
    })
  })
  return null
}

/** Everything that moves, worked out once per frame by the Director before anything is drawn. */
type Scene = {
  /** The story's eased position (-1 until the first frame). */
  t: number
  form: number
  plug: number
  away: number
  /** How lit the charging light and screen are (0 to 1). */
  level: number
  battery: number
  time: number
}

/**
 * Turns the scroll position into the scene's state, first thing each frame (it is
 * the Canvas's first child, so the cable's layers read this frame's highlight,
 * not the last one's). After a gap (the story was off screen, or the page jumped)
 * it goes straight to where the page is instead of replaying the way there.
 */
function Director({
  targetRef,
  sceneRef,
  explodeRef,
  closeRef,
  highlightRef,
  sweepRef,
  jumpRef,
}: {
  targetRef: RefObject<number>
  sceneRef: RefObject<Scene>
  explodeRef: RefObject<number>
  closeRef: RefObject<number>
  highlightRef: RefObject<string | null>
  sweepRef: RefObject<Sweep | null>
  jumpRef: RefObject<boolean>
}) {
  useFrame((_, delta) => {
    const s = sceneRef.current
    const jump = s.t < 0 || jumpRef.current || delta > 0.25
    jumpRef.current = false
    const dt = Math.min(delta, 0.1)
    // Eases after the scroll, so steps glide.
    s.t = jump ? targetRef.current : THREE.MathUtils.damp(s.t, targetRef.current, 6, dt)
    const a = storyAt(s.t)
    explodeRef.current = a.explode
    closeRef.current = a.close
    s.form = a.form
    // The plug and the phone follow the scroll, a little softened.
    s.plug = jump ? a.plugIn : THREE.MathUtils.damp(s.plug, a.plugIn, 5, dt)
    s.away = jump ? a.phoneAway : THREE.MathUtils.damp(s.away, a.phoneAway, 4, dt)
    // Charging starts once the plug is home.
    const on = a.charging && s.plug > 0.97
    // Steps 1 to 5: the x-ray scans along the cable as the page scrolls. Later, the charging x-ray
    // sweeps in on its own once the plug is home.
    sweepRef.current = storySweep(s.t)
    highlightRef.current = storyHighlight(s.t) === 'charge' && on ? 'charge' : null
    s.level = jump ? (on ? 1 : 0) : THREE.MathUtils.damp(s.level, on ? 1 : 0, on ? 3 : 6, dt)
    if (on) s.battery = Math.min(1, s.battery + dt / FILL_SECONDS)
    else if (s.level < 0.02) s.battery = BATTERY_FROM
    s.time += dt
  })
  return null
}

function StoryModel({
  sceneRef,
  explodeRef,
  closeRef,
  highlightRef,
  sweepRef,
  markers,
}: {
  sceneRef: RefObject<Scene>
  explodeRef: RefObject<number>
  closeRef: RefObject<number>
  highlightRef: RefObject<string | null>
  sweepRef: RefObject<Sweep | null>
  markers: RefObject<Array<HTMLElement | null>>
}) {
  const shownExplode = useRef(0.55)
  const cable = useRef<THREE.Group>(null)
  const plug = useRef<THREE.Group>(null)
  const phone = useRef<THREE.Group>(null)
  const screen = useRef<THREE.MeshPhysicalMaterial>(null)
  const plugMats = useRef<Array<THREE.MeshPhysicalMaterial | null>>([])
  const [fx] = useState(() => makeEffects({ freq: 0.065, speed: 0.88 }))
  const [plugXray] = useState(() => [makeXray(white.jacket), makeXray(white.jacket), makeXray('#d9dde2')])

  useEffect(() => () => fx.dispose(), [fx])

  useFrame(() => {
    const s = sceneRef.current
    if (cable.current) cable.current.position.x = TRAVEL * s.plug
    if (phone.current) phone.current.position.x = PORT + s.away * 80
    if (plug.current) {
      const f = s.form
      plug.current.visible = f > 0.005
      plug.current.scale.set(THREE.MathUtils.lerp(0.12, 1, f), THREE.MathUtils.lerp(0.64, 1, f), THREE.MathUtils.lerp(0.41, 1, f))
    }
    fx.setPulses(s.time, s.level)
    fx.drawScreen(s.battery)
    if (screen.current) screen.current.emissiveIntensity = s.level
    // The plug fades in as it forms, and x-rays with the cable while charging.
    const fade = Math.min(1, s.form * 1.6)
    plugMats.current.forEach((m, i) => {
      if (!m) return
      m.opacity = fade
      plugXray[i].set(s.level, 0.9)
      m.depthWrite = fade > 0.99 && s.level < 0.01
    })
  })

  const plugMat = (i: number, color: string, metal = false) => (
    <meshPhysicalMaterial
      ref={(m) => void (plugMats.current[i] = m)}
      color={color}
      metalness={metal ? 1 : 0}
      roughness={metal ? 0.22 : 0.38}
      sheen={metal ? 0 : 0.8}
      sheenColor="#ffffff"
      sheenRoughness={0.5}
      clearcoat={metal ? 0 : 0.4}
      transparent
      onBeforeCompile={plugXray[i].patch}
    />
  )

  return (
    <>
      <group ref={cable}>
        <CableAnatomyModel
          explodeRef={explodeRef}
          shownRef={shownExplode}
          highlightRef={highlightRef}
          sweepRef={sweepRef}
          range={CHARGE_SWEEP}
          closeRef={closeRef}
          reach={REACH}
          tilt={0}
        />
        {/* The plug, growing out of the cable's end. */}
        <group ref={plug} position={[RELIEF_FROM, 0, 0]} visible={false}>
          <mesh position={[RELIEF_LEN / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[CABLE_R * S, 0.2 * S, RELIEF_LEN, 48]} />
            {plugMat(0, white.jacket)}
          </mesh>
          <RoundedBox args={[BOOT.length * S, BOOT.height * S, BOOT.width * S]} radius={0.22 * S} smoothness={6} position={[RELIEF_LEN + (BOOT.length * S) / 2, 0, 0]}>
            {plugMat(1, white.jacket)}
          </RoundedBox>
          <RoundedBox args={[SHELL.length * S, SHELL.height * S, SHELL.width * S]} radius={0.07 * S} smoothness={4} position={[RELIEF_LEN + BOOT.length * S + (SHELL.length * S) / 2, 0, 0]}>
            {plugMat(2, '#d9dde2', true)}
          </RoundedBox>
        </group>
        {/* Light running along each wire to the plug while it charges. */}
        {wireCentres.map(([y, z]) => (
          <mesh key={`${y}:${z}`} position={[(REACH + BOOT_FRONT - 0.6) / 2, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, BOOT_FRONT - 0.6 - REACH, 24]} />
            <primitive object={fx.pulses} attach="material" />
          </mesh>
        ))}
      </group>
      <group ref={phone} position={[PORT + 80, FLOOR, 0]} scale={S}>
        <PhoneModel fx={fx} screenRef={screen} />
      </group>
      <Markers markers={markers} explode={shownExplode} />
    </>
  )
}

export default function StoryCanvas({
  target,
  frame,
  markers,
  animate,
  onReady,
}: {
  /** The story's position, 0 to STORY_STEPS, set by scroll. */
  target: RefObject<number>
  /** The room between the label rows (measured by the page). */
  frame: RefObject<StoryFrame | null>
  markers: RefObject<Array<HTMLElement | null>>
  animate: boolean
  onReady: () => void
}) {
  const scene = useRef<Scene>({ t: -1, form: 0, plug: 0, away: 1, level: 0, battery: BATTERY_FROM, time: 0 })
  const explode = useRef(0.55)
  const close = useRef(0)
  const highlight = useRef<string | null>(null)
  const sweep = useRef<Sweep | null>(null)
  // Coming back on screen: go straight to where the page is.
  const jump = useRef(false)
  useEffect(() => {
    if (animate) jump.current = true
  }, [animate])
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: [CLOSE.position.x, CLOSE.position.y, CLOSE.position.z], fov: 30, near: 0.5, far: 600 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Director targetRef={target} sceneRef={scene} explodeRef={explode} closeRef={close} highlightRef={highlight} sweepRef={sweep} jumpRef={jump} />
      <Studio />
      <Rig sceneRef={scene} frameRef={frame} />
      <StoryModel sceneRef={scene} explodeRef={explode} closeRef={close} highlightRef={highlight} sweepRef={sweep} markers={markers} />
      <ContactShadows position={[PORT - 10, FLOOR, 0]} opacity={0.5} scale={170} blur={2.4} far={4} resolution={1024} />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

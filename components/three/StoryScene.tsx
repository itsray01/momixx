'use client'

// The desktop cable story in 3D (see storyTimeline.ts for the script): the
// anatomy cable, a USB-C plug that forms on its end, and a plain phone it plugs
// into, all in one scene so the camera can pull back from one to the other.
// Everything follows `t`, set by scroll; nothing here re-renders React.

import { ContactShadows, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { CableAnatomyModel, CLOSED, JACKET_END, wireCentres } from './CableAnatomy'
import { AXIS_Y, BATTERY_FROM, BOOT, CABLE_R, FILL_SECONDS, makeEffects, PhoneModel, SHELL, UNPLUGGED } from './CableCharging'
import { cableColourById } from './cableColours'
import { anatomyColour, cableLayers, layerAnchors } from './cableLayers'
import { chargingView } from './chargingView'
import { Ready } from './Ready'
import { storyAt, storyHighlight } from './storyTimeline'
import { Studio } from './Studio'

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

/** The camera eases from the close-up to the wide view as the story goes on. */
function Rig({ storyRef }: { storyRef: RefObject<number> }) {
  const pos = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const drift = useRef({ x: 0, y: 0 })
  useFrame(({ camera, pointer, size }, delta) => {
    const cam = camera as THREE.PerspectiveCamera
    const u = easeInOut(storyAt(Math.max(0, storyRef.current)).camera)
    const scale = THREE.MathUtils.lerp(1, 7, u)
    drift.current.x = THREE.MathUtils.damp(drift.current.x, pointer.x * 0.3, 3, delta)
    drift.current.y = THREE.MathUtils.damp(drift.current.y, pointer.y * 0.18, 3, delta)
    pos.lerpVectors(CLOSE.position, WIDE.position, u)
    pos.setX(pos.x + drift.current.x * scale).setY(pos.y + drift.current.y * scale)
    target.lerpVectors(CLOSE.target, WIDE.target, u)
    cam.position.copy(pos)
    const fov = vfov(THREE.MathUtils.lerp(CLOSE.hfov, WIDE.hfov, u), size.width / size.height)
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

function StoryModel({ targetRef, storyRef, markers }: { targetRef: RefObject<number>; storyRef: RefObject<number>; markers: RefObject<Array<HTMLElement | null>> }) {
  const explode = useRef(0.55)
  const shownExplode = useRef(0.55)
  const close = useRef(0)
  const highlight = useRef<string | null>(null)
  const cable = useRef<THREE.Group>(null)
  const plug = useRef<THREE.Group>(null)
  const phone = useRef<THREE.Group>(null)
  const screen = useRef<THREE.MeshPhysicalMaterial>(null)
  const plugMats = useRef<Array<THREE.MeshPhysicalMaterial | null>>([])
  const [fx] = useState(() => makeEffects({ freq: 0.065, speed: 0.88 }))
  const charge = useRef({ level: 0, battery: BATTERY_FROM, time: 0 })
  const motion = useRef({ plug: 0, away: 1 })

  useEffect(() => () => fx.dispose(), [fx])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    // Starts where the page already is; then eases after the scroll, so steps glide.
    const t = storyRef.current < 0 ? targetRef.current : THREE.MathUtils.damp(storyRef.current, targetRef.current, 5, dt)
    storyRef.current = t
    const a = storyAt(t)
    explode.current = a.explode
    close.current = a.close

    // The plug and the phone ease more slowly than the rest, so the plug visibly glides into the port
    // even when the page settles onto the last step in one quick movement.
    const m = motion.current
    m.plug = THREE.MathUtils.damp(m.plug, a.plugIn, 2.2, dt)
    m.away = THREE.MathUtils.damp(m.away, a.phoneAway, 3, dt)
    if (cable.current) cable.current.position.x = TRAVEL * m.plug
    if (phone.current) phone.current.position.x = PORT + m.away * 80
    if (plug.current) {
      const f = a.form
      plug.current.visible = f > 0.005
      plug.current.scale.set(THREE.MathUtils.lerp(0.12, 1, f), THREE.MathUtils.lerp(0.64, 1, f), THREE.MathUtils.lerp(0.41, 1, f))
    }

    // Charging: the light, the screen and the battery, once the plug is home.
    const c = charge.current
    const on = a.charging && m.plug > 0.97
    // The x-ray of the whole cable waits for the plug to be home, along with the light.
    const lit = storyHighlight(t)
    highlight.current = lit === 'charge' && !on ? null : lit
    c.level = THREE.MathUtils.damp(c.level, on ? 1 : 0, on ? 3 : 6, dt)
    if (on) c.battery = Math.min(1, c.battery + dt / FILL_SECONDS)
    else if (c.level < 0.02) c.battery = BATTERY_FROM
    c.time += dt
    fx.setPulses(c.time, c.level)
    fx.drawScreen(c.battery)
    if (screen.current) screen.current.emissiveIntensity = c.level
    // The plug fades in as it forms, and x-rays with the cable while charging.
    const plugOpacity = Math.min(1, a.form * 1.6) * (1 - c.level * 0.84)
    for (const m of plugMats.current) {
      if (!m) continue
      m.opacity = plugOpacity
      m.depthWrite = plugOpacity > 0.99
    }
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
    />
  )

  return (
    <>
      <group ref={cable}>
        <CableAnatomyModel explodeRef={explode} shownRef={shownExplode} highlightRef={highlight} closeRef={close} reach={REACH} tilt={0} />
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
  markers,
  animate,
  onReady,
}: {
  /** The story's position, 0 to STORY_STEPS, set by scroll. */
  target: RefObject<number>
  markers: RefObject<Array<HTMLElement | null>>
  animate: boolean
  onReady: () => void
}) {
  // The story's eased position, shared by the camera and the model (-1 until the first frame).
  const story = useRef(-1)
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: [CLOSE.position.x, CLOSE.position.y, CLOSE.position.z], fov: 30, near: 0.5, far: 600 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Studio />
      <Rig storyRef={story} />
      <StoryModel targetRef={target} storyRef={story} markers={markers} />
      <ContactShadows position={[PORT - 10, FLOOR, 0]} opacity={0.5} scale={170} blur={2.4} far={4} resolution={1024} />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

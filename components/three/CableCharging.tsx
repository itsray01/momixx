'use client'

// The same white silicone cable, now whole, ending in a USB-C plug that slides
// into a plain phone (no brand, no logo) lying on the table. Once it is in, the
// silicone turns see-through (the x-ray look from the anatomy above), light
// pulses run along the copper towards the phone, and its screen wakes with a
// charging ring. `plugRef` (0 = out, 1 = in) and `chargingRef` drive it live;
// `still` freezes one moment for the pre-rendered image.

import { RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { cableColourById } from './cableColours'
import { anatomyColour } from './cableLayers'

const white = cableColourById(anatomyColour)!

/** The phone lies flat, its port on the left short edge at x = 0. Sizes in scene units (about 2 cm each). */
export const PHONE = { length: 7.4, height: 0.42, width: 3.6, radius: 0.2 }
export const AXIS_Y = 0.21
export const CABLE_R = 0.16
const CABLE_FROM = -18
export const BOOT = { length: 1.5, height: 0.5, width: 0.78 }
export const SHELL = { length: 0.62, height: 0.15, width: 0.56 }
/** How far the plug sits from the port before it goes in. */
export const UNPLUGGED = -1.7
export const BATTERY_FROM = 0.24
/** Seconds for the ring to fill, once charging (a picture, not a claim about charging speed). */
export const FILL_SECONDS = 9

export type Effects = ReturnType<typeof makeEffects>

export type ChargingStill = { plug: number; charge: number; battery: number; time: number }

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

// ───────────── The phone's screen, drawn into a texture ─────────────

const SCREEN_W = 1024
const SCREEN_H = Math.round((SCREEN_W * (PHONE.width - 0.3)) / (PHONE.length - 0.3))

function drawScreen(g: CanvasRenderingContext2D, battery: number) {
  const w = SCREEN_W
  const h = SCREEN_H
  g.clearRect(0, 0, w, h)
  g.fillStyle = '#000'
  g.fillRect(0, 0, w, h)
  const cx = w * 0.36
  const cy = h * 0.5
  const r = h * 0.3
  const full = battery >= 0.999
  // Track, then the filled arc with a soft glow.
  g.lineCap = 'round'
  g.lineWidth = h * 0.045
  g.strokeStyle = 'rgba(255,255,255,0.12)'
  g.beginPath()
  g.arc(cx, cy, r, 0, Math.PI * 2)
  g.stroke()
  g.save()
  g.shadowColor = 'rgba(255,240,220,0.9)'
  g.shadowBlur = h * 0.06
  g.strokeStyle = '#fff6ec'
  g.beginPath()
  g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * battery)
  g.stroke()
  g.restore()
  // A lightning bolt in the middle of the ring.
  const s = r * 0.62
  g.fillStyle = '#fff6ec'
  g.beginPath()
  g.moveTo(cx + s * 0.12, cy - s * 0.62)
  g.lineTo(cx - s * 0.36, cy + s * 0.08)
  g.lineTo(cx - s * 0.02, cy + s * 0.08)
  g.lineTo(cx - s * 0.14, cy + s * 0.62)
  g.lineTo(cx + s * 0.36, cy - s * 0.1)
  g.lineTo(cx + s * 0.02, cy - s * 0.1)
  g.closePath()
  g.fill()
  // The level, and what it is doing.
  const font = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif'
  g.textBaseline = 'alphabetic'
  g.fillStyle = '#ffffff'
  g.font = `600 ${Math.round(h * 0.25)}px ${font}`
  g.fillText(`${Math.round(battery * 100)}%`, w * 0.58, cy + h * 0.06)
  g.fillStyle = 'rgba(255,255,255,0.55)'
  g.font = `500 ${Math.round(h * 0.075)}px ${font}`
  g.fillText(full ? 'Charged' : 'Charging', w * 0.585, cy + h * 0.2)
}

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  s.lineTo(w / 2, h / 2 - r)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  s.lineTo(-w / 2 + r, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  s.lineTo(-w / 2, -h / 2 + r)
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
  const geo = new THREE.ShapeGeometry(s, 8)
  // UVs from 0 to 1 across the screen, for the texture.
  const pos = geo.attributes.position
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geo
}

// ───────────── Light running along the copper ─────────────

const pulseVertex = /* glsl */ `
  varying float vX;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vX = world.x;
    vec4 mv = viewMatrix * world;
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const pulseFragment = /* glsl */ `
  uniform float uTime;
  uniform float uCharge;
  uniform float uFreq;
  uniform float uSpeed;
  uniform vec3 uColor;
  varying float vX;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    // Pulses travel towards the phone (+x): a soft head with a longer tail behind it.
    float s = fract(vX * uFreq - uTime * uSpeed);
    float pulse = exp(-pow((s - 0.85) * 9.0, 2.0)) + 0.55 * exp(-pow((s - 0.6) * 4.0, 2.0)) * step(s, 0.85);
    // Brighter through the middle of the tube, fading at its edges, like light inside it.
    float core = pow(max(dot(vNormalV, vViewDir), 0.0), 1.6);
    float a = uCharge * core * (0.18 + 1.25 * pulse);
    gl_FragColor = vec4(uColor * a, a);
  }
`

/**
 * Everything the scene changes frame by frame (the pulse shader's clock and the
 * screen's texture), made once and changed only through these methods.
 */
export function makeEffects({ freq = 0.32, speed = 0.9 }: { freq?: number; speed?: number } = {}) {
  const pulses = new THREE.ShaderMaterial({
    vertexShader: pulseVertex,
    fragmentShader: pulseFragment,
    uniforms: { uTime: { value: 0 }, uCharge: { value: 0 }, uFreq: { value: freq }, uSpeed: { value: speed }, uColor: { value: new THREE.Color('#ffd9a8') } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const canvas = document.createElement('canvas')
  canvas.width = SCREEN_W
  canvas.height = SCREEN_H
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  let drawn = -1
  return {
    pulses,
    texture,
    setPulses(time: number, charge: number) {
      pulses.uniforms.uTime.value = time
      pulses.uniforms.uCharge.value = charge
    },
    /** Redraws the screen only when the shown percentage changes. */
    drawScreen(battery: number) {
      const shown = Math.round(battery * 100)
      if (shown === drawn) return
      const g = canvas.getContext('2d')
      if (g) drawScreen(g, battery)
      texture.needsUpdate = true
      drawn = shown
    },
    dispose() {
      pulses.dispose()
      texture.dispose()
    },
  }
}

/** A cylinder along x from a to b. */
function Rod({ a, b, r, y = AXIS_Y, z = 0, children }: { a: number; b: number; r: number; y?: number; z?: number; children: React.ReactNode }) {
  return (
    <mesh position={[(a + b) / 2, y, z]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r, r, b - a, 40]} />
      {children}
    </mesh>
  )
}

/**
 * A plain phone lying flat: graphite slab, black glass front, the charging screen
 * (from `fx`) and a port on its left short edge. The port is at x = 0, the table at y = 0.
 */
export function PhoneModel({ fx, screenRef }: { fx: Effects; screenRef: RefObject<THREE.MeshPhysicalMaterial | null> }) {
  const screenGeo = useMemo(() => roundedRect(PHONE.length - 0.3, PHONE.width - 0.3, 0.12), [])
  const glassGeo = useMemo(() => roundedRect(PHONE.length - 0.04, PHONE.width - 0.04, PHONE.radius - 0.02), [])
  return (
    <group>
      {/* The phone: a plain graphite slab with a black glass front and a port on its left edge. */}
      <RoundedBox args={[PHONE.length, PHONE.height, PHONE.width]} radius={PHONE.radius} smoothness={6} position={[PHONE.length / 2, PHONE.height / 2, 0]}>
        <meshPhysicalMaterial color="#2a2d32" metalness={0.65} roughness={0.32} clearcoat={0.3} />
      </RoundedBox>
      <mesh geometry={glassGeo} rotation={[-Math.PI / 2, 0, 0]} position={[PHONE.length / 2, PHONE.height + 0.002, 0]}>
        <meshPhysicalMaterial color="#060607" roughness={0.06} metalness={0} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      <mesh geometry={screenGeo} rotation={[-Math.PI / 2, 0, 0]} position={[PHONE.length / 2, PHONE.height + 0.004, 0]}>
        <meshPhysicalMaterial ref={screenRef} color="#000000" roughness={0.08} clearcoat={1} clearcoatRoughness={0.04} emissive="#ffffff" emissiveMap={fx.texture} emissiveIntensity={0} toneMapped={false} />
      </mesh>
      {/* The port: a dark rounded slot in the phone's edge. */}
      <RoundedBox args={[0.04, SHELL.height + 0.05, SHELL.width + 0.06]} radius={0.06} smoothness={4} position={[-0.005, AXIS_Y, 0]}>
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </RoundedBox>
    </group>
  )
}

export function CableChargingModel({ plugRef, chargingRef, still }: { plugRef?: RefObject<number>; chargingRef?: RefObject<boolean>; still?: ChargingStill }) {
  const plug = useRef<THREE.Group>(null)
  const silicone = useRef<Array<THREE.MeshPhysicalMaterial | null>>([])
  const screen = useRef<THREE.MeshPhysicalMaterial>(null)
  const [fx] = useState(makeEffects)
  const invalidate = useThree((s) => s.invalidate)
  const state = useRef({ plug: still?.plug ?? 0, charge: still?.charge ?? 0, battery: still?.battery ?? BATTERY_FROM, time: still?.time ?? 0 })

  useEffect(() => () => fx.dispose(), [fx])

  useFrame((_, delta) => {
    const st = state.current
    const dt = Math.min(delta, 0.1)
    if (still) {
      Object.assign(st, { plug: still.plug, charge: still.charge, battery: still.battery, time: still.time })
    } else {
      const target = plugRef?.current ?? 0
      // Eased gently, so the plug glides in rather than jumping, however fast the scroll.
      st.plug = THREE.MathUtils.damp(st.plug, target, 2.5, dt)
      // Charging starts only once the plug is fully home.
      const on = !!chargingRef?.current && st.plug > 0.97
      st.charge = THREE.MathUtils.damp(st.charge, on ? 1 : 0, on ? 3 : 6, dt)
      if (on) st.battery = Math.min(1, st.battery + dt / FILL_SECONDS)
      else if (st.charge < 0.02) st.battery = BATTERY_FROM
      st.time += dt
    }

    if (plug.current) plug.current.position.x = UNPLUGGED * (1 - ease(Math.min(1, Math.max(0, st.plug))))
    // The silicone goes see-through while charging, so the light inside shows.
    const opacity = 1 - st.charge * 0.72
    for (const m of silicone.current) {
      if (!m) continue
      m.opacity = opacity
      m.depthWrite = opacity > 0.99
    }
    fx.setPulses(st.time, st.charge)
    if (screen.current) screen.current.emissiveIntensity = st.charge
    fx.drawScreen(st.battery)
    if (!still && (Math.abs(st.plug - (plugRef?.current ?? 0)) > 0.002 || st.charge > 0.002)) invalidate()
  })

  const jacketMat = (i: number) => (
    <meshPhysicalMaterial
      ref={(m) => void (silicone.current[i] = m)}
      color={white.jacket}
      roughness={0.38}
      sheen={0.8}
      sheenColor="#ffffff"
      sheenRoughness={0.5}
      clearcoat={0.4}
      transparent
    />
  )

  const plugX = -0.02 // the boot's front face, just short of the phone when the plug is in
  const bootMid = plugX - BOOT.length / 2
  const reliefTo = plugX - BOOT.length

  return (
    <group>
      <PhoneModel fx={fx} screenRef={screen} />

      {/* The cable and its plug move together as the plug goes in. */}
      <group ref={plug}>
        {/* Copper running the length of the cable into the plug, with light pulsing along it. */}
        {[-0.055, 0.055].map((z) => (
          <group key={z}>
            <Rod a={CABLE_FROM} b={plugX - 0.12} r={0.034} z={z}>
              <meshStandardMaterial color="#c98a55" metalness={0.85} roughness={0.3} />
            </Rod>
            <Rod a={CABLE_FROM} b={plugX - 0.12} r={0.075} z={z}>
              <primitive object={fx.pulses} attach="material" />
            </Rod>
          </group>
        ))}
        <Rod a={CABLE_FROM} b={reliefTo - 0.5} r={CABLE_R}>
          {jacketMat(0)}
        </Rod>
        {/* Strain relief, tapering from the plug into the cable. */}
        <mesh position={[reliefTo - 0.25, AXIS_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Narrow where it meets the cable (the cylinder's top turns to face left), wide at the plug. */}
          <cylinderGeometry args={[CABLE_R, 0.2, 0.5, 40]} />
          {jacketMat(1)}
        </mesh>
        <RoundedBox args={[BOOT.length, BOOT.height, BOOT.width]} radius={0.22} smoothness={6} position={[bootMid, AXIS_Y, 0]}>
          {jacketMat(2)}
        </RoundedBox>
        {/* The metal USB-C shell; inside the phone once plugged in. */}
        <RoundedBox args={[SHELL.length, SHELL.height, SHELL.width]} radius={0.07} smoothness={4} position={[plugX + SHELL.length / 2, AXIS_Y, 0]}>
          <meshPhysicalMaterial color="#d9dde2" metalness={1} roughness={0.22} />
        </RoundedBox>
      </group>
    </group>
  )
}

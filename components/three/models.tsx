'use client'

// Procedural 3D models of Momixx's materials, machines and markets. They are
// used two ways: live in hero scenes, and pre-rendered to transparent images
// for cards (see scripts/render-models.mjs), so pages with many cards stay fast.

import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { CableAnatomyModel } from './CableAnatomy'
import { anatomyStillExplode } from './cableLayers'
import { ExtruderLineModel } from './ExtruderLine'
import { HeroCableModel } from './HeroCable'
import { DuneModel, HumanoidModel, MedicalTubingModel, SwatchFanModel, WaferModel } from './modelsDetailed'
import { landDots } from './landDots'
import type { ModelName } from './modelNames'
import { TEAL, TEAL_DARK, TEAL_LIGHT } from './Studio'

const COPPER = '#c98a55'
const GRAPHITE = '#1c2533'
const STEEL = '#c3ccd6'

// ───────────────────────── Materials ─────────────────────────

export function Silicone({ color = TEAL, opacity = 1 }: { color?: string; opacity?: number }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.36}
      clearcoat={0.7}
      clearcoatRoughness={0.25}
      sheen={0.6}
      sheenRoughness={0.4}
      sheenColor="#ffffff"
      transparent={opacity < 1}
      opacity={opacity}
    />
  )
}
const Steel = ({ color = STEEL }: { color?: string }) => <meshStandardMaterial color={color} metalness={0.9} roughness={0.28} />
const Graphite = () => <meshStandardMaterial color={GRAPHITE} metalness={0.4} roughness={0.45} />
const Copper = () => <meshStandardMaterial color={COPPER} metalness={1} roughness={0.25} />
const Glow = ({ color = TEAL_LIGHT, intensity = 2 }: { color?: string; intensity?: number }) => (
  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
)
const Clear = ({ tint = '#eef8f7', opacity = 0.5 }: { tint?: string; opacity?: number }) => (
  <meshPhysicalMaterial color={tint} roughness={0.05} metalness={0} clearcoat={1} transparent opacity={opacity} depthWrite={false} />
)

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

function Tube({ points, radius, color = TEAL, segments = 160 }: { points: THREE.Vector3[]; radius: number; color?: string; segments?: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  return (
    <mesh>
      <tubeGeometry args={[curve, segments, radius, 48, false]} />
      <Silicone color={color} />
    </mesh>
  )
}

/** A flat band bent into an arc (watch straps, gaskets). */
function bentBand(width: number, thickness: number, radius: number, arc: number) {
  const g = new THREE.BoxGeometry(width, thickness, radius * arc, 2, 2, 96)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const a = p.getZ(i) / radius
    const r = radius + p.getY(i)
    p.setY(i, Math.cos(a) * r)
    p.setZ(i, Math.sin(a) * r)
  }
  g.computeVertexNormals()
  return g
}

function roundedRectShape(w: number, h: number, r: number) {
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
  return s
}

// ───────────────────────── Models ─────────────────────────

/** Orange high-voltage EV cable ending in a charging connector. */
function EvCableModel() {
  const points = useMemo(() => [v(-3.6, -2.2, -2.6), v(-2.2, -1.6, -1.2), v(-1.1, -1.2, -0.2), v(-0.4, -0.9, 0.6), v(-0.1, -0.7, 1.2)], [])
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  const end = useMemo(() => curve.getPoint(1), [curve])
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(v(0, 0, 1), curve.getTangent(1).normalize()), [curve])
  const pins: Array<[number, number, number]> = [
    [0, 0.32, 0.11],
    [-0.3, 0.1, 0.11],
    [0.3, 0.1, 0.11],
    [-0.19, -0.24, 0.11],
    [0.19, -0.24, 0.11],
    [-0.15, -0.5, 0.07],
    [0.15, -0.5, 0.07],
  ]
  return (
    <group position={[0.6, 0.3, -1.2]}>
      <mesh>
        <tubeGeometry args={[curve, 160, 0.42, 48, false]} />
        <Silicone color="#f97316" />
      </mesh>
      <group position={end} quaternion={quat}>
        {/* strain relief and handle */}
        <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.44, 0.5, 48]} />
          <Graphite />
        </mesh>
        <mesh position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.82, 0.62, 1.2, 64]} />
          <Graphite />
        </mesh>
        <mesh position={[0, 0, 1.66]}>
          <torusGeometry args={[0.72, 0.06, 16, 64]} />
          <Silicone color="#f97316" />
        </mesh>
        <mesh position={[0, 0, 1.64]}>
          <circleGeometry args={[0.7, 64]} />
          <meshStandardMaterial color="#0b121c" roughness={0.6} />
        </mesh>
        {pins.map(([x, y, r], i) => (
          <mesh key={i} position={[x, y, 1.66]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[r, r, 0.08, 24]} />
            <Copper />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** Smartwatch with a PFAS-free high-density silicone strap. */
function WatchModel() {
  const strap = useMemo(() => bentBand(1.05, 0.14, 1.45, Math.PI * 1.55), [])
  return (
    <group rotation={[1.05, -0.5, 0.15]} position={[0, -0.35, 0]}>
      <mesh geometry={strap}>
        <Silicone color={TEAL} />
      </mesh>
      <group position={[0, 1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <RoundedBox args={[1.45, 1.7, 0.5]} radius={0.28} smoothness={6}>
          <meshStandardMaterial color="#2a3442" metalness={0.85} roughness={0.25} />
        </RoundedBox>
        <RoundedBox args={[1.25, 1.5, 0.08]} radius={0.22} smoothness={6} position={[0, 0, 0.24]}>
          <meshPhysicalMaterial color="#05070a" roughness={0.05} clearcoat={1} />
        </RoundedBox>
        <mesh position={[0, 0.05, 0.29]}>
          <torusGeometry args={[0.38, 0.045, 16, 64, Math.PI * 1.6]} />
          <Glow />
        </mesh>
        <mesh position={[0, 0.05, 0.29]}>
          <torusGeometry args={[0.26, 0.04, 16, 64, Math.PI * 1.1]} />
          <Glow color="#f97316" intensity={1.6} />
        </mesh>
        <mesh position={[0.8, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.16, 24]} />
          <Steel />
        </mesh>
      </group>
    </group>
  )
}

/** Phone in a self-bonding silicone case. */
function PhoneCaseModel() {
  return (
    <group rotation={[0.15, Math.PI - 0.6, 0.12]} scale={0.9}>
      <RoundedBox args={[2, 3.9, 0.36]} radius={0.3} smoothness={6}>
        <Silicone color={TEAL} />
      </RoundedBox>
      <RoundedBox args={[1.8, 3.7, 0.3]} radius={0.26} smoothness={6} position={[0, 0, 0.06]}>
        <meshPhysicalMaterial color="#05070a" roughness={0.08} clearcoat={1} />
      </RoundedBox>
      {/* camera module on the back */}
      <group position={[-0.42, 1.25, -0.2]} rotation={[Math.PI, 0, 0]}>
        <RoundedBox args={[0.95, 0.95, 0.12]} radius={0.22} smoothness={5}>
          <Silicone color={TEAL_DARK} />
        </RoundedBox>
        {[
          [-0.2, 0.2],
          [0.2, -0.2],
          [-0.2, -0.2],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, 0.07]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.06, 32]} />
              <Steel color="#8b97a6" />
            </mesh>
            <mesh position={[0, 0, 0.032]}>
              <circleGeometry args={[0.1, 32]} />
              <meshPhysicalMaterial color="#020617" roughness={0} clearcoat={1} />
            </mesh>
          </group>
        ))}
      </group>
      {/* side buttons moulded in the case */}
      <RoundedBox args={[0.08, 0.55, 0.14]} radius={0.03} position={[1.02, 0.7, 0]}>
        <Silicone color={TEAL} />
      </RoundedBox>
    </group>
  )
}

/** Waterproof O-ring and gasket with water beading on them. */
function SealModel() {
  const gasket = useMemo(() => {
    const outer = roundedRectShape(3.2, 2.2, 0.55)
    outer.holes.push(roundedRectShape(2.5, 1.5, 0.3))
    const g = new THREE.ExtrudeGeometry(outer, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 6, curveSegments: 32 })
    g.center()
    return g
  }, [])
  const drops: Array<[number, number, number, number]> = [
    [-0.9, 0.98, 0.25, 0.16],
    [0.6, 0.98, -0.6, 0.12],
    [1.2, 0.98, 0.3, 0.1],
    [0.9, 1.75, 0.55, 0.14],
  ]
  return (
    <group rotation={[0.35, -0.5, 0]} position={[0, -0.3, 0]}>
      <mesh geometry={gasket} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.85, 0]}>
        <Silicone color="#e8eef3" />
      </mesh>
      <mesh position={[0.4, 1.7, 0.2]} rotation={[0.2, 0.5, 0.15]}>
        <torusGeometry args={[0.85, 0.2, 48, 96]} />
        <Silicone color={TEAL} />
      </mesh>
      {drops.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y + r * 0.55, z]} scale={[1, 0.62, 1]}>
          <sphereGeometry args={[r, 32, 32]} />
          <meshPhysicalMaterial color="#cdeefe" roughness={0} clearcoat={1} transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  )
}

/** Raw silicone compound: fanned sheets and pellets. */
function CompoundModel() {
  const sheets = [TEAL, '#e8eef3', TEAL_DARK]
  return (
    <group rotation={[0.55, -0.6, 0]} position={[0, -0.3, 0]}>
      {sheets.map((c, i) => (
        <RoundedBox key={c} args={[3, 0.22, 2.1]} radius={0.1} smoothness={5} position={[i * 0.15, i * 0.26, -i * 0.12]} rotation={[0, i * 0.22, 0]}>
          <Silicone color={c} />
        </RoundedBox>
      ))}
      {[
        [-1.4, 0.8, 1.2, TEAL_LIGHT],
        [-0.9, 0.82, 1.5, TEAL],
        [-1.7, 0.78, 0.7, '#e8eef3'],
        [1.6, 0.9, 1.0, '#f97316'],
      ].map(([x, y, z, c], i) => (
        <RoundedBox key={i} args={[0.42, 0.42, 0.42]} radius={0.12} smoothness={4} position={[x as number, y as number, z as number]} rotation={[i, i * 0.7, 0]}>
          <Silicone color={c as string} />
        </RoundedBox>
      ))}
    </group>
  )
}

/** A silicone ring with material flowing round it: scrap (grey) becomes new silicone (teal). */
export function LoopModel({ particles = 90, tilt = true }: { particles?: number; tilt?: boolean }) {
  const data = useMemo(() => {
    const gray = new THREE.Color('#8b97a6')
    const teal = new THREE.Color('#34bdb0')
    return Array.from({ length: particles }, (_, i) => {
      const u = (i / particles) * Math.PI * 2
      const w = u * 6 + i
      const r = 2.1 + Math.cos(w) * 0.62
      return {
        p: [Math.cos(u) * r, Math.sin(u) * r, Math.sin(w) * 0.62] as [number, number, number],
        s: 0.09 + (i % 3) * 0.025,
        c: gray.clone().lerp(teal, Math.min(1, Math.max(0, (i / particles - 0.15) / 0.6))),
      }
    })
  }, [particles])
  return (
    <group rotation={tilt ? [0.9, 0, 0.2] : [0, 0, 0]} scale={0.85}>
      <mesh>
        <torusGeometry args={[2.1, 0.42, 64, 160]} />
        <Silicone />
      </mesh>
      {data.map((d, i) => (
        <mesh key={i} position={d.p} scale={d.s}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhysicalMaterial color={d.c} roughness={0.3} clearcoat={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/** Clear PCTG bottle with a teal cap. */
function BottleModel() {
  const profile = useMemo(
    () =>
      [
        [0, -1.9],
        [0.82, -1.9],
        [0.9, -1.8],
        [0.9, 0.6],
        [0.8, 0.95],
        [0.45, 1.25],
        [0.38, 1.35],
        [0.38, 1.55],
        [0, 1.55],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  )
  return (
    <group rotation={[0.15, 0, -0.08]} scale={1.05}>
      <mesh>
        <latheGeometry args={[profile, 64]} />
        <Clear />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.84, 0.84, 1.9, 64]} />
        <meshPhysicalMaterial color="#5ee0d2" roughness={0.1} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.42, 48]} />
        <Silicone color={TEAL} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.7, 64, 1, true]} />
        <meshStandardMaterial color="#e8eef3" roughness={0.6} side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

/** Horizontal extruder: hopper, barrel, crosshead and the coated cable. */
function HorizontalExtruderModel() {
  return (
    <group rotation={[0.25, -0.65, 0]} position={[0.2, -0.4, 0]}>
      <RoundedBox args={[3.6, 0.7, 1.3]} radius={0.1} position={[-0.3, -0.6, 0]}>
        <Graphite />
      </RoundedBox>
      <mesh position={[-0.4, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 3.1, 48]} />
        <Steel />
      </mesh>
      {[-1.4, -0.7, 0, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.47, 0.47, 0.2, 48]} />
          <meshStandardMaterial color="#e8eef3" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-1.2, 1.05, 0]}>
        <cylinderGeometry args={[0.65, 0.22, 1, 48]} />
        <Steel color="#9aa7b6" />
      </mesh>
      <RoundedBox args={[0.7, 1.1, 0.9]} radius={0.08} position={[1.35, 0.15, 0]}>
        <Silicone color={TEAL} />
      </RoundedBox>
      <mesh position={[2.75, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 2.2, 32]} />
        <Silicone color={TEAL} />
      </mesh>
    </group>
  )
}

/** Two-part LSR mixer: drums A and B feeding a static mixer. */
function MixerModel() {
  return (
    <group rotation={[0.3, -0.5, 0]} position={[0, -0.4, 0]}>
      {[
        [-0.95, TEAL],
        [0.95, '#e8eef3'],
      ].map(([x, c]) => (
        <group key={x as number} position={[x as number, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.75, 0.75, 1.9, 64]} />
            <meshStandardMaterial color={c as string} roughness={0.35} metalness={0.3} />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.14, 64]} />
            <Steel />
          </mesh>
        </group>
      ))}
      <Tube points={[v(-0.95, 1.05, 0), v(-0.6, 1.7, 0.3), v(0, 1.85, 0.7)]} radius={0.08} color="#9aa7b6" />
      <Tube points={[v(0.95, 1.05, 0), v(0.6, 1.7, 0.3), v(0, 1.85, 0.7)]} radius={0.08} color="#9aa7b6" />
      <mesh position={[0, 1.4, 0.8]}>
        <cylinderGeometry args={[0.16, 0.08, 1.0, 32]} />
        <Steel />
      </mesh>
      <mesh position={[0, 0.82, 0.8]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <Silicone color={TEAL_LIGHT} />
      </mesh>
      <RoundedBox args={[3.4, 0.25, 1.9]} radius={0.06} position={[0, -1.1, 0]}>
        <Graphite />
      </RoundedBox>
    </group>
  )
}

/** Cable spool, neatly wound by the vision-guided autowinder. */
function WinderModel() {
  return (
    <group rotation={[0.2, -0.75, 0]} position={[-0.2, 0, 0]}>
      <group rotation={[0, 0, Math.PI / 2]}>
        {[-0.9, 0.9].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[1.6, 1.6, 0.1, 64]} />
            <Steel color="#dbe2ea" />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 1.8, 48]} />
          <Graphite />
        </mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[0, -0.8 + i * 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.12, 0.1, 16, 64]} />
            <Silicone />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** Energy-saving curing oven with cable passing through. */
function OvenModel() {
  return (
    <group rotation={[0.3, -0.6, 0]} position={[0, -0.2, 0]}>
      <RoundedBox args={[3.6, 1.3, 1.4]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#e8eef3" roughness={0.45} metalness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0.1, 0.71]}>
        <planeGeometry args={[2.8, 0.36]} />
        <meshStandardMaterial color="#7c2d12" emissive="#f97316" emissiveIntensity={1.1} />
      </mesh>
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <mesh key={x} position={[x, -0.36, 0.71]}>
          <planeGeometry args={[0.5, 0.06]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 6, 32]} />
        <Silicone />
      </mesh>
      <RoundedBox args={[3.8, 0.2, 1.6]} radius={0.05} position={[0, -0.78, 0]}>
        <Graphite />
      </RoundedBox>
    </group>
  )
}

/** Dip-coating: cable runs down into a coating bath and back up. */
function CoatingModel() {
  const path = useMemo(() => [v(-2.6, 1.6, 0), v(-1.2, 1.4, 0), v(-0.4, -0.55, 0), v(0.4, -0.55, 0), v(1.2, 1.4, 0), v(2.6, 1.6, 0)], [])
  return (
    <group rotation={[0.3, -0.5, 0]} position={[0, -0.2, 0]}>
      <Tube points={path} radius={0.11} />
      <RoundedBox args={[2.6, 1.0, 1.3]} radius={0.1} position={[0, -0.75, 0]}>
        <meshStandardMaterial color="#e8eef3" roughness={0.4} metalness={0.3} transparent opacity={0.55} />
      </RoundedBox>
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.45, 1.15]} />
        <meshPhysicalMaterial color={TEAL_LIGHT} roughness={0.05} clearcoat={1} transparent opacity={0.85} />
      </mesh>
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.3, 32]} />
          <Steel />
        </mesh>
      ))}
    </group>
  )
}

/** Precision moulding: an open steel mould with a moulded silicone part. */
function OemModel() {
  return (
    <group rotation={[0.45, -0.55, 0]} position={[0, -0.3, 0]}>
      <RoundedBox args={[2.6, 0.7, 2]} radius={0.06} position={[0, -0.4, 0]}>
        <Steel />
      </RoundedBox>
      <RoundedBox args={[2.6, 0.7, 2]} radius={0.06} position={[0, 1.35, -0.5]} rotation={[-0.45, 0, 0]}>
        <Steel color="#9aa7b6" />
      </RoundedBox>
      <RoundedBox args={[1.5, 0.22, 1.0]} radius={0.1} smoothness={5} position={[0, 0.07, 0]}>
        <Silicone />
      </RoundedBox>
      {[-0.45, 0, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.2, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.1, 32]} />
          <Silicone color={TEAL_LIGHT} />
        </mesh>
      ))}
      {[
        [-1.8, -0.62, 1.3, '#f97316'],
        [-1.2, -0.62, 1.5, '#e8eef3'],
      ].map(([x, y, z, c], i) => (
        <RoundedBox key={i} args={[0.55, 0.12, 0.4]} radius={0.05} position={[x as number, y as number, z as number]} rotation={[0, i * 0.5, 0]}>
          <Silicone color={c as string} />
        </RoundedBox>
      ))}
    </group>
  )
}

/** Server rack with high-temperature silicone cabling. */
function DatacentreModel() {
  return (
    <group rotation={[0.12, -0.55, 0]} position={[-0.3, -0.1, 0]}>
      <RoundedBox args={[1.9, 4, 1.6]} radius={0.06}>
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} position={[0, 1.6 - i * 0.44, 0.81]}>
          <mesh>
            <planeGeometry args={[1.66, 0.34]} />
            <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.4} />
          </mesh>
          {[0, 1, 2].map((k) => (
            <mesh key={k} position={[0.55 + k * 0.1, 0, 0.01]}>
              <circleGeometry args={[0.025, 12]} />
              <Glow color={k === 2 && i % 3 === 0 ? '#f97316' : TEAL_LIGHT} />
            </mesh>
          ))}
        </group>
      ))}
      <Tube points={[v(0.95, 1.2, 0.5), v(1.6, 0.8, 0.9), v(1.8, -0.8, 1.2), v(2.3, -1.9, 0.6)]} radius={0.09} />
      <Tube points={[v(0.95, 0.4, 0.5), v(1.45, 0, 0.8), v(1.55, -1.2, 1.0), v(1.9, -2, 0.4)]} radius={0.09} color="#e8eef3" />
      <Tube points={[v(0.95, -0.4, 0.5), v(1.3, -0.8, 0.7), v(1.3, -1.6, 0.8), v(1.5, -2.1, 0.2)]} radius={0.09} color="#f97316" />
    </group>
  )
}

/** Silicone polymer chain (siloxane backbone). */
export function MoleculeModel() {
  const atoms = useMemo(() => {
    const list: Array<{ p: THREE.Vector3; kind: 'Si' | 'O' | 'C' }> = []
    const bonds: Array<[THREE.Vector3, THREE.Vector3]> = []
    let prevSi: THREE.Vector3 | null = null
    for (let i = 0; i < 5; i++) {
      const si = v(-4 + i * 2, i % 2 ? 0.35 : -0.35, 0)
      list.push({ p: si, kind: 'Si' })
      const a = i % 2 ? 0 : Math.PI / 2
      const c1 = si.clone().add(v(0, 1.15 * Math.cos(a), 1.15 * Math.sin(a)))
      const c2 = si.clone().add(v(0, -1.15 * Math.cos(a), -1.15 * Math.sin(a)))
      list.push({ p: c1, kind: 'C' }, { p: c2, kind: 'C' })
      bonds.push([si, c1], [si, c2])
      if (prevSi) {
        const o = prevSi.clone().add(si).multiplyScalar(0.5).add(v(0, 0, 0.5))
        list.push({ p: o, kind: 'O' })
        bonds.push([prevSi, o], [o, si])
      }
      prevSi = si
    }
    return { list, bonds }
  }, [])
  const style = { Si: { r: 0.48, c: '#34bdb0' }, O: { r: 0.34, c: '#f87171' }, C: { r: 0.3, c: '#e8eef3' } }
  return (
    <group scale={0.62} rotation={[0.3, -0.3, 0.1]}>
      {atoms.bonds.map(([a, b], i) => {
        const dir = new THREE.Vector3().subVectors(b, a)
        return (
          <mesh
            key={i}
            position={new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)}
            quaternion={new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), dir.clone().normalize())}
          >
            <cylinderGeometry args={[0.07, 0.07, dir.length(), 12]} />
            <meshStandardMaterial color="#64748b" roughness={0.5} />
          </mesh>
        )
      })}
      {atoms.list.map((a, i) => (
        <mesh key={i} position={a.p}>
          <sphereGeometry args={[style[a.kind].r, 32, 32]} />
          <meshPhysicalMaterial color={style[a.kind].c} roughness={0.3} clearcoat={0.8} />
        </mesh>
      ))}
    </group>
  )
}

const swatches = ['#149f94', '#0e514e', '#e8eef3', '#0b121c', '#f97316', '#34bdb0', '#6dd5c9', '#c98a55', '#f87171']

/** Colour-matched silicone samples. */
export function SamplesModel({ float }: { float?: (i: number, node: React.ReactNode) => React.ReactNode }) {
  return (
    <group rotation={[0.35, -0.5, 0.1]} scale={0.85}>
      {swatches.map((c, i) => {
        const x = (i % 3) - 1
        const y = 1 - Math.floor(i / 3)
        const node = (
          <RoundedBox key={c} args={[1.25, 1.25, 0.32]} radius={0.14} smoothness={5} position={[x * 1.55, y * 1.55, ((i * 7) % 3) * 0.25 - 0.25]}>
            <Silicone color={c} opacity={i === 6 ? 0.75 : 1} />
          </RoundedBox>
        )
        return float ? float(i, node) : node
      })}
    </group>
  )
}

// ───────────────────────── Registry ─────────────────────────


// ───────────────────────── Globe ─────────────────────────

/** Where Momixx is today: Singapore HQ and Batu Kawan, Penang. */
export const globeSites = [
  { name: 'Singapore', lat: 1.29, lon: 103.85 },
  { name: 'Batu Kawan, Penang', lat: 5.23, lon: 100.43 },
]

const GLOBE_R = 1.85
const toRad = THREE.MathUtils.degToRad
function latLon(lat: number, lon: number, r = GLOBE_R) {
  const phi = toRad(lat)
  const lambda = toRad(lon)
  return new THREE.Vector3(r * Math.cos(phi) * Math.sin(lambda), r * Math.sin(phi), r * Math.cos(phi) * Math.cos(lambda))
}

const atmosphereShader = {
  uniforms: { color: { value: new THREE.Color(TEAL_LIGHT) } },
  vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform vec3 color; varying vec3 vN; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0, 0.0, 1.0)), 3.0); gl_FragColor = vec4(color, 1.0) * i; }',
}

/** Dotted globe (land from Natural Earth) turned to face Asia, with our sites lit up. */
export function GlobeModel({ spin = false }: { spin?: boolean }) {
  const dots = useRef<THREE.InstancedMesh>(null)
  const turn = useRef<THREE.Group>(null)
  const count = landDots.length / 2
  useLayoutEffect(() => {
    const m = dots.current
    if (!m) return
    const o = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const p = latLon(landDots[i * 2], landDots[i * 2 + 1], GLOBE_R * 1.004)
      o.position.copy(p)
      o.lookAt(p.clone().multiplyScalar(2))
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  }, [count])
  // Sway gently either side of Asia, so our sites stay in view.
  const facing = -toRad(103) + 0.22
  useFrame((state) => {
    if (spin && turn.current) turn.current.rotation.y = facing + Math.sin(state.clock.elapsedTime * 0.12) * 0.6
  })
  return (
    <group rotation={[0.14, 0, 0.06]}>
      <group ref={turn} rotation={[0, facing, 0]}>
        <mesh>
          <sphereGeometry args={[GLOBE_R, 96, 96]} />
          <meshStandardMaterial color="#0a1420" emissive="#04201d" roughness={0.55} metalness={0.35} />
        </mesh>
        <instancedMesh ref={dots} args={[undefined, undefined, count]}>
          <circleGeometry args={[0.019, 8]} />
          <meshBasicMaterial color={TEAL_LIGHT} toneMapped={false} transparent opacity={0.9} />
        </instancedMesh>
        {globeSites.map((s) => {
          const p = latLon(s.lat, s.lon, GLOBE_R * 1.01)
          return (
            <group key={s.name} position={p} onUpdate={(g) => g.lookAt(p.clone().multiplyScalar(2))}>
              <mesh>
                <sphereGeometry args={[0.045, 24, 24]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
              <mesh>
                <ringGeometry args={[0.08, 0.1, 48]} />
                <meshBasicMaterial color={TEAL_LIGHT} toneMapped={false} transparent opacity={0.85} side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.006, 0.006, 0.36, 8]} />
                <meshBasicMaterial color={TEAL_LIGHT} toneMapped={false} />
              </mesh>
            </group>
          )
        })}
      </group>
      <mesh scale={1.14}>
        <sphereGeometry args={[GLOBE_R, 64, 64]} />
        <shaderMaterial args={[atmosphereShader]} side={THREE.BackSide} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2 - 0.28, 0.18, 0]}>
        <torusGeometry args={[GLOBE_R * 1.32, 0.006, 8, 200]} />
        <meshBasicMaterial color={TEAL_LIGHT} toneMapped={false} transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

export const modelRegistry: Record<ModelName, () => React.JSX.Element> = {
  'data-cable': () => <HeroCableModel path="card" />,
  'cable-hero': () => <HeroCableModel path="hero" />,
  'ev-cable': () => <EvCableModel />,
  watchband: () => <WatchModel />,
  'phone-case': () => <PhoneCaseModel />,
  seal: () => <SealModel />,
  compound: () => <CompoundModel />,
  recycle: () => <LoopModel />,
  bottle: () => <BottleModel />,
  'extruder-vertical': () => (
    <group position={[1.6, -2.45, 0]} scale={0.85}>
      <ExtruderLineModel tower />
    </group>
  ),
  'extruder-horizontal': () => <HorizontalExtruderModel />,
  mixer: () => <MixerModel />,
  winder: () => <WinderModel />,
  oven: () => <OvenModel />,
  coating: () => <CoatingModel />,
  oem: () => <OemModel />,
  medical: () => <MedicalTubingModel />,
  datacentre: () => <DatacentreModel />,
  robot: () => <HumanoidModel />,
  chip: () => <WaferModel />,
  sand: () => <DuneModel />,
  molecule: () => <MoleculeModel />,
  samples: () => <SwatchFanModel />,
  globe: () => <GlobeModel />,
  'extruder-line': () => <ExtruderLineModel />,
  'cable-anatomy': () => <CableAnatomyModel explode={anatomyStillExplode} />,
}

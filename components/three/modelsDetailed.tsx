'use client'

// Higher-detail models for the most visible images: a humanoid robot with
// silicone skin and joints, a silicon wafer, a sand dune with quartz, a colour
// swatch fan and medical tubing. Materials are local to keep this file standalone.

import { RoundedBox } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

const SILICONE = '#e6e7e9'
const GRAPHITE = '#3a3d42'
const HIGHLIGHT = '#f4f5f6'

function SiliconeSkin({ color = SILICONE, roughness = 0.42 }: { color?: string; roughness?: number }) {
  return <meshPhysicalMaterial color={color} roughness={roughness} sheen={0.8} sheenRoughness={0.5} sheenColor="#ffffff" clearcoat={0.35} clearcoatRoughness={0.4} />
}
function Shell({ color = '#eeeff1' }: { color?: string }) {
  return <meshPhysicalMaterial color={color} roughness={0.28} metalness={0.05} clearcoat={0.9} clearcoatRoughness={0.15} />
}
function Joint() {
  return <meshStandardMaterial color="#2a2c30" metalness={0.75} roughness={0.32} />
}

const up = new THREE.Vector3(0, 1, 0)

/** A capsule spanning two points. */
function Limb({ from, to, r, children }: { from: [number, number, number]; to: [number, number, number]; r: number; children: React.ReactNode }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const d = b.clone().sub(a)
    return { pos: a.add(b).multiplyScalar(0.5), quat: new THREE.Quaternion().setFromUnitVectors(up, d.clone().normalize()), len: d.length() }
  }, [from, to])
  return (
    <mesh position={pos} quaternion={quat}>
      <capsuleGeometry args={[r, Math.max(0.001, len - r * 2), 12, 32]} />
      {children}
    </mesh>
  )
}

/** Concertina silicone boot that protects a joint. */
function Bellows({ p, r, rings, gap, rot = [0, 0, 0] }: { p: [number, number, number]; r: number; rings: number; gap: number; rot?: [number, number, number] }) {
  return (
    <group position={p} rotation={rot}>
      <mesh>
        <cylinderGeometry args={[r * 0.82, r * 0.82, gap * rings, 32]} />
        <SiliconeSkin color={GRAPHITE} />
      </mesh>
      {Array.from({ length: rings }, (_, k) => (
        <mesh key={k} position={[0, -((rings - 1) * gap) / 2 + k * gap, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r * 0.86, gap * 0.42, 12, 40]} />
          <SiliconeSkin />
        </mesh>
      ))}
    </group>
  )
}

/** Humanoid robot: hard shell, silicone joint boots and soft silicone fingertips. */
export function HumanoidModel() {
  const wrist: [number, number, number] = [1.45, 0.05, 0.85]
  return (
    <group rotation={[0.04, -0.35, 0]} position={[-0.05, -0.75, 0]} scale={1.22}>
      {/* Head */}
      <group position={[0, 1.55, 0]}>
        <mesh scale={[0.62, 0.72, 0.66]}>
          <sphereGeometry args={[1, 64, 64]} />
          <Shell />
        </mesh>
        <mesh scale={[0.635, 0.735, 0.675]}>
          <sphereGeometry args={[1, 64, 32, -0.85, 1.7, 1.05, 0.8]} />
          <meshPhysicalMaterial color="#050505" roughness={0.04} metalness={0.2} clearcoat={1} side={THREE.DoubleSide} />
        </mesh>
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 0.04, 0.6]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.035, 0.14, 6, 12]} />
            <meshStandardMaterial color={HIGHLIGHT} emissive={HIGHLIGHT} emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 32]} />
            <SiliconeSkin />
          </mesh>
        ))}
      </group>
      {/* Neck boot */}
      <Bellows p={[0, 0.82, 0]} r={0.2} rings={4} gap={0.07} />
      {/* Torso */}
      <RoundedBox args={[1.5, 1.15, 0.82]} radius={0.3} smoothness={6} position={[0, 0.15, 0]}>
        <Shell />
      </RoundedBox>
      <RoundedBox args={[0.9, 0.42, 0.06]} radius={0.03} smoothness={4} position={[0, 0.3, 0.41]}>
        <meshPhysicalMaterial color="#050505" roughness={0.05} clearcoat={1} />
      </RoundedBox>
      <mesh position={[0, 0.3, 0.448]}>
        <boxGeometry args={[0.62, 0.035, 0.01]} />
        <meshStandardMaterial color={HIGHLIGHT} emissive={HIGHLIGHT} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* Waist boot and hips */}
      <Bellows p={[0, -0.62, 0]} r={0.42} rings={4} gap={0.09} />
      <RoundedBox args={[1.1, 0.42, 0.7]} radius={0.18} smoothness={5} position={[0, -1.05, 0]}>
        <Shell color="#e0e2e5" />
      </RoundedBox>
      {/* Shoulders */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.92, 0.5, 0]}>
            <sphereGeometry args={[0.24, 32, 32]} />
            <Joint />
          </mesh>
          <mesh position={[side * 0.92, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.24, 0.05, 12, 40]} />
            <SiliconeSkin />
          </mesh>
        </group>
      ))}
      {/* Left arm, relaxed */}
      <Limb from={[-0.98, 0.42, 0]} to={[-1.12, -0.35, 0.05]} r={0.17}>
        <Shell />
      </Limb>
      <mesh position={[-1.13, -0.42, 0.06]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <Joint />
      </mesh>
      <Limb from={[-1.13, -0.48, 0.08]} to={[-1.05, -1.15, 0.3]} r={0.14}>
        <Shell />
      </Limb>
      {/* Right arm, reaching forward with an open hand */}
      <Limb from={[0.98, 0.42, 0]} to={[1.12, -0.28, 0.32]} r={0.17}>
        <Shell />
      </Limb>
      <mesh position={[1.12, -0.33, 0.36]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <Joint />
      </mesh>
      <mesh position={[1.12, -0.33, 0.36]} rotation={[0.6, 0, 0.2]}>
        <torusGeometry args={[0.15, 0.04, 10, 32]} />
        <SiliconeSkin />
      </mesh>
      <Limb from={[1.14, -0.3, 0.42]} to={wrist} r={0.13}>
        <Shell />
      </Limb>
      <group position={wrist} rotation={[-0.2, 0.75, -0.15]}>
        <RoundedBox args={[0.34, 0.12, 0.36]} radius={0.05} smoothness={4} position={[0, 0, 0.16]}>
          <SiliconeSkin color="#3a3d42" roughness={0.6} />
        </RoundedBox>
        {[-0.12, -0.04, 0.04, 0.12].map((x, k) => (
          <group key={x} position={[x, 0, 0.36]} rotation={[-0.25 - k * 0.04, 0, 0]}>
            <Limb from={[0, 0, 0]} to={[0, 0, 0.22 - Math.abs(x) * 0.5]} r={0.034}>
              <Joint />
            </Limb>
            <mesh position={[0, 0, 0.24 - Math.abs(x) * 0.5]}>
              <sphereGeometry args={[0.045, 20, 20]} />
              <SiliconeSkin />
            </mesh>
          </group>
        ))}
        <group position={[0.2, 0, 0.12]} rotation={[0, 0.9, 0]}>
          <Limb from={[0, 0, 0]} to={[0, 0, 0.18]} r={0.036}>
            <Joint />
          </Limb>
          <mesh position={[0, 0, 0.2]}>
            <sphereGeometry args={[0.047, 20, 20]} />
            <SiliconeSkin />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/** A polished silicon wafer patterned with chips, with one chip lifted off. */
export function WaferModel() {
  const dies = useMemo(() => {
    const out: Array<[number, number]> = []
    const step = 0.26
    for (let x = -1.6; x <= 1.6; x += step) for (let z = -1.6; z <= 1.6; z += step) if (Math.hypot(x, z) < 1.52) out.push([x, z])
    return out
  }, [])
  const ref = useMemo(() => new THREE.Object3D(), [])
  return (
    <group rotation={[0.95, -0.35, 0.12]} position={[0, -0.25, 0]} scale={1.08}>
      <mesh>
        <cylinderGeometry args={[1.75, 1.75, 0.05, 128]} />
        <meshPhysicalMaterial color="#a7acb2" metalness={0.85} roughness={0.16} iridescence={1} iridescenceIOR={1.6} iridescenceThicknessRange={[180, 620]} clearcoat={1} />
      </mesh>
      <instancedMesh
        args={[undefined, undefined, dies.length]}
        ref={(m) => {
          if (!m) return
          dies.forEach(([x, z], i) => {
            ref.position.set(x, 0.032, z)
            ref.updateMatrix()
            m.setMatrixAt(i, ref.matrix)
          })
          m.instanceMatrix.needsUpdate = true
        }}
      >
        <boxGeometry args={[0.235, 0.014, 0.235]} />
        <meshPhysicalMaterial color="#6e747c" metalness={0.8} roughness={0.22} iridescence={1} iridescenceIOR={2} iridescenceThicknessRange={[260, 820]} />
      </instancedMesh>
      {/* The lifted chip, in a graphite silicone-sealed package */}
      <group position={[0.85, 0.75, 0.75]} rotation={[-0.75, 0.5, 0.2]} scale={1.7}>
        <RoundedBox args={[0.62, 0.08, 0.62]} radius={0.02} smoothness={4}>
          <meshStandardMaterial color="#2a2c30" roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[0.4, 0.07, 0.4]} radius={0.015} smoothness={4} position={[0, 0.07, 0]}>
          <meshPhysicalMaterial color="#9aa5b6" metalness={1} roughness={0.15} iridescence={0.8} iridescenceIOR={1.8} />
        </RoundedBox>
        <mesh position={[0, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.02, 10, 48]} />
          <SiliconeSkin color={HIGHLIGHT} />
        </mesh>
      </group>
    </group>
  )
}

/** A dune of quartz sand with clear crystals growing out of it. */
export function DuneModel() {
  const grains = useMemo(() => {
    const pts: Array<[number, number, number, number]> = []
    let seed = 7
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 2600; i++) {
      const a = rnd() * Math.PI * 2
      const d = Math.sqrt(rnd()) * 1.9
      const h = Math.max(0, 1.0 * Math.exp(-(d * d) / 1.0)) + rnd() * 0.03
      pts.push([Math.cos(a) * d, h - 1.55, Math.sin(a) * d * 0.8, 0.018 + rnd() * 0.022])
    }
    return pts
  }, [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colors = useMemo(() => {
    const c = new Float32Array(grains.length * 3)
    const palette = ['#e8dcc0', '#d9c9a3', '#f2ead6', '#cbb88f', '#efe3c8']
    grains.forEach((_, i) => {
      const col = new THREE.Color(palette[i % palette.length])
      c.set([col.r, col.g, col.b], i * 3)
    })
    return c
  }, [grains])
  const mound = useMemo(() => {
    const pts: THREE.Vector2[] = []
    for (let k = 0; k <= 40; k++) {
      const d = (k / 40) * 1.95
      pts.push(new THREE.Vector2(d, 1.0 * Math.exp(-(d * d) / 1.0)))
    }
    return new THREE.LatheGeometry(pts.reverse(), 96)
  }, [])
  const crystals: Array<{ p: [number, number, number]; h: number; r: number; rot: [number, number, number] }> = [
    { p: [0.05, -0.75, 0], h: 2.0, r: 0.3, rot: [0.05, 0, -0.08] },
    { p: [-0.45, -0.8, 0.1], h: 1.2, r: 0.2, rot: [0.2, 0.4, 0.4] },
    { p: [0.5, -0.85, 0.15], h: 1.0, r: 0.18, rot: [-0.1, 0.2, -0.5] },
    { p: [-0.05, -0.85, 0.45], h: 0.65, r: 0.12, rot: [0.55, 0, 0.1] },
  ]
  return (
    <group position={[0, 0.1, 0]} rotation={[0.12, 0.3, 0]}>
      <mesh geometry={mound} position={[0, -1.56, 0]} scale={[1, 1, 0.8]}>
        <meshStandardMaterial color="#d8c8a2" roughness={0.95} />
      </mesh>
      <instancedMesh
        args={[undefined, undefined, grains.length]}
        ref={(m) => {
          if (!m) return
          grains.forEach(([x, y, z, s], i) => {
            dummy.position.set(x, y, z)
            dummy.scale.setScalar(s)
            dummy.updateMatrix()
            m.setMatrixAt(i, dummy.matrix)
          })
          m.instanceMatrix.needsUpdate = true
          m.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3))
        }}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial vertexColors roughness={0.85} />
      </instancedMesh>
      {crystals.map((c, i) => (
        <group key={i} position={c.p} rotation={c.rot}>
          <mesh position={[0, c.h / 2, 0]}>
            <cylinderGeometry args={[c.r, c.r * 1.05, c.h, 6]} />
            <meshPhysicalMaterial color="#e8eaed" roughness={0.08} metalness={0.1} clearcoat={1} transparent opacity={0.78} emissive="#d5d8dc" emissiveIntensity={0.08} />
          </mesh>
          <mesh position={[0, c.h + c.r * 0.9, 0]}>
            <coneGeometry args={[c.r, c.r * 1.8, 6]} />
            <meshPhysicalMaterial color="#e8eaed" roughness={0.08} metalness={0.1} clearcoat={1} transparent opacity={0.78} emissive="#d5d8dc" emissiveIntensity={0.08} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const swatchColors = ['#149f94', '#0e514e', '#e9eef2', '#1b2430', '#e07a3f', '#34bdb0', '#c98a55', '#e46d75', '#6dd5c9', '#f2c14e']

/** A fanned deck of colour-matched silicone swatches. */
export function SwatchFanModel() {
  return (
    <group position={[-0.85, -1.5, 0]} rotation={[0.2, 0.3, 0]}>
      {swatchColors.map((c, i) => {
        const a = 0.12 - (i / (swatchColors.length - 1)) * 1.4
        return (
          <group key={c} rotation={[0, 0, a]} position={[0, 0, i * 0.035]}>
            <RoundedBox args={[0.62, 2.9, 0.05]} radius={0.024} smoothness={4} position={[0, 1.45, 0]}>
              <SiliconeSkin color={c} roughness={0.36} />
            </RoundedBox>
            <mesh position={[0, 0.1, 0.03]}>
              <circleGeometry args={[0.07, 24]} />
              <meshStandardMaterial color="#121416" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, 0.1, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.05, 32]} />
        <meshStandardMaterial color="#c3ccd6" metalness={0.95} roughness={0.2} />
      </mesh>
    </group>
  )
}

/** Clear medical silicone tubing with luer connectors and a silicone valve. */
export function MedicalTubingModel() {
  const tube = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let k = 0; k <= 360; k++) {
      const t = k / 360
      const turns = 3.2
      const r = 1.05
      pts.push(new THREE.Vector3(Math.cos(t * Math.PI * 2 * turns) * r, -1.25 + t * 1.2, Math.sin(t * Math.PI * 2 * turns) * r))
    }
    pts.push(new THREE.Vector3(1.0, 0.25, 0.4), new THREE.Vector3(0.7, 1.05, 0.5), new THREE.Vector3(0.2, 1.5, 0.45))
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 800, 0.13, 24, false)
  }, [])
  const inner = useMemo(() => new THREE.TubeGeometry((tube.parameters as { path: THREE.Curve<THREE.Vector3> }).path, 800, 0.07, 16, false), [tube])
  return (
    <group rotation={[0.2, -0.3, 0]} position={[0, 0, 0]}>
      <mesh geometry={tube}>
        <meshPhysicalMaterial color="#e8eaed" roughness={0.2} clearcoat={0.9} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh geometry={inner}>
        <meshStandardMaterial color="#c5c8cc" roughness={0.35} transparent opacity={0.55} />
      </mesh>
      {/* Luer connector at the free end */}
      <group position={[0.2, 1.5, 0.45]} rotation={[0, 0, 1.1]}>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.17, 0.14, 0.36, 32]} />
          <meshPhysicalMaterial color="#f5f7f8" roughness={0.25} clearcoat={0.8} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 6]} />
          <meshPhysicalMaterial color={SILICONE} roughness={0.35} clearcoat={0.5} />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <coneGeometry args={[0.08, 0.22, 24]} />
          <meshPhysicalMaterial color="#f5f7f8" roughness={0.25} clearcoat={0.8} />
        </mesh>
      </group>
      {/* Silicone duckbill valve */}
      <group position={[1.6, -1.1, 0.9]} rotation={[0.3, 0.4, -0.2]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.12, 40]} />
          <SiliconeSkin color={SILICONE} />
        </mesh>
        <mesh position={[0, 0.22, 0]} scale={[1, 1.1, 0.55]}>
          <sphereGeometry args={[0.22, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <SiliconeSkin color={HIGHLIGHT} />
        </mesh>
      </group>
    </group>
  )
}

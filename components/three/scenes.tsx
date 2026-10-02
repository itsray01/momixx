'use client'

// Real-time 3D scenes (Three.js via React Three Fiber). Loaded lazily by
// <Scene3D>, only on screens that support WebGL, and only once scrolled near.
// Lighting is generated locally with <Lightformer>s, so no HDR files are
// downloaded from third-party CDNs.

import { Environment, Float, Lightformer, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export type SceneVariant = 'cable' | 'ev-cable' | 'extrusion' | 'samples' | 'loop' | 'molecule'

const TEAL = '#149f94'
const COPPER = '#c98a55'

function Silicone({ color = TEAL, opacity = 1 }: { color?: string; opacity?: number }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.38}
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

/** Gently follows the pointer and drifts on its own. */
function Rig({ children, strength = 1 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime
    const targetY = state.pointer.x * 0.35 * strength + Math.sin(t * 0.25) * 0.12
    const targetX = -state.pointer.y * 0.2 * strength + Math.cos(t * 0.2) * 0.05
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 2.5, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 2.5, delta)
  })
  return <group ref={ref}>{children}</group>
}

// ───────────────────────── Cable with a stripped, cut end ─────────────────────────

function Cable({ color }: { color: string }) {
  const R = 0.62
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-7, -4.2, -5),
        new THREE.Vector3(-3.6, -2.4, -1.5),
        new THREE.Vector3(-1.6, -2.1, 0.6),
        new THREE.Vector3(0.2, -0.9, 1.1),
        new THREE.Vector3(1.1, 0.25, 0.9),
      ]),
    [],
  )
  const end = useMemo(() => curve.getPoint(1), [curve])
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), curve.getTangent(1).normalize()), [curve])
  const conductors = useMemo(
    () => [[0, 0], ...Array.from({ length: 6 }, (_, i) => [Math.cos((i * Math.PI) / 3) * R * 0.38, Math.sin((i * Math.PI) / 3) * R * 0.38])] as Array<[number, number]>,
    [],
  )
  return (
    <group position={[-0.4, 0.2, 0]}>
      <mesh>
        <tubeGeometry args={[curve, 220, R, 64, false]} />
        <Silicone color={color} />
      </mesh>
      <group position={end} quaternion={quat}>
        {/* cut face of the silicone jacket */}
        <mesh>
          <ringGeometry args={[R * 0.74, R, 64]} />
          <Silicone color={color} />
        </mesh>
        {/* insulation, stepping out of the jacket */}
        <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[R * 0.74, R * 0.74, 0.32, 64]} />
          <meshPhysicalMaterial color="#eef2f6" roughness={0.45} clearcoat={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.221]}>
          <circleGeometry args={[R * 0.6, 48]} />
          <meshStandardMaterial color="#0b121c" roughness={0.8} />
        </mesh>
        {/* copper conductors, stripped and sticking out */}
        {conductors.map(([x, y], i) => (
          <group key={i} position={[x, y, 0]}>
            <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[R * 0.15, R * 0.15, 0.36, 24]} />
              <meshStandardMaterial color="#26364b" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[R * 0.09, R * 0.09, 0.42, 20]} />
              <meshStandardMaterial color={COPPER} metalness={1} roughness={0.28} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

// ───────────────────────── Vertical extrusion line ─────────────────────────

function Extrusion() {
  const marks = useRef<THREE.InstancedMesh>(null)
  const count = 14
  const span = 12
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useFrame((state) => {
    const m = marks.current
    if (!m) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const y = span / 2 - (((i / count) * span + t * 1.4) % span)
      dummy.position.set(0, y, 0)
      dummy.rotation.set(Math.PI / 2, 0, 0)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })
  return (
    <group rotation={[0.12, 0, 0.18]}>
      <mesh>
        <cylinderGeometry args={[0.34, 0.34, span, 48]} />
        <Silicone />
      </mesh>
      <instancedMesh ref={marks} args={[undefined, undefined, count]}>
        <torusGeometry args={[0.345, 0.012, 8, 48]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.55} />
      </instancedMesh>
      {[2.3, 0, -2.3].map((y, i) => (
        <group key={y} position={[0, y, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05 - i * 0.08, 0.16, 32, 96]} />
            <meshStandardMaterial color="#c3ccd6" metalness={0.9} roughness={0.32} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.62 - i * 0.04, 0.025, 16, 96]} />
            <meshStandardMaterial color="#34bdb0" emissive="#34bdb0" emissiveIntensity={1.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ───────────────────────── Colour-matched silicone samples ─────────────────────────

const swatches = ['#149f94', '#0e514e', '#e8eef3', '#0b121c', '#f97316', '#34bdb0', '#6dd5c9', '#c98a55', '#f87171']

function Samples() {
  return (
    <group rotation={[0.35, -0.5, 0.1]}>
      {swatches.map((c, i) => {
        const x = (i % 3) - 1
        const y = 1 - Math.floor(i / 3)
        return (
          <Float key={c} speed={1.4} rotationIntensity={0.35} floatIntensity={0.5} floatingRange={[-0.08, 0.08]}>
            <RoundedBox args={[1.25, 1.25, 0.32]} radius={0.14} smoothness={5} position={[x * 1.55, y * 1.55, ((i * 7) % 3) * 0.25 - 0.25]}>
              <Silicone color={c} opacity={i === 6 ? 0.75 : 1} />
            </RoundedBox>
          </Float>
        )
      })}
    </group>
  )
}

// ───────────────────────── Recycling ring with flowing material ─────────────────────────

function Loop() {
  const particles = useRef<THREE.InstancedMesh>(null)
  const count = 90
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const gray = useMemo(() => new THREE.Color('#8b97a6'), [])
  const teal = useMemo(() => new THREE.Color('#34bdb0'), [])
  const tmp = useMemo(() => new THREE.Color(), [])

  useLayoutEffect(() => {
    const m = particles.current
    if (!m) return
    for (let i = 0; i < count; i++) {
      const f = i / count
      tmp.copy(gray).lerp(teal, Math.min(1, Math.max(0, (f - 0.15) / 0.6)))
      m.setColorAt(i, tmp)
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [gray, teal, tmp])

  useFrame((state) => {
    const m = particles.current
    if (!m) return
    const t = state.clock.elapsedTime * 0.18
    for (let i = 0; i < count; i++) {
      const u = (i / count) * Math.PI * 2 + t
      const v = u * 6 + i
      const r = 2.1 + Math.cos(v) * 0.62
      dummy.position.set(Math.cos(u) * r, Math.sin(u) * r, Math.sin(v) * 0.62)
      dummy.scale.setScalar(0.09 + (i % 3) * 0.025)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <group rotation={[0.9, 0, 0.2]}>
      <mesh>
        <torusGeometry args={[2.1, 0.42, 64, 160]} />
        <Silicone />
      </mesh>
      <instancedMesh ref={particles} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial roughness={0.3} clearcoat={0.6} />
      </instancedMesh>
    </group>
  )
}

// ───────────────────────── Siloxane molecule ─────────────────────────

function Bond({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from)
    return {
      position: new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
      length: dir.length(),
    }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.07, 0.07, length, 12]} />
      <meshStandardMaterial color="#64748b" roughness={0.5} />
    </mesh>
  )
}

function Molecule() {
  const atoms = useMemo(() => {
    const list: Array<{ p: THREE.Vector3; kind: 'Si' | 'O' | 'C' }> = []
    const bonds: Array<[THREE.Vector3, THREE.Vector3]> = []
    let prevSi: THREE.Vector3 | null = null
    for (let i = 0; i < 5; i++) {
      const si = new THREE.Vector3(-4 + i * 2, i % 2 ? 0.35 : -0.35, 0)
      list.push({ p: si, kind: 'Si' })
      const a = i % 2 ? 0 : Math.PI / 2
      const c1 = si.clone().add(new THREE.Vector3(0, 1.15 * Math.cos(a), 1.15 * Math.sin(a)))
      const c2 = si.clone().add(new THREE.Vector3(0, -1.15 * Math.cos(a), -1.15 * Math.sin(a)))
      list.push({ p: c1, kind: 'C' }, { p: c2, kind: 'C' })
      bonds.push([si, c1], [si, c2])
      if (prevSi) {
        const o = prevSi.clone().add(si).multiplyScalar(0.5).add(new THREE.Vector3(0, 0, 0.5))
        list.push({ p: o, kind: 'O' })
        bonds.push([prevSi, o], [o, si])
      }
      prevSi = si
    }
    return { list, bonds }
  }, [])
  const style = { Si: { r: 0.48, c: '#34bdb0' }, O: { r: 0.34, c: '#f87171' }, C: { r: 0.3, c: '#e8eef3' } }
  return (
    <group scale={0.85}>
      {atoms.bonds.map(([a, b], i) => (
        <Bond key={i} from={a} to={b} />
      ))}
      {atoms.list.map((a, i) => (
        <mesh key={i} position={a.p}>
          <sphereGeometry args={[style[a.kind].r, 32, 32]} />
          <meshPhysicalMaterial color={style[a.kind].c} roughness={0.3} clearcoat={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// ───────────────────────── Canvas ─────────────────────────

function Ready({ onReady }: { onReady?: () => void }) {
  const { invalidate } = useThree()
  const fired = useRef(false)
  useFrame(() => {
    if (fired.current) return
    fired.current = true
    requestAnimationFrame(() => onReady?.())
  })
  useLayoutEffect(() => invalidate(), [invalidate])
  return null
}

const cameraFor: Record<SceneVariant, { position: [number, number, number]; fov: number }> = {
  cable: { position: [0, 0, 8.5], fov: 35 },
  'ev-cable': { position: [0, 0, 8.5], fov: 35 },
  extrusion: { position: [0, 0, 9], fov: 38 },
  samples: { position: [0, 0, 9], fov: 38 },
  loop: { position: [0, 0, 9], fov: 38 },
  molecule: { position: [0, 0, 10], fov: 38 },
}

export default function Scene({ variant, animate, onReady }: { variant: SceneVariant; animate: boolean; onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={animate ? 'always' : 'demand'}
      camera={cameraFor[variant]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={1.8} />
      <directionalLight position={[-6, -3, -4]} intensity={1.1} color="#6dd5c9" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 4]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[6, -1, 3]} scale={[3, 6, 1]} />
        <Lightformer form="ring" intensity={2.2} color="#6dd5c9" position={[-6, 1, 2]} scale={3} />
      </Environment>
      {(variant === 'cable' || variant === 'ev-cable') && <fog attach="fog" args={['#060a10', 9, 17]} />}
      {variant === 'cable' && (
        <Rig>
          <Cable color={TEAL} />
        </Rig>
      )}
      {variant === 'ev-cable' && (
        <Rig>
          <Cable color="#f97316" />
        </Rig>
      )}
      {variant === 'extrusion' && (
        <Rig strength={0.6}>
          <Extrusion />
        </Rig>
      )}
      {variant === 'samples' && (
        <Rig>
          <Samples />
        </Rig>
      )}
      {variant === 'loop' && (
        <Rig strength={0.6}>
          <Loop />
        </Rig>
      )}
      {variant === 'molecule' && (
        <Rig strength={0.6}>
          <Float speed={1} rotationIntensity={0.6} floatIntensity={0.4}>
            <Molecule />
          </Float>
        </Rig>
      )}
      <Ready onReady={onReady} />
    </Canvas>
  )
}

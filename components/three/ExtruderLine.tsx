'use client'

// The MoMixx vertical extrusion line as an interactive 3D model. Each station
// is its own clickable part (see extruderParts.ts for names and copy), and the
// cable runs through all of them, from the pay-off reel to the autowinder.

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Box, Glass, Heat, Mat, Part, Screen, Wheel, type Finish, type PartState } from './machineParts'
import { HIGHLIGHT, SILICONE } from './Studio'

const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z)

const curve = (pts: THREE.Vector3[]) => new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.08)

/** Bare copper wire, from the pay-off reel round the guide pulley into the crosshead. */
export const wirePath = curve([v(-4.3, 1.0), v(-3.3, 1.0), v(-2.1, 1.0), v(-1.72, 1.0), v(-1.635, 1.035), v(-1.6, 1.12), v(-1.6, 1.6)])

/** Shorter routes for the tower-only close-up. */
const towerWirePath = curve([v(-2.9, 1.0), v(-2.1, 1.0), v(-1.72, 1.0), v(-1.635, 1.035), v(-1.6, 1.12), v(-1.6, 1.6)])
const towerCablePath = curve([v(-1.6, 1.6), v(-1.6, 4.9), v(-1.55, 5.3), v(-1.25, 5.56), v(-0.95, 5.3), v(-0.95, 4.9), v(-0.95, 2.4)])

/** The silicone-jacketed cable, from the crosshead to the take-up spool. */
export const cablePath = curve([
  v(-1.6, 1.6),
  v(-1.6, 4.9),
  v(-1.55, 5.3),
  v(-1.25, 5.56),
  v(-0.95, 5.3),
  v(-0.95, 4.9),
  v(-0.95, 3.12),
  v(-0.8, 2.86),
  v(-0.5, 2.8),
  v(1.6, 2.8),
  v(2.1, 2.8),
  v(3.1, 2.8),
  v(3.5, 2.76),
  v(3.6, 2.5),
  v(3.6, 1.4),
  v(3.72, 1.17),
  v(4.0, 1.15),
  v(4.9, 1.15),
  v(5.1, 1.12),
])

function Spool({ p, flange, core, wound, windFinish, s, spin }: { p: [number, number, number]; flange: number; core: number; wound: number; windFinish: Finish; s: PartState; spin: React.RefObject<THREE.Group | null> }) {
  const len = 0.62
  return (
    <group position={p} ref={spin}>
      {/* Open, spoked flanges so the winding shows */}
      {[-1, 1].map((side) => (
        <group key={side} position={[0, 0, (side * len) / 2]}>
          <mesh>
            <torusGeometry args={[flange, 0.028, 10, 56]} />
            <Mat f="steel" s={s} />
          </mesh>
          {[0, 1, 2, 3].map((k) => (
            <mesh key={k} rotation={[0, 0, (k * Math.PI) / 4]}>
              <boxGeometry args={[flange * 2, 0.035, 0.02]} />
              <Mat f="brushed" s={s} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[core, core, len, 32]} />
        <Mat f="dark" s={s} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[wound, wound, len * 0.92, 48]} />
        <Mat f={windFinish} s={s} />
      </mesh>
      {/* Winding grooves */}
      {Array.from({ length: 7 }, (_, k) => (
        <mesh key={k} position={[0, 0, -len * 0.4 + (k * len * 0.8) / 6]}>
          <torusGeometry args={[wound, 0.012, 6, 48]} />
          <Mat f="dark" s={s} />
        </mesh>
      ))}
    </group>
  )
}

export function ExtruderLineModel({
  selected = null,
  hovered = null,
  onSelect,
  onHover,
  animate = false,
  tower = false,
}: {
  selected?: number | null
  hovered?: number | null
  onSelect?: (i: number) => void
  onHover?: (i: number | null) => void
  animate?: boolean
  /** Only the mixer, extruder and vertical oven: a close-up of what makes the line vertical. */
  tower?: boolean
}) {
  const show = (i: number) => !tower || (i >= 1 && i <= 3)
  const path = tower ? towerCablePath : cablePath
  const st = (i: number): PartState => (selected === null ? (hovered === i ? 'hover' : 'idle') : selected === i ? 'selected' : hovered === i ? 'hover' : 'dim')
  const lineState: PartState = selected === null ? 'idle' : 'dim'

  const payoff = useRef<THREE.Group>(null)
  const winder = useRef<THREE.Group>(null)
  const counter = useRef<THREE.Group>(null)
  const pulleys = useRef<Array<THREE.Group | null>>([])
  const topPulley = useRef<THREE.Group>(null)
  const stir = useRef<Array<THREE.Mesh | null>>([])
  const marks = useRef<THREE.InstancedMesh>(null)
  const markCount = 42
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const cableGeo = useMemo(() => new THREE.TubeGeometry(tower ? towerCablePath : cablePath, 500, 0.034, 12, false), [tower])
  const wireGeo = useMemo(() => new THREE.TubeGeometry(tower ? towerWirePath : wirePath, 160, 0.014, 8, false), [tower])
  const coil = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let k = 0; k <= 220; k++) {
      const t = k / 220
      pts.push(v(Math.cos(t * Math.PI * 26) * 0.15, 2.05 + t * 2.7, Math.sin(t * Math.PI * 26) * 0.15))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 600, 0.012, 6, false)
  }, [])
  const hoseGeo = useMemo(
    () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([v(-2.7, 0.62, -0.62), v(-2.7, 1.1, -0.5), v(-2.65, 1.95, -0.3), v(-2.5, 1.95, -0.05), v(-2.35, 1.78, 0)]), 60, 0.035, 10, false),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (animate) {
      const speed = delta * 1.6
      if (payoff.current) payoff.current.rotation.z -= speed / 0.42
      if (winder.current) winder.current.rotation.z -= speed / 0.4
      if (counter.current) counter.current.rotation.z -= speed / 0.14
      if (topPulley.current) topPulley.current.rotation.z -= speed / 0.3
      pulleys.current.forEach((p) => p && (p.rotation.z -= speed / 0.42))
      stir.current.forEach((m, k) => m && (m.rotation.y += delta * (k ? -2 : 2)))
    }
    const m = marks.current
    if (!m) return
    for (let k = 0; k < markCount; k++) {
      const u = (k / markCount + (animate ? t * 0.035 : 0)) % 1
      const p = path.getPointAt(u)
      const tan = path.getTangentAt(u)
      dummy.position.copy(p)
      dummy.lookAt(p.clone().add(tan))
      dummy.updateMatrix()
      m.setMatrixAt(k, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {/* Floor plinth */}
      <mesh position={tower ? [-1.75, -0.08, -0.4] : [0.35, -0.08, -0.35]} receiveShadow>
        <boxGeometry args={tower ? [3.4, 0.16, 2.2] : [11.2, 0.16, 2.6]} />
        <meshStandardMaterial color="#101214" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={tower ? [-1.75, 0.002, 0.7] : [0.35, 0.002, 0.95]}>
        <boxGeometry args={[tower ? 3.4 : 11.2, 0.004, 0.02]} />
        <meshStandardMaterial color={HIGHLIGHT} emissive={HIGHLIGHT} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>

      {/* Bare wire in, silicone cable out, with markings that travel along it */}
      <mesh geometry={wireGeo}>
        <meshStandardMaterial key={lineState} color="#d08a52" metalness={0.6} roughness={0.3} transparent={lineState === 'dim'} opacity={lineState === 'dim' ? 0.55 : 1} />
      </mesh>
      <mesh geometry={cableGeo}>
        <meshStandardMaterial key={lineState} color={SILICONE} roughness={0.35} metalness={0.05} transparent={lineState === 'dim'} opacity={lineState === 'dim' ? 0.55 : 1} />
      </mesh>
      <instancedMesh ref={marks} args={[undefined, undefined, markCount]}>
        <torusGeometry args={[0.036, 0.008, 6, 20]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} transparent opacity={0.6} />
      </instancedMesh>

      {/* 1 · Pay-off and preheat */}
      {show(0) && (
        <Part i={0} s={st(0)} onSelect={onSelect} onHover={onHover}>
        <Box p={[-4.3, 0.06, -0.05]} size={[1.05, 0.12, 1.0]} f="cabinet" s={st(0)} />
        <Spool p={[-4.3, 0.55, 0]} flange={0.48} core={0.12} wound={0.4} windFinish="copper" s={st(0)} spin={payoff} />
        <Box p={[-3.3, 1.0, 0]} size={[0.85, 0.42, 0.5]} f="panel" s={st(0)} />
        <mesh position={[-3.3, 1.0, 0.252]}>
          <boxGeometry args={[0.7, 0.07, 0.01]} />
          <Heat s={st(0)} intensity={1.2} />
        </mesh>
        <Box p={[-3.3, 0.4, 0]} size={[0.12, 0.8, 0.12]} f="steel" s={st(0)} />
      </Part>
      )}

      {/* 2 · LSR mixer: drums A and B, pump and feed hose */}
      <Part i={1} s={st(1)} onSelect={onSelect} onHover={onHover}>
        <Box p={[-2.75, 0.12, -0.95]} size={[1.0, 0.24, 0.62]} f="graphite" s={st(1)} />
        {[
          { x: -3.0, f: 'white' as Finish },
          { x: -2.5, f: 'silicone' as Finish },
        ].map((d, k) => (
          <group key={d.x} position={[d.x, 0.62, -0.95]}>
            <mesh>
              <cylinderGeometry args={[0.2, 0.2, 0.76, 40]} />
              <Mat f={d.f} s={st(1)} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.215, 0.215, 0.05, 40]} />
              <Mat f="steel" s={st(1)} />
            </mesh>
            <mesh position={[0, 0.62, 0]} ref={(el) => void (stir.current[k] = el)}>
              <boxGeometry args={[0.24, 0.04, 0.04]} />
              <Mat f="steel" s={st(1)} />
            </mesh>
            <mesh position={[0, 0.52, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
              <Mat f="steel" s={st(1)} />
            </mesh>
          </group>
        ))}
        <Box p={[-2.75, 0.5, -0.55]} size={[0.32, 0.3, 0.24]} f="panel" s={st(1)} />
        <mesh geometry={hoseGeo}>
          <Mat f="silicone" s={st(1)} />
        </mesh>
      </Part>

      {/* 3 · Extruder: cabinet, motor, barrel and crosshead */}
      <Part i={2} s={st(2)} onSelect={onSelect} onHover={onHover}>
        <Box p={[-1.75, 0.68, -0.62]} size={[1.0, 1.36, 0.72]} f="panel" s={st(2)} />
        {[0, 1, 2, 3, 4].map((k) => (
          <Box key={k} p={[-2.0, 0.42 + k * 0.1, -0.255]} size={[0.32, 0.03, 0.01]} f="dark" s={st(2)} />
        ))}
        <Box p={[-1.5, 0.95, -0.25]} size={[0.3, 0.22, 0.02]} f="dark" s={st(2)} />
        <mesh position={[-1.5, 0.95, -0.235]}>
          <boxGeometry args={[0.24, 0.15, 0.01]} />
          <Screen s={st(2)} />
        </mesh>
        <Box p={[-2.62, 1.6, 0]} size={[0.36, 0.36, 0.36]} f="graphite" s={st(2)} />
        <mesh position={[-2.12, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.66, 32]} />
          <Mat f="brushed" s={st(2)} />
        </mesh>
        {[-2.3, -2.1, -1.92].map((x) => (
          <mesh key={x} position={[x, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
            <Mat f="copper" s={st(2)} />
          </mesh>
        ))}
        <Box p={[-1.6, 1.6, 0]} size={[0.34, 0.36, 0.34]} f="steel" s={st(2)} />
        <mesh position={[-1.6, 1.84, 0.1]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 20]} />
          <Mat f="graphite" s={st(2)} />
        </mesh>
        <mesh position={[-1.6, 1.84, 0.165]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 20]} />
          <Screen s={st(2)} />
        </mesh>
        <mesh position={[-1.6, 1.33, 0]}>
          <coneGeometry args={[0.12, 0.2, 24]} />
          <Mat f="steel" s={st(2)} />
        </mesh>
        <Wheel p={[-1.72, 1.12, 0]} radius={0.12} width={0.06} f="steel" s={st(2)} />
      </Part>

      {/* 4 · Vertical curing oven */}
      <Part i={3} s={st(3)} onSelect={onSelect} onHover={onHover}>
        {[-1.95, -1.25].map((x) => (
          <Box key={x} p={[x, 3.1, -0.3]} size={[0.07, 4.4, 0.07]} f="brushed" s={st(3)} />
        ))}
        <Box p={[-1.45, 5.32, -0.3]} size={[1.0, 0.12, 0.12]} f="brushed" s={st(3)} />
        <mesh position={[-1.6, 3.4, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 2.9, 40, 1, true]} />
          <Glass s={st(3)} />
        </mesh>
        {[1.95, 4.85].map((y) => (
          <mesh key={y} position={[-1.6, y, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.1, 40]} />
            <Mat f="steel" s={st(3)} />
          </mesh>
        ))}
        <mesh geometry={coil} position={[-1.6, 0, 0]}>
          <Heat s={st(3)} />
        </mesh>
        <Wheel p={[-1.25, 5.26, 0]} radius={0.3} width={0.08} f="steel" s={st(3)} spin={topPulley} />
      </Part>

      {/* 5 · Horizontal oven, capstan and accumulator pulleys */}
      {show(4) && (
        <Part i={4} s={st(4)} onSelect={onSelect} onHover={onHover}>
        <mesh position={[0.55, 2.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 2.1, 40, 1, true]} />
          <Glass s={st(4)} />
        </mesh>
        {[-0.5, 1.6].map((x) => (
          <mesh key={x} position={[x, 2.8, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.1, 40]} />
            <Mat f="steel" s={st(4)} />
          </mesh>
        ))}
        {[-0.2, 0.55, 1.3].map((x) => (
          <mesh key={x} position={[x, 2.8, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.17, 0.014, 8, 40]} />
            <Heat s={st(4)} />
          </mesh>
        ))}
        {[-0.3, 1.4].map((x) => (
          <Box key={x} p={[x, 1.29, -0.1]} size={[0.07, 2.6, 0.07]} f="brushed" s={st(4)} />
        ))}
        <Box p={[2.6, 1.17, -0.32]} size={[1.3, 2.34, 0.7]} f="cabinet" s={st(4)} />
        <Box p={[2.6, 1.6, 0.04]} size={[0.5, 0.3, 0.02]} f="dark" s={st(4)} />
        <mesh position={[2.6, 1.6, 0.055]}>
          <boxGeometry args={[0.4, 0.2, 0.01]} />
          <Screen s={st(4)} />
        </mesh>
        <Box p={[2.6, 3.5, -0.2]} size={[1.5, 1.6, 0.08]} f="brushed" s={st(4)} />
        {[
          [2.1, 3.25],
          [2.6, 3.95],
          [3.1, 3.25],
        ].map(([x, y], k) => (
          <group key={k} ref={(el) => void (pulleys.current[k] = el)} position={[x, y, 0.02]}>
            <Wheel p={[0, 0, 0]} radius={0.42} width={0.1} f="steel" s={st(4)} />
          </group>
        ))}
      </Part>
      )}

      {/* 6 · Inspection: diameter gauge, high-voltage tester, length counter */}
      {show(5) && (
        <Part i={5} s={st(5)} onSelect={onSelect} onHover={onHover}>
        <Box p={[4.3, 0.47, -0.1]} size={[1.05, 0.94, 0.7]} f="cabinet" s={st(5)} />
        <Box p={[4.1, 1.15, 0]} size={[0.5, 0.42, 0.5]} f="silicone" s={st(5)} />
        <mesh position={[4.1, 1.27, 0.252]}>
          <boxGeometry args={[0.32, 0.1, 0.01]} />
          <Screen s={st(5)} />
        </mesh>
        <mesh position={[3.6, 2.05, 0]}>
          <torusGeometry args={[0.09, 0.03, 10, 30]} />
          <Mat f="steel" s={st(5)} />
        </mesh>
        <Box p={[3.6, 2.05, -0.15]} size={[0.06, 0.06, 0.3]} f="steel" s={st(5)} />
        <group position={[4.62, 1.3, 0]} ref={counter}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.06, 30]} />
            <Mat f="steel" s={st(5)} />
          </mesh>
          <Box p={[0, 0, 0.035]} size={[0.2, 0.02, 0.01]} f="dark" s={st(5)} />
        </group>
      </Part>
      )}

      {/* 7 · Autowinder with vision camera */}
      {show(6) && (
        <Part i={6} s={st(6)} onSelect={onSelect} onHover={onHover}>
        <Box p={[5.15, 0.06, -0.05]} size={[1.1, 0.12, 1.05]} f="cabinet" s={st(6)} />
        <Spool p={[5.15, 0.72, 0]} flange={0.48} core={0.14} wound={0.38} windFinish="silicone" s={st(6)} spin={winder} />
        <Box p={[5.62, 1.15, -0.4]} size={[0.06, 1.6, 0.06]} f="brushed" s={st(6)} />
        <Box p={[5.35, 1.9, -0.4]} size={[0.6, 0.06, 0.06]} f="brushed" s={st(6)} />
        <Box p={[5.12, 1.82, -0.2]} size={[0.16, 0.14, 0.34]} f="dark" s={st(6)} />
        <mesh position={[5.12, 1.74, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.06, 20]} />
          <Screen s={st(6)} />
        </mesh>
      </Part>
      )}
    </group>
  )
}

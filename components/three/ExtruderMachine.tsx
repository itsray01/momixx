'use client'

// The Momixx vertical extruder (the machine in the product photo) as an
// interactive 3D model, built to match the photo. The extruder, the capstan
// pulleys and the inspection unit are clickable parts; their indices, copy and
// marker positions come from extruderParts.ts.

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Box, Mat, Part, Wheel, type PartState } from './machineParts'
import { extruderParts } from './extruderParts'

const TEAL = '#149f94'
const index = (id: string) => extruderParts.findIndex((p) => p.id === id)
const EXTRUDER = index('extruder')
const CAPSTAN = index('capstan')
const INSPECTION = index('inspection')

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const tube = (pts: THREE.Vector3[], radius: number, segments = 120) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), segments, radius, 10, false)

/** A dark vent panel with louvres. */
function Vent({ p, w, h, face = 'front', s }: { p: [number, number, number]; w: number; h: number; face?: 'front' | 'left'; s: PartState }) {
  const rows = Math.max(3, Math.round(h / 0.045))
  return (
    <group position={p} rotation={[0, face === 'left' ? -Math.PI / 2 : 0, 0]}>
      <mesh>
        <boxGeometry args={[w, h, 0.01]} />
        <Mat f="graphite" s={s} />
      </mesh>
      {Array.from({ length: rows }, (_, k) => (
        <mesh key={k} position={[0, -h / 2 + ((k + 0.5) * h) / rows, 0.007]}>
          <boxGeometry args={[w * 0.86, 0.01, 0.006]} />
          <Mat f="brushed" s={s} />
        </mesh>
      ))}
    </group>
  )
}

/** A cooling fan, facing out of the left side. */
function Fan({ p, s }: { p: [number, number, number]; s: PartState }) {
  return (
    <group position={p} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.085, 0.085, 0.012, 32]} />
        <Mat f="dark" s={s} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.085, 0.008, 8, 32]} />
        <Mat f="steel" s={s} />
      </mesh>
      {[0, 1, 2, 3].map((k) => (
        <mesh key={k} rotation={[0, (k * Math.PI) / 4, 0]} position={[0, -0.008, 0]}>
          <boxGeometry args={[0.16, 0.004, 0.008]} />
          <Mat f="steel" s={s} />
        </mesh>
      ))}
    </group>
  )
}

export function ExtruderMachineModel({
  selected = null,
  hovered = null,
  onSelect,
  onHover,
  animate = false,
}: {
  selected?: number | null
  hovered?: number | null
  onSelect?: (i: number) => void
  onHover?: (i: number | null) => void
  animate?: boolean
}) {
  const st = (i: number): PartState => (selected === i ? 'selected' : hovered === i ? 'hover' : 'idle')
  const frame: PartState = 'idle'

  const pulleys = useRef<Array<THREE.Group | null>>([])
  const wireGeo = useMemo(() => tube([v(0.235, 0.6, 0.15), v(0.235, 0.9, 0.15), v(0.235, 1.2, 0.15)], 0.006, 20), [])
  const cableGeo = useMemo(
    () =>
      tube(
        [
          v(0.235, 1.58, 0.15),
          v(0.29, 1.8, 0.07),
          v(0.312, 2.02, -0.03),
          v(0.27, 2.13, -0.03),
          v(0.16, 2.172, -0.03),
          v(0.12, 2.3, -0.03),
          v(0.09, 2.47, -0.03),
          v(-0.02, 2.512, -0.03),
          v(-0.13, 2.47, -0.03),
          v(-0.2, 2.25, -0.03),
          v(-0.27, 2.202, -0.03),
          v(-0.38, 2.15, -0.03),
          v(-0.422, 2.0, -0.03),
          v(-0.43, 1.8, -0.03),
        ],
        0.014,
        240,
      ),
    [],
  )
  const hoses = useMemo(
    () => [
      tube([v(0.13, 1.44, 0.24), v(-0.04, 1.58, 0.31), v(-0.21, 1.46, 0.35), v(-0.25, 1.2, 0.36), v(-0.15, 1.04, 0.36), v(-0.03, 0.88, 0.32)], 0.011),
      tube([v(0.33, 1.3, 0.2), v(0.36, 1.1, 0.33), v(0.2, 0.93, 0.4), v(-0.03, 0.96, 0.39), v(-0.1, 0.78, 0.3)], 0.011),
    ],
    [],
  )

  useFrame((_, delta) => {
    if (!animate) return
    pulleys.current.forEach((p, k) => p && (p.rotation.z -= delta * (k === 1 ? 1.4 : -1.4)))
  })

  return (
    <group>
      {/* Levelling feet */}
      {[-0.72, 0.12].flatMap((x) =>
        [-0.48, 0.18].map((z) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.07, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.14, 12]} />
              <Mat f="graphite" s={frame} />
            </mesh>
            <mesh position={[0, 0.012, 0]}>
              <cylinderGeometry args={[0.07, 0.075, 0.024, 20]} />
              <Mat f="rubber" s={frame} />
            </mesh>
          </group>
        )),
      )}

      {/* Control cabinet: painted panels, a vented door and side grilles */}
      <Box p={[-0.3, 0.66, -0.15]} size={[1.0, 1.0, 0.8]} f="panel" s={frame} />
      <Box p={[-0.38, 0.64, 0.253]} size={[0.38, 0.8, 0.008]} f="white" s={frame} />
      <Vent p={[-0.38, 0.74, 0.26]} w={0.14} h={0.36} s={frame} />
      <Vent p={[-0.38, 0.36, 0.26]} w={0.24} h={0.12} s={frame} />
      <Vent p={[-0.68, 0.62, 0.256]} w={0.12} h={0.44} s={frame} />
      <Vent p={[-0.806, 0.72, -0.15]} w={0.34} h={0.42} face="left" s={frame} />
      <Box p={[-0.17, 0.68, 0.264]} size={[0.024, 0.16, 0.02]} f="dark" s={frame} />

      {/* Back panel with socket, and the steel ledge beside the crosshead */}
      <Box p={[0.5, 0.88, -0.22]} size={[0.36, 0.5, 0.06]} f="panel" s={frame} />
      <Box p={[0.56, 0.98, -0.184]} size={[0.09, 0.09, 0.016]} f="white" s={frame} />
      <Box p={[0.5, 1.21, -0.05]} size={[0.38, 0.18, 0.5]} f="brushed" s={frame} />

      {/* Base unit: stainless box with cooling fans */}
      <Box p={[0.32, 0.32, 0.38]} size={[1.12, 0.62, 0.78]} f="brushed" s={frame} />
      <Box p={[0.52, 0.64, 0.46]} size={[0.68, 0.02, 0.42]} f="steel" s={frame} />
      <Fan p={[-0.262, 0.46, 0.24]} s={frame} />
      <Fan p={[-0.262, 0.46, 0.5]} s={frame} />
      <Box p={[-0.268, 0.17, 0.38]} size={[0.02, 0.05, 0.14]} f="steel" s={frame} />

      {/* Wire guide bracket, temperature probe and air hoses */}
      <Box p={[-0.02, 1.0, 0.32]} size={[0.34, 0.1, 0.12]} f="steel" s={frame} />
      {[-0.12, 0.08].map((x) => (
        <Box key={x} p={[x, 0.83, 0.32]} size={[0.026, 0.3, 0.026]} f="steel" s={frame} />
      ))}
      <mesh position={[-0.11, 1.2, 0.34]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />
        <Mat f="red" s={frame} />
      </mesh>
      {hoses.map((g, k) => (
        <mesh key={k} geometry={g}>
          <Mat f="hose" s={frame} />
        </mesh>
      ))}

      {/* Bare wire in from below, silicone cable out over the pulleys */}
      <mesh geometry={wireGeo}>
        <meshStandardMaterial color="#d08a52" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh geometry={cableGeo}>
        <meshStandardMaterial color={TEAL} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* 3 · Extruder: drive housing, barrel and crosshead */}
      <Part i={EXTRUDER} s={st(EXTRUDER)} onSelect={onSelect} onHover={onHover}>
        <Box p={[-0.38, 1.44, -0.15]} size={[0.84, 0.56, 0.8]} f="brushed" s={st(EXTRUDER)} />
        <Box p={[-0.45, 1.46, 0.252]} size={[0.46, 0.3, 0.01]} f="graphite" s={st(EXTRUDER)} />
        <mesh position={[-0.45, 1.44, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.4, 32]} />
          <Mat f="steel" s={st(EXTRUDER)} />
        </mesh>
        <Box p={[0.0, 1.45, 0.0]} size={[0.08, 0.6, 0.5]} f="steel" s={st(EXTRUDER)} />
        <mesh position={[0.07, 1.42, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.16, 32]} />
          <Mat f="steel" s={st(EXTRUDER)} />
        </mesh>
        {[0.0, 0.14].map((x) => (
          <mesh key={x} position={[x, 1.42, 0.15]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.122, 0.016, 10, 36]} />
            <Mat f="brushed" s={st(EXTRUDER)} />
          </mesh>
        ))}
        <Box p={[0.235, 1.33, 0.15]} size={[0.19, 0.3, 0.2]} f="steel" s={st(EXTRUDER)} />
        <Box p={[0.235, 1.22, 0.252]} size={[0.2, 0.03, 0.01]} f="dark" s={st(EXTRUDER)} />
        <mesh position={[0.235, 1.53, 0.15]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 24]} />
          <Mat f="brushed" s={st(EXTRUDER)} />
        </mesh>
        <mesh position={[0.235, 1.5, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.012, 8, 24]} />
          <Mat f="steel" s={st(EXTRUDER)} />
        </mesh>
        <mesh position={[0.235, 1.13, 0.15]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.05, 0.1, 20]} />
          <Mat f="steel" s={st(EXTRUDER)} />
        </mesh>
      </Part>

      {/* 5 · Capstan: three pulleys on a stainless tower */}
      <Part i={CAPSTAN} s={st(CAPSTAN)} onSelect={onSelect} onHover={onHover}>
        <Box p={[0.0, 1.96, -0.12]} size={[0.22, 0.52, 0.04]} f="brushed" s={st(CAPSTAN)} />
        <mesh position={[-0.08, 2.2, -0.09]} rotation={[0, 0, 0.55]}>
          <boxGeometry args={[0.52, 0.12, 0.03]} />
          <Mat f="brushed" s={st(CAPSTAN)} />
        </mesh>
        {[
          [-0.02, 2.36],
          [-0.27, 2.05],
          [0.16, 2.02],
        ].map(([x, y], k) => (
          <group key={k} ref={(el) => void (pulleys.current[k] = el)} position={[x, y, -0.03]}>
            <Wheel p={[0, 0, 0]} radius={0.15} width={0.07} f="steel" s={st(CAPSTAN)} />
          </group>
        ))}
      </Part>

      {/* 6 · Inspection: the blue gauge the wire passes through */}
      <Part i={INSPECTION} s={st(INSPECTION)} onSelect={onSelect} onHover={onHover}>
        <mesh position={[0.235, 0.74, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.035, 12, 32]} />
          <Mat f="blue" s={st(INSPECTION)} />
        </mesh>
        <Box p={[0.32, 0.74, 0.15]} size={[0.1, 0.13, 0.18]} f="blue" s={st(INSPECTION)} />
        <Box p={[0.45, 0.74, 0.15]} size={[0.24, 0.2, 0.26]} f="blue" s={st(INSPECTION)} />
        <mesh position={[0.47, 0.765, 0.282]}>
          <planeGeometry args={[0.1, 0.07]} />
          <meshStandardMaterial color="#2a0505" emissive="#ff3b30" emissiveIntensity={selected === INSPECTION ? 1.6 : 1.1} toneMapped={false} />
        </mesh>
        {[0.4, 0.43, 0.46].map((x) => (
          <Box key={x} p={[x, 0.69, 0.284]} size={[0.018, 0.018, 0.006]} f="white" s={st(INSPECTION)} />
        ))}
      </Part>
    </group>
  )
}

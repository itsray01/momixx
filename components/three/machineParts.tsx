'use client'

// Building blocks shared by the 3D machines: finishes, a material that reacts
// to hover and selection, clickable parts, rounded boxes and pulleys.

import { RoundedBox } from '@react-three/drei'
import type { ReactNode } from 'react'
import type * as THREE from 'three'

export type PartState = 'idle' | 'hover' | 'selected' | 'dim'

const SILICONE = '#e6e7e9'
const HIGHLIGHT = '#f4f5f6'

const finishes = {
  steel: { color: '#d3dae2', metalness: 0.92, roughness: 0.24 },
  brushed: { color: '#b9c2cc', metalness: 0.85, roughness: 0.38 },
  panel: { color: '#d7dde2', metalness: 0.08, roughness: 0.62 },
  cabinet: { color: '#3a3d42', metalness: 0.35, roughness: 0.5 },
  graphite: { color: '#2a2c30', metalness: 0.45, roughness: 0.45 },
  dark: { color: '#141618', metalness: 0.4, roughness: 0.5 },
  silicone: { color: SILICONE, metalness: 0.05, roughness: 0.38 },
  white: { color: '#f1f4f5', metalness: 0, roughness: 0.42 },
  copper: { color: '#d08a52', metalness: 0.6, roughness: 0.32 },
  rubber: { color: '#202226', metalness: 0, roughness: 0.8 },
  blue: { color: '#d0d3d6', metalness: 0.15, roughness: 0.42 },
  hose: { color: '#b7bcc2', metalness: 0, roughness: 0.3 },
  red: { color: '#d6312b', metalness: 0.1, roughness: 0.4 },
}
export type Finish = keyof typeof finishes

/** A material that lights up when its part is hovered or selected, and fades when another part is. */
export function Mat({ f, s }: { f: Finish; s: PartState }) {
  const glow = s === 'selected' ? 0.12 : s === 'hover' ? 0.1 : 0
  const dim = s === 'dim'
  // Keyed, because switching a material to transparent needs a new material.
  return <meshStandardMaterial key={dim ? 'dim' : 'solid'} {...finishes[f]} emissive={HIGHLIGHT} emissiveIntensity={glow} transparent={dim} opacity={dim ? 0.14 : 1} depthWrite={!dim} />
}
export function Glass({ s }: { s: PartState }) {
  return <meshPhysicalMaterial color="#e8eaed" roughness={0.06} metalness={0} clearcoat={1} transparent opacity={s === 'dim' ? 0.04 : 0.2} depthWrite={false} />
}
export function Heat({ s, intensity = 1.6 }: { s: PartState; intensity?: number }) {
  return <meshStandardMaterial color="#ff9a5c" emissive="#ff6a2a" emissiveIntensity={s === 'dim' ? 0.15 : intensity} toneMapped={false} transparent opacity={s === 'dim' ? 0.25 : 1} />
}
export function Screen({ s }: { s: PartState }) {
  return <meshStandardMaterial color="#16181b" emissive={HIGHLIGHT} emissiveIntensity={s === 'dim' ? 0.1 : 0.9} toneMapped={false} transparent opacity={s === 'dim' ? 0.2 : 1} />
}

type PartProps = {
  i: number
  s: PartState
  onSelect?: (i: number) => void
  onHover?: (i: number | null) => void
  children: ReactNode
}

export function Part({ i, onSelect, onHover, children }: PartProps) {
  const interactive = Boolean(onSelect)
  return (
    <group
      onClick={
        interactive
          ? (e) => {
              e.stopPropagation()
              onSelect?.(i)
            }
          : undefined
      }
      onPointerOver={
        interactive
          ? (e) => {
              e.stopPropagation()
              onHover?.(i)
              document.body.style.cursor = 'pointer'
            }
          : undefined
      }
      onPointerOut={
        interactive
          ? () => {
              onHover?.(null)
              document.body.style.cursor = ''
            }
          : undefined
      }
    >
      {children}
    </group>
  )
}

export function Box({ p, size, f, s, r = 0 }: { p: [number, number, number]; size: [number, number, number]; f: Finish; s: PartState; r?: number }) {
  const radius = Math.min(0.04, Math.min(...size) / 4)
  return (
    <RoundedBox args={size} radius={radius} smoothness={3} position={p} rotation={[0, r, 0]}>
      <Mat f={f} s={s} />
    </RoundedBox>
  )
}

/** A grooved pulley with its axle along z. */
export function Wheel({ p, radius, width, f, s, spin }: { p: [number, number, number]; radius: number; width: number; f: Finish; s: PartState; spin?: React.RefObject<THREE.Group | null> }) {
  return (
    <group position={p} ref={spin}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.94, radius * 0.94, width, 48]} />
        <Mat f={f} s={s} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 0, (side * width) / 2]}>
          <torusGeometry args={[radius * 0.96, width * 0.16, 10, 48]} />
          <Mat f="steel" s={s} />
        </mesh>
      ))}
      <mesh position={[0, 0, width / 2 + 0.002]}>
        <ringGeometry args={[radius * 0.3, radius * 0.72, 48]} />
        <Mat f="brushed" s={s} />
      </mesh>
      {[0, 1, 2].map((k) => (
        <mesh key={k} position={[Math.cos((k * Math.PI * 2) / 3) * radius * 0.5, Math.sin((k * Math.PI * 2) / 3) * radius * 0.5, width / 2 + 0.006]}>
          <circleGeometry args={[radius * 0.11, 20]} />
          <Mat f="dark" s={s} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.16, radius * 0.16, width * 1.8, 20]} />
        <Mat f="graphite" s={s} />
      </mesh>
    </group>
  )
}


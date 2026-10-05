'use client'

// An exploded silicone data cable: copper, insulation, foil, braid and the
// MoMixx silicone jacket, each layer stripped back further than the one
// outside it. `explode` (or the ref, for scroll-driven motion) pulls them apart.

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { layerOffsets } from './cableLayers'

const L0 = -3.4 // left end of every layer (hidden inside the jacket)
const ends = { braid: -0.15, foil: 0.75, insulation: 1.6, copper: 2.35 }

type Highlight = string | null

function glow(id: string, h: Highlight) {
  if (h === null) return { emissiveIntensity: 0, opacity: 1 }
  return h === id ? { emissiveIntensity: 0.18, opacity: 1 } : { emissiveIntensity: 0, opacity: 0.22 }
}

function Mat({ id, h, color, metalness = 0, roughness = 0.4, sheen = false, side, emissive = '#f4f5f6' }: { id: string; h: Highlight; color: string; metalness?: number; roughness?: number; sheen?: boolean; side?: THREE.Side; emissive?: string }) {
  const g = glow(id, h)
  const dim = g.opacity < 1
  return (
    <meshPhysicalMaterial
      key={dim ? 'dim' : 'solid'}
      color={color}
      metalness={metalness}
      roughness={roughness}
      sheen={sheen ? 0.8 : 0}
      sheenColor="#ffffff"
      sheenRoughness={0.5}
      clearcoat={sheen ? 0.4 : 0}
      emissive={emissive}
      emissiveIntensity={g.emissiveIntensity}
      transparent={dim}
      opacity={g.opacity}
      depthWrite={!dim}
      side={side}
    />
  )
}

/** A cylinder along x from a to b. */
function Rod({ a, b, r, y = 0, z = 0, open = false, children }: { a: number; b: number; r: number; y?: number; z?: number; open?: boolean; children: React.ReactNode }) {
  return (
    <mesh position={[(a + b) / 2, y, z]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r, r, b - a, 48, 1, open]} />
      {children}
    </mesh>
  )
}

const wires = [
  { y: 0.2, z: 0.2, color: '#d64545' },
  { y: -0.2, z: 0.2, color: '#1d232b' },
  { y: 0.2, z: -0.2, color: '#eef1f4' },
  { y: -0.2, z: -0.2, color: '#2f9e5a' },
]

export function CableAnatomyModel({
  explode = 0.55,
  explodeRef,
  shownRef,
  highlight = null,
}: {
  explode?: number
  /** Target explode amount, e.g. driven by scroll. */
  explodeRef?: RefObject<number>
  /** Receives the eased explode amount actually shown (for markers). */
  shownRef?: RefObject<number>
  highlight?: Highlight
}) {
  const jacket = useRef<THREE.Group>(null)
  const core = useRef<THREE.Group>(null)
  const current = useRef(explode)

  const braid = useMemo(() => {
    const geos: THREE.TubeGeometry[] = []
    const len = ends.braid - L0
    for (let k = 0; k < 24; k++) {
      const dir = k % 2 ? 1 : -1
      const phase = (Math.floor(k / 2) / 12) * Math.PI * 2
      const pts: THREE.Vector3[] = []
      for (let s = 0; s <= 120; s++) {
        const t = s / 120
        const a = phase + dir * t * Math.PI * 2 * 3.2
        pts.push(new THREE.Vector3(L0 + t * len, Math.cos(a) * 0.6, Math.sin(a) * 0.6))
      }
      geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, 0.022, 6, false))
    }
    return geos
  }, [])

  const foilSeam = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const len = ends.foil - L0
    for (let s = 0; s <= 200; s++) {
      const t = s / 200
      const a = t * Math.PI * 2 * 7
      pts.push(new THREE.Vector3(L0 + t * len, Math.cos(a) * 0.525, Math.sin(a) * 0.525))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.008, 4, false)
  }, [])

  useFrame((_, delta) => {
    const target = explodeRef ? explodeRef.current : explode
    current.current = THREE.MathUtils.damp(current.current, target, 4, delta)
    if (shownRef) shownRef.current = current.current
    const o = layerOffsets(current.current)
    if (jacket.current) jacket.current.position.x = o.jacket
    if (core.current) core.current.position.x = o.core
  })

  const h = highlight
  const jacketEnd = -0.95

  return (
    <group rotation={[0, 0, 0.04]}>
      {/* 5 · Silicone jacket (hollow, cut end visible) */}
      <group ref={jacket}>
        <Rod a={L0 - 0.4} b={jacketEnd} r={0.78} open>
          <Mat id="jacket" h={h} color="#149f94" roughness={0.38} sheen side={THREE.DoubleSide} emissive="#6dd5c9" />
        </Rod>
        <mesh position={[jacketEnd, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.63, 0.78, 64]} />
          <Mat id="jacket" h={h} color="#34bdb0" roughness={0.5} sheen side={THREE.DoubleSide} emissive="#6dd5c9" />
        </mesh>
        <Rod a={L0 - 0.4} b={jacketEnd} r={0.63} open>
          <Mat id="jacket" h={h} color="#0e514e" roughness={0.6} side={THREE.BackSide} emissive="#6dd5c9" />
        </Rod>
      </group>

      {/* 4 · Braided shield */}
      {braid.map((g, k) => (
        <mesh key={k} geometry={g}>
          <Mat id="braid" h={h} color="#c9cfd6" metalness={0.9} roughness={0.32} />
        </mesh>
      ))}

      {/* 3 · Foil shield */}
      <Rod a={L0} b={ends.foil} r={0.52}>
        <Mat id="foil" h={h} color="#dfe4ea" metalness={1} roughness={0.22} />
      </Rod>
      <mesh geometry={foilSeam}>
        <Mat id="foil" h={h} color="#9aa3ad" metalness={1} roughness={0.35} />
      </mesh>

      {/* 2 and 1 · Insulated wires with bare copper ends */}
      <group ref={core}>
        {wires.map((w) => (
          <group key={w.color}>
            <Rod a={L0} b={ends.insulation} r={0.17} y={w.y} z={w.z}>
              <Mat id="insulation" h={h} color={w.color} roughness={0.45} />
            </Rod>
            {[0, 1, 2, 3, 4, 5, 6].map((k) => {
              const a = (k / 6) * Math.PI * 2
              const r = k === 6 ? 0 : 0.065
              return (
                <Rod key={k} a={ends.insulation - 0.05} b={ends.copper - (k === 6 ? 0 : 0.03)} r={0.042} y={w.y + Math.cos(a) * r} z={w.z + Math.sin(a) * r}>
                  <Mat id="copper" h={h} color="#d08a52" metalness={0.85} roughness={0.28} />
                </Rod>
              )
            })}
          </group>
        ))}
      </group>
    </group>
  )
}


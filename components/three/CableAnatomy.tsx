'use client'

// An exploded silicone data cable: copper, insulation, foil, braid and the
// MoMixx silicone jacket, each layer stripped back further than the one
// outside it. `explode` (or the ref, for scroll-driven motion) pulls them apart.

import { useFrame, useThree } from '@react-three/fiber'
import { createContext, useContext, useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { cableColourById } from './cableColours'
import { anatomyColour, layerOffsets } from './cableLayers'

// Every layer runs back past the left edge of the frame (hidden inside the jacket
// normally), so an x-rayed layer shows its whole length, not a stub.
const L0 = -5.2
// The braid's weave and the foil's seam keep the spacing they were drawn with
// from here, so the cut ends look the same as in the pre-rendered image.
const PATTERN_FROM = -3.4
const jacketColour = cableColourById(anatomyColour)!
const ends = { braid: -0.15, foil: 0.75, insulation: 1.6, copper: 2.35 }
/** Where the jacket slides to when the cable closes up: its cut end just past the copper tips. */
export const CLOSED = 3.6
/** The jacket's cut end, before it moves. */
export const JACKET_END = -0.95

type Highlight = string | null

// Picking a layer x-rays the rest: they fade see-through, while the picked one
// looks exactly as it does normally (no glow, which would wash its colour out).
// Every material is set up as transparent from the start, so a fade never has
// to rebuild a shader; at full opacity it draws like a solid surface.
const GHOST = 0.2
/**
 * 'charge' (the story's last beat): a clean x-ray of the whole cable while it
 * charges, copper solid, the silicone faint, the shields all but gone.
 */
const CHARGE: Record<string, number> = { copper: 1, jacket: 0.16, insulation: 0.1, braid: 0, foil: 0 }

/** A live highlight (the scroll story drives it without re-rendering); overrides the `highlight` prop. */
const HighlightRef = createContext<RefObject<Highlight> | null>(null)

const ghostFor = (id: string, h: Highlight) => (h === 'charge' ? (CHARGE[id] ?? 0) : h !== null && h !== id ? GHOST : 1)

function Mat({ id, h, color, metalness = 0, roughness = 0.4, sheen = false, side }: { id: string; h: Highlight; color: string; metalness?: number; roughness?: number; sheen?: boolean; side?: THREE.Side }) {
  const ref = useRef<THREE.MeshPhysicalMaterial>(null)
  const shown = useRef(1)
  const invalidate = useThree((s) => s.invalidate)
  const live = useContext(HighlightRef)

  // Keeps drawing while a fade eases in, also when the scene only draws on demand.
  useEffect(() => invalidate(), [h, invalidate])
  useFrame((_, delta) => {
    const m = ref.current
    if (!m) return
    const to = ghostFor(id, live ? live.current : h)
    shown.current = THREE.MathUtils.damp(shown.current, to, 10, delta)
    if (Math.abs(shown.current - to) < 0.002) shown.current = to
    m.opacity = shown.current
    // Solid layers hide what is behind them; see-through ones must not.
    m.depthWrite = shown.current > 0.99
    if (shown.current !== to) invalidate()
  })

  return (
    <meshPhysicalMaterial
      ref={ref}
      color={color}
      metalness={metalness}
      roughness={roughness}
      sheen={sheen ? 0.8 : 0}
      sheenColor="#ffffff"
      sheenRoughness={0.5}
      clearcoat={sheen ? 0.4 : 0}
      transparent
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

/** Where each wire runs in the cable's cross-section (y, z): the scroll story's light follows them. */
export const wireCentres = wires.map((w) => [w.y, w.z] as const)

export function CableAnatomyModel({
  explode = 0.55,
  explodeRef,
  shownRef,
  highlight = null,
  highlightRef,
  closeRef,
  reach = L0,
  tilt = 0.04,
}: {
  explode?: number
  /** Target explode amount, e.g. driven by scroll. */
  explodeRef?: RefObject<number>
  /** Receives the eased explode amount actually shown (for markers). */
  shownRef?: RefObject<number>
  highlight?: Highlight
  /** A live highlight, e.g. driven by scroll; overrides `highlight`. */
  highlightRef?: RefObject<Highlight>
  /** 0 = stripped as usual, 1 = the jacket slid forward over every layer, so the cable is whole. */
  closeRef?: RefObject<number>
  /** How far left the jacket, wires and copper run (the scroll story's wide view needs them long). */
  reach?: number
  /** A slight rise to the right, for the still and the stand-alone anatomy. */
  tilt?: number
}) {
  const jacket = useRef<THREE.Group>(null)
  const core = useRef<THREE.Group>(null)
  const current = useRef(explode)

  const braid = useMemo(() => {
    const geos: THREE.TubeGeometry[] = []
    const len = ends.braid - L0
    const turnsPerUnit = 3.2 / (ends.braid - PATTERN_FROM)
    const steps = Math.round(len * 37)
    for (let k = 0; k < 24; k++) {
      const dir = k % 2 ? 1 : -1
      const phase = (Math.floor(k / 2) / 12) * Math.PI * 2
      const pts: THREE.Vector3[] = []
      for (let s = 0; s <= steps; s++) {
        const x = L0 + (s / steps) * len
        const a = phase + dir * (x - PATTERN_FROM) * turnsPerUnit * Math.PI * 2
        pts.push(new THREE.Vector3(x, Math.cos(a) * 0.6, Math.sin(a) * 0.6))
      }
      geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), steps * 2, 0.022, 6, false))
    }
    return geos
  }, [])

  const foilSeam = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const len = ends.foil - L0
    const turnsPerUnit = 7 / (ends.foil - PATTERN_FROM)
    const steps = Math.round(len * 48)
    for (let s = 0; s <= steps; s++) {
      const x = L0 + (s / steps) * len
      const a = (x - PATTERN_FROM) * turnsPerUnit * Math.PI * 2
      pts.push(new THREE.Vector3(x, Math.cos(a) * 0.525, Math.sin(a) * 0.525))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), steps * 2, 0.008, 4, false)
  }, [])

  useFrame((_, delta) => {
    const target = explodeRef ? explodeRef.current : explode
    current.current = THREE.MathUtils.damp(current.current, target, 4, delta)
    if (shownRef) shownRef.current = current.current
    const o = layerOffsets(current.current)
    const c = closeRef ? closeRef.current : 0
    if (jacket.current) jacket.current.position.x = THREE.MathUtils.lerp(o.jacket, CLOSED, c)
    if (core.current) core.current.position.x = THREE.MathUtils.lerp(o.core, 0, c)
  })

  const h = highlight
  const jacketEnd = JACKET_END

  return (
    <HighlightRef.Provider value={highlightRef ?? null}>
    <group rotation={[0, 0, tilt]}>
      {/* 5 · Silicone jacket (hollow, cut end visible) */}
      <group ref={jacket}>
        <Rod a={reach - 0.4} b={jacketEnd} r={0.78} open>
          <Mat id="jacket" h={h} color={jacketColour.jacket} roughness={0.38} sheen side={THREE.DoubleSide} />
        </Rod>
        <mesh position={[jacketEnd, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.63, 0.78, 64]} />
          <Mat id="jacket" h={h} color={jacketColour.cut} roughness={0.5} sheen side={THREE.DoubleSide} />
        </mesh>
        <Rod a={reach - 0.4} b={jacketEnd} r={0.63} open>
          <Mat id="jacket" h={h} color={jacketColour.inner} roughness={0.6} side={THREE.BackSide} />
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

      {/* 2 and 1 · Insulated wires. The copper runs their whole length (hidden inside the coating,
          and seen when the other layers are x-rayed), bare where the coating stops. */}
      <group ref={core}>
        {wires.map((w) => (
          <group key={w.color}>
            <Rod a={reach} b={ends.insulation} r={0.17} y={w.y} z={w.z}>
              <Mat id="insulation" h={h} color={w.color} roughness={0.45} />
            </Rod>
            {[0, 1, 2, 3, 4, 5, 6].map((k) => {
              const a = (k / 6) * Math.PI * 2
              const r = k === 6 ? 0 : 0.065
              return (
                <Rod key={k} a={reach} b={ends.copper - (k === 6 ? 0 : 0.03)} r={0.042} y={w.y + Math.cos(a) * r} z={w.z + Math.sin(a) * r}>
                  <Mat id="copper" h={h} color="#d08a52" metalness={0.85} roughness={0.28} />
                </Rod>
              )
            })}
          </group>
        ))}
      </group>
    </group>
    </HighlightRef.Provider>
  )
}


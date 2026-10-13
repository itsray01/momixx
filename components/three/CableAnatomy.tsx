'use client'

// An exploded silicone data cable: copper, insulation, foil, braid and the
// MoMixx silicone jacket, each layer stripped back further than the one
// outside it. `explode` (or the ref, for scroll-driven motion) pulls them apart.

import { useFrame, useThree } from '@react-three/fiber'
import { createContext, useContext, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { cableColourById } from './cableColours'
import { anatomyColour, layerOffsets } from './cableLayers'
import { makeXray } from './xray'

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

// Picking a layer x-rays the rest: they turn into faint glass outlines (xray.ts),
// while the picked one looks exactly as it does normally. Every material is set
// up as transparent from the start, so a change never has to rebuild a shader;
// with no x-ray it draws like a solid surface.
type Look = { xray: number; alpha: number }
const SOLID: Look = { xray: 0, alpha: 1 }
const GHOST: Look = { xray: 1, alpha: 1 }
/**
 * 'charge' (the story's last beat): an x-ray of the whole cable while it
 * charges, copper solid, the silicone and wire coatings as outlines, the shields gone.
 */
const CHARGE: Record<string, Look> = {
  copper: SOLID,
  jacket: { xray: 1, alpha: 0.9 },
  insulation: { xray: 1, alpha: 0.45 },
  braid: { xray: 1, alpha: 0 },
  foil: { xray: 1, alpha: 0 },
}

const lookFor = (id: string, h: Highlight): Look => (h === 'charge' ? (CHARGE[id] ?? GHOST) : h !== null && h !== id ? GHOST : SOLID)

/** How far out each layer sits, copper innermost. */
const RANK: Record<string, number> = { copper: 1, insulation: 2, foil: 3, braid: 4, jacket: 5 }
const LAYER_IDS = Object.keys(RANK)

/**
 * Each layer's look as it eases from one highlight to the next (worked out once a
 * frame, before any layer draws), and the order the layers draw in:
 *  - first, outlines outside every solid layer, so a solid layer covers them (no veils over it);
 *  - then the solid and fading layers, inside out, so what is inside a fading layer shows through;
 *  - last, outlines inside them, seen through the cut ends and through a layer as it fades.
 * A layer that is not fully an outline also hides its own far side (depthWrite), so part-way
 * through a fade it never shows its back through its front.
 */
function makeLooks() {
  const shown = Object.fromEntries(LAYER_IDS.map((id) => [id, { xray: 0, alpha: 1 }]))
  const groups = Object.fromEntries(LAYER_IDS.map((id) => [id, new Set<THREE.Object3D>()]))
  return {
    get: (id: string) => shown[id],
    /** Lets a group of a layer's meshes take that layer's place in the drawing order. */
    track(id: string, g: THREE.Object3D | null) {
      if (!g) return
      groups[id].add(g)
      return () => void groups[id].delete(g)
    },
    /** Eases every layer towards the highlight; true while anything is still changing. */
    step(h: Highlight, dt: number) {
      let busy = false
      let outermostSolid = 0
      for (const id of LAYER_IDS) {
        const to = lookFor(id, h)
        const s = shown[id]
        s.xray = THREE.MathUtils.damp(s.xray, to.xray, 9, dt)
        s.alpha = THREE.MathUtils.damp(s.alpha, to.alpha, 9, dt)
        if (Math.abs(s.xray - to.xray) < 0.002) s.xray = to.xray
        if (Math.abs(s.alpha - to.alpha) < 0.002) s.alpha = to.alpha
        if (s.xray !== to.xray || s.alpha !== to.alpha) busy = true
        if (s.xray < 0.99) outermostSolid = Math.max(outermostSolid, RANK[id])
      }
      for (const id of LAYER_IDS) {
        const order = shown[id].xray < 0.99 ? 10 + RANK[id] : RANK[id] > outermostSolid ? RANK[id] : 20 + RANK[id]
        groups[id].forEach((g) => void (g.renderOrder = order))
      }
      return busy
    },
  }
}
type Looks = ReturnType<typeof makeLooks>
const LooksContext = createContext<Looks | null>(null)

/** Eases the layers' looks, first thing each frame (it comes before the layers, so they read this frame's look). */
function LookDriver({ looks, highlight, highlightRef }: { looks: Looks; highlight: Highlight; highlightRef?: RefObject<Highlight> }) {
  const invalidate = useThree((s) => s.invalidate)
  // Keeps drawing while a change eases in, also when the scene only draws on demand.
  useEffect(() => invalidate(), [highlight, invalidate])
  useFrame((_, delta) => {
    if (looks.step(highlightRef ? highlightRef.current : highlight, delta)) invalidate()
  })
  return null
}

function Mat({ id, color, metalness = 0, roughness = 0.4, sheen = false, side }: { id: string; color: string; metalness?: number; roughness?: number; sheen?: boolean; side?: THREE.Side }) {
  const ref = useRef<THREE.MeshPhysicalMaterial>(null)
  const [xray] = useState(makeXray)
  const looks = useContext(LooksContext)!

  useFrame(() => {
    const m = ref.current
    if (!m) return
    const s = looks.get(id)
    xray.set(s.xray, s.alpha)
    m.depthWrite = s.xray < 0.99
    // A faded-out outline is skipped.
    m.visible = s.alpha > 0.01 || s.xray < 0.99
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
      onBeforeCompile={xray.patch}
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

  const [looks] = useState(makeLooks)
  const jacketEnd = JACKET_END

  return (
    <LooksContext.Provider value={looks}>
    <LookDriver looks={looks} highlight={highlight} highlightRef={highlightRef} />
    <group rotation={[0, 0, tilt]}>
      {/* Each layer's meshes sit in a group that takes the layer's place in the drawing order (makeLooks). */}
      {/* 5 · Silicone jacket (hollow, cut end visible) */}
      <group ref={jacket}>
        <group ref={(g) => looks.track('jacket', g)}>
          <Rod a={reach - 0.4} b={jacketEnd} r={0.78} open>
            <Mat id="jacket" color={jacketColour.jacket} roughness={0.38} sheen side={THREE.DoubleSide} />
          </Rod>
          <mesh position={[jacketEnd, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.63, 0.78, 64]} />
            <Mat id="jacket" color={jacketColour.cut} roughness={0.5} sheen side={THREE.DoubleSide} />
          </mesh>
          <Rod a={reach - 0.4} b={jacketEnd} r={0.63} open>
            <Mat id="jacket" color={jacketColour.inner} roughness={0.6} side={THREE.BackSide} />
          </Rod>
        </group>
      </group>

      {/* 4 · Braided shield */}
      <group ref={(g) => looks.track('braid', g)}>
        {braid.map((g, k) => (
          <mesh key={k} geometry={g}>
            <Mat id="braid" color="#c9cfd6" metalness={0.9} roughness={0.32} />
          </mesh>
        ))}
      </group>

      {/* 3 · Foil shield: a thin wrap, so its cut end is a narrow ring with the wires coming out of it */}
      <group ref={(g) => looks.track('foil', g)}>
        <Rod a={L0} b={ends.foil} r={0.52} open>
          <Mat id="foil" color="#dfe4ea" metalness={1} roughness={0.22} />
        </Rod>
        <mesh position={[ends.foil, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.495, 0.52, 64]} />
          <Mat id="foil" color="#c4cbd3" metalness={1} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <Rod a={L0} b={ends.foil} r={0.495} open>
          <Mat id="foil" color="#7d8690" metalness={1} roughness={0.45} side={THREE.BackSide} />
        </Rod>
        <mesh geometry={foilSeam}>
          <Mat id="foil" color="#9aa3ad" metalness={1} roughness={0.35} />
        </mesh>
      </group>

      {/* 2 and 1 · Insulated wires. The copper runs their whole length (hidden inside the coating,
          and seen when the other layers are x-rayed), bare where the coating stops. */}
      <group ref={core}>
        {wires.map((w) => (
          <group key={w.color}>
            <group ref={(g) => looks.track('insulation', g)}>
              <Rod a={reach} b={ends.insulation} r={0.17} y={w.y} z={w.z}>
                <Mat id="insulation" color={w.color} roughness={0.45} />
              </Rod>
            </group>
            <group ref={(g) => looks.track('copper', g)}>
              {[0, 1, 2, 3, 4, 5, 6].map((k) => {
                const a = (k / 6) * Math.PI * 2
                const r = k === 6 ? 0 : 0.065
                return (
                  <Rod key={k} a={reach} b={ends.copper - (k === 6 ? 0 : 0.03)} r={0.042} y={w.y + Math.cos(a) * r} z={w.z + Math.sin(a) * r}>
                    <Mat id="copper" color="#d08a52" metalness={0.85} roughness={0.28} />
                  </Rod>
                )
              })}
            </group>
          </group>
        ))}
      </group>
    </group>
    </LooksContext.Provider>
  )
}


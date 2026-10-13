'use client'

// An exploded silicone data cable: copper, insulation, foil, braid and the
// MoMixx silicone jacket, each layer stripped back further than the one
// outside it. `explode` (or the ref, for scroll-driven motion) pulls them apart.
//
// Picking a layer x-rays the rest: it stays solid while the others become faint
// glass outlines. The change sweeps along the cable as a scan line (xraySweep.ts):
// timed on hover, or moved by the scroll in the scroll story (`sweepRef`).

import { useFrame, useThree } from '@react-three/fiber'
import { createContext, useContext, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { cableColourById } from './cableColours'
import { anatomyColour, layerOffsets } from './cableLayers'
import { makeSolidMaterial, makeSweepUniforms, makeXrayMaterial, type SweepUniforms } from './xraySweep'

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

export type Highlight = string | null
/** A change of look driven from outside (the scroll story): from one highlight to the next, `f` of the way (0 to 1). */
export type Sweep = { from: Highlight; to: Highlight; f: number }

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

const LAYER_IDS = ['jacket', 'braid', 'foil', 'insulation', 'copper']

/** Where the scan line travels along the cable (x, in the cable's units): from past the left edge of the close-up to past the copper tips. */
const RANGE: [number, number] = [-6.5, 3.6]
/** How long a change takes when nothing scrolls it (hovering a label, and charging in the story). */
const SWEEP_SECONDS = 0.7

const smooth = (x: number) => x * x * (3 - 2 * x)

/** Every layer's sweep settings and the meshes that draw it, so a change of look is set in one place each frame. */
function makeLayers() {
  const layers = Object.fromEntries(LAYER_IDS.map((id) => [id, { u: makeSweepUniforms(), solid: new Set<THREE.Mesh>(), xray: new Set<THREE.Mesh>() }]))
  return {
    uniforms: (id: string): SweepUniforms => layers[id].u,
    /** Adds a part's two meshes to its layer; returns the undo. */
    register(id: string, solid: THREE.Mesh, xray: THREE.Mesh) {
      layers[id].solid.add(solid)
      layers[id].xray.add(xray)
      return () => {
        layers[id].solid.delete(solid)
        layers[id].xray.delete(xray)
      }
    },
    /** Shows the change from one highlight to another, `f` of the way along `range`. */
    show(from: Highlight, to: Highlight, f: number, range: [number, number]) {
      const at = f < 0.002 ? 0 : f > 0.998 ? 1 : f
      const front = at === 0 ? -1e4 : at === 1 ? 1e4 : THREE.MathUtils.lerp(range[0], range[1], at)
      for (const id of LAYER_IDS) {
        const { u, solid, xray } = layers[id]
        const a = lookFor(id, from)
        const b = lookFor(id, to)
        u.uFromX.value = a.xray
        u.uToX.value = b.xray
        u.uFromA.value = a.alpha
        u.uToA.value = b.alpha
        u.uFront.value = front
        u.uGlow.value = a.xray !== b.xray || a.alpha !== b.alpha ? Math.sin(Math.PI * at) : 0
        // Skip drawing a look that shows nowhere on the cable right now.
        const solidShown = (at < 1 && a.xray === 0) || (at > 0 && b.xray === 0)
        const xrayShown = (at < 1 && a.xray === 1 && a.alpha > 0.01) || (at > 0 && b.xray === 1 && b.alpha > 0.01)
        solid.forEach((m) => void (m.visible = solidShown))
        xray.forEach((m) => void (m.visible = xrayShown))
      }
    },
  }
}
type Layers = ReturnType<typeof makeLayers>
const LayersContext = createContext<Layers | null>(null)

/** A timed change of look, for when nothing scrolls it. */
function makeTimer() {
  let from: Highlight = null
  let to: Highlight = null
  let f = 1
  return {
    /** Holds still on a look (while the scroll is driving). */
    settle(h: Highlight) {
      from = h
      to = h
      f = 1
    },
    /** Moves towards `target`; a new target part-way through starts from whichever look is nearer. */
    step(target: Highlight, dt: number) {
      if (target !== to) {
        from = f >= 0.5 ? to : from
        to = target
        f = 0
      }
      f = Math.min(1, f + dt / SWEEP_SECONDS)
      return { from, to, f: smooth(f), busy: f < 1 }
    },
  }
}

type Surface = { color: string; metalness?: number; roughness?: number; sheen?: boolean; side?: THREE.Side }

/** One piece of a layer, drawn twice: solid, and as an x-ray outline (each where it shows right now). */
function Part({ id, geometry, position, rotation, color, metalness = 0, roughness = 0.4, sheen = false, side = THREE.FrontSide }: Surface & { id: string; geometry: THREE.BufferGeometry; position?: [number, number, number]; rotation?: [number, number, number] }) {
  const layers = useContext(LayersContext)!
  const solidRef = useRef<THREE.Mesh>(null)
  const xrayRef = useRef<THREE.Mesh>(null)
  const [mats] = useState(() => {
    const u = layers.uniforms(id)
    return {
      solid: makeSolidMaterial(
        { color, metalness, roughness, sheen: sheen ? 0.8 : 0, sheenColor: new THREE.Color('#ffffff'), sheenRoughness: 0.5, clearcoat: sheen ? 0.4 : 0, side },
        u,
      ),
      xray: makeXrayMaterial(color, side, u),
    }
  })
  useEffect(() => () => [mats.solid, mats.xray].forEach((m) => m.dispose()), [mats])
  useEffect(() => layers.register(id, solidRef.current!, xrayRef.current!), [layers, id])
  return (
    <>
      <mesh ref={solidRef} geometry={geometry} material={mats.solid} position={position} rotation={rotation} />
      <mesh ref={xrayRef} geometry={geometry} material={mats.xray} position={position} rotation={rotation} visible={false} />
    </>
  )
}

/** A cylinder along x from a to b. */
function Rod({ a, b, r, y = 0, z = 0, open = false, ...part }: Surface & { id: string; a: number; b: number; r: number; y?: number; z?: number; open?: boolean }) {
  const geometry = useMemo(() => new THREE.CylinderGeometry(r, r, b - a, 48, 1, open), [r, a, b, open])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <Part {...part} geometry={geometry} position={[(a + b) / 2, y, z]} rotation={[0, 0, Math.PI / 2]} />
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
  sweepRef,
  range = RANGE,
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
  /** A live highlight; overrides `highlight`. Changes to it sweep in over a moment. */
  highlightRef?: RefObject<Highlight>
  /** A change of look moved by scroll; while set, it overrides the highlight. */
  sweepRef?: RefObject<Sweep | null>
  /** Where a timed sweep travels along the cable (x), when the cable is seen from further away. */
  range?: [number, number]
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
  const [layers] = useState(makeLayers)
  const [timer] = useState(makeTimer)
  const invalidate = useThree((s) => s.invalidate)

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

  const cutEnd = useMemo(() => new THREE.RingGeometry(0.63, 0.78, 64), [])

  useEffect(
    () => () => {
      braid.forEach((g) => g.dispose())
      foilSeam.dispose()
      cutEnd.dispose()
    },
    [braid, foilSeam, cutEnd],
  )

  useFrame((_, delta) => {
    const target = explodeRef ? explodeRef.current : explode
    current.current = THREE.MathUtils.damp(current.current, target, 4, delta)
    if (shownRef) shownRef.current = current.current
    const o = layerOffsets(current.current)
    const c = closeRef ? closeRef.current : 0
    if (jacket.current) jacket.current.position.x = THREE.MathUtils.lerp(o.jacket, CLOSED, c)
    if (core.current) core.current.position.x = THREE.MathUtils.lerp(o.core, 0, c)

    // The look: moved by scroll when the story drives it, otherwise swept in over a moment.
    const scrolled = sweepRef?.current
    if (scrolled) {
      layers.show(scrolled.from, scrolled.to, scrolled.f, RANGE)
      timer.settle(scrolled.f >= 0.5 ? scrolled.to : scrolled.from)
    } else {
      const s = timer.step(highlightRef ? highlightRef.current : highlight, delta)
      layers.show(s.from, s.to, s.f, range)
      // Keeps drawing while it sweeps, also when the scene only draws on demand.
      if (s.busy) invalidate()
    }
  })

  const jacketEnd = JACKET_END

  return (
    <LayersContext.Provider value={layers}>
      <group rotation={[0, 0, tilt]}>
        {/* 5 · Silicone jacket (hollow, cut end visible) */}
        <group ref={jacket}>
          <Rod id="jacket" a={reach - 0.4} b={jacketEnd} r={0.78} open color={jacketColour.jacket} roughness={0.38} sheen side={THREE.DoubleSide} />
          <Part id="jacket" geometry={cutEnd} position={[jacketEnd, 0, 0]} rotation={[0, Math.PI / 2, 0]} color={jacketColour.cut} roughness={0.5} sheen side={THREE.DoubleSide} />
          <Rod id="jacket" a={reach - 0.4} b={jacketEnd} r={0.63} open color={jacketColour.inner} roughness={0.6} side={THREE.BackSide} />
        </group>

        {/* 4 · Braided shield */}
        {braid.map((g, k) => (
          <Part key={k} id="braid" geometry={g} color="#c9cfd6" metalness={0.9} roughness={0.32} />
        ))}

        {/* 3 · Foil shield */}
        <Rod id="foil" a={L0} b={ends.foil} r={0.52} color="#dfe4ea" metalness={1} roughness={0.22} />
        <Part id="foil" geometry={foilSeam} color="#9aa3ad" metalness={1} roughness={0.35} />

        {/* 2 and 1 · Insulated wires. The copper runs their whole length (hidden inside the coating,
            and seen when the other layers are x-rayed), bare where the coating stops. */}
        <group ref={core}>
          {wires.map((w) => (
            <group key={w.color}>
              <Rod id="insulation" a={reach} b={ends.insulation} r={0.17} y={w.y} z={w.z} color={w.color} roughness={0.45} />
              {[0, 1, 2, 3, 4, 5, 6].map((k) => {
                const a = (k / 6) * Math.PI * 2
                const r = k === 6 ? 0 : 0.065
                return (
                  <Rod
                    key={k}
                    id="copper"
                    a={reach}
                    b={ends.copper - (k === 6 ? 0 : 0.03)}
                    r={0.042}
                    y={w.y + Math.cos(a) * r}
                    z={w.z + Math.sin(a) * r}
                    color="#d08a52"
                    metalness={0.85}
                    roughness={0.28}
                  />
                )
              })}
            </group>
          ))}
        </group>
      </group>
    </LayersContext.Provider>
  )
}

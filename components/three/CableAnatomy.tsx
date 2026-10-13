'use client'

// An exploded silicone data cable: copper, insulation, foil, braid and the
// MoMixx silicone jacket, each layer stripped back further than the one
// outside it. `explode` (or the ref, for scroll-driven motion) pulls them apart.

import { useFrame, useThree } from '@react-three/fiber'
import { createContext, useContext, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
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
 * Each layer's look as it eases from one highlight to the next, worked out once a
 * frame before any layer draws. Every part is drawn as two pictures that cross-fade,
 * so a change never pops:
 *  - its outline, when its layer is x-rayed (drawn first, inside out, so a solid layer
 *    covers the outlines around it: no veils over the lit layer);
 *  - its solid self: layers that are solid or becoming solid next, inside out, then
 *    layers on their way to x-ray last, fading out over everything.
 * Nothing changes its place in that order part-way through a fade.
 */
function makeLooks() {
  const shown = Object.fromEntries(LAYER_IDS.map((id) => [id, { solid: 1, alpha: 1, orderOutline: RANK[id], orderSolid: 10 + RANK[id] }]))
  return {
    get: (id: string) => shown[id],
    /** Eases every layer towards the highlight; true while anything is still changing. */
    step(h: Highlight, dt: number) {
      let busy = false
      for (const id of LAYER_IDS) {
        const to = lookFor(id, h)
        const s = shown[id]
        const solidTo = 1 - to.xray
        s.solid = THREE.MathUtils.damp(s.solid, solidTo, 9, dt)
        s.alpha = THREE.MathUtils.damp(s.alpha, to.alpha, 9, dt)
        if (Math.abs(s.solid - solidTo) < 0.002) s.solid = solidTo
        if (Math.abs(s.alpha - to.alpha) < 0.002) s.alpha = to.alpha
        if (s.solid !== solidTo || s.alpha !== to.alpha) busy = true
        s.orderSolid = (solidTo === 1 ? 10 : 30) + RANK[id]
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

/**
 * What a part does when its layer is x-rayed. The outline suits big smooth surfaces;
 * a bundle of thin strands would become dozens of outlines stacked into a dark
 * tangle, so its strands step aside ('solid') and one simple shape stands in for
 * the whole bundle ('ghost', drawn only while the layer is x-rayed).
 */
type Role = 'both' | 'solid' | 'ghost'

/** The x-ray outline: a faint glass edge in the part's colour, lifted towards white so dark parts still show. */
function makeOutline(color: string, side: THREE.Side) {
  return new THREE.ShaderMaterial({
    uniforms: { uTint: { value: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.55) }, uStrength: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uTint;
      uniform float uStrength;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float facing = abs(dot(normalize(vN), normalize(vV)));
        float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 2.4);
        gl_FragColor = vec4(uTint * (0.12 + 1.15 * rim), (0.04 + 0.8 * rim) * uStrength);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    side,
  })
}

type Surface = { color: string; metalness?: number; roughness?: number; sheen?: boolean; side?: THREE.Side }

/**
 * One piece of a layer: its solid self and its x-ray outline, cross-fading as the
 * layer's look changes. While the solid self is part-way faded, a depth-only copy
 * drawn just before it stops its own far side showing through its front.
 */
function Part({
  id,
  role = 'both',
  strength = 1,
  geometry,
  position,
  rotation,
  color,
  metalness = 0,
  roughness = 0.4,
  sheen = false,
  side = THREE.FrontSide,
}: Surface & {
  id: string
  role?: Role
  /** How strongly this part's outline shows, when x-rayed. */
  strength?: number
  geometry: THREE.BufferGeometry
  position?: [number, number, number]
  rotation?: [number, number, number]
}) {
  const looks = useContext(LooksContext)!
  const solidRef = useRef<THREE.Mesh>(null)
  const depthRef = useRef<THREE.Mesh>(null)
  const outlineRef = useRef<THREE.Mesh>(null)
  const [mats] = useState(() => ({
    solid: new THREE.MeshPhysicalMaterial({
      color,
      metalness,
      roughness,
      sheen: sheen ? 0.8 : 0,
      sheenColor: new THREE.Color('#ffffff'),
      sheenRoughness: 0.5,
      clearcoat: sheen ? 0.4 : 0,
      side,
      transparent: true,
    }),
    depth: new THREE.MeshBasicMaterial({ colorWrite: false, side, transparent: true }),
    outline: makeOutline(color, side),
  }))
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats])

  useFrame(() => {
    const s = looks.get(id)
    const solid = role === 'ghost' ? 0 : s.solid
    const outline = role === 'solid' ? 0 : (1 - s.solid) * s.alpha * strength
    const m = solidRef.current
    if (m) {
      m.visible = solid > 0.01
      m.renderOrder = s.orderSolid
      ;(m.material as THREE.MeshPhysicalMaterial).opacity = solid
    }
    const d = depthRef.current
    if (d) {
      d.visible = solid > 0.01 && solid < 0.99
      d.renderOrder = s.orderSolid - 0.5
    }
    const o = outlineRef.current
    if (o) {
      o.visible = outline > 0.01
      o.renderOrder = s.orderOutline
      ;(o.material as THREE.ShaderMaterial).uniforms.uStrength.value = outline
    }
  })

  return (
    <>
      {role !== 'ghost' && <mesh ref={depthRef} geometry={geometry} material={mats.depth} position={position} rotation={rotation} visible={false} />}
      {role !== 'ghost' && <mesh ref={solidRef} geometry={geometry} material={mats.solid} position={position} rotation={rotation} />}
      {role !== 'solid' && <mesh ref={outlineRef} geometry={geometry} material={mats.outline} position={position} rotation={rotation} visible={false} />}
    </>
  )
}

/** A cylinder along x from a to b. */
function Rod({ a, b, r, y = 0, z = 0, open = false, ...part }: Surface & { id: string; role?: Role; strength?: number; a: number; b: number; r: number; y?: number; z?: number; open?: boolean }) {
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

  const cutEnd = useMemo(() => new THREE.RingGeometry(0.63, 0.78, 64), [])
  const foilEnd = useMemo(() => new THREE.RingGeometry(0.495, 0.52, 64), [])
  useEffect(
    () => () => {
      braid.forEach((g) => g.dispose())
      foilSeam.dispose()
      cutEnd.dispose()
      foilEnd.dispose()
    },
    [braid, foilSeam, cutEnd, foilEnd],
  )

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
      {/* 5 · Silicone jacket (hollow, cut end visible). Its inner wall only shows while solid: as an
          outline it would double the tube's lines. */}
      <group ref={jacket}>
        <Rod id="jacket" a={reach - 0.4} b={jacketEnd} r={0.78} open color={jacketColour.jacket} roughness={0.38} sheen />
        <Part id="jacket" geometry={cutEnd} position={[jacketEnd, 0, 0]} rotation={[0, Math.PI / 2, 0]} color={jacketColour.cut} roughness={0.5} sheen side={THREE.DoubleSide} />
        <Rod id="jacket" role="solid" a={reach - 0.4} b={jacketEnd} r={0.63} open color={jacketColour.inner} roughness={0.6} side={THREE.BackSide} />
      </group>

      {/* 4 · Braided shield. X-rayed, it is one sleeve with the weave showing faintly inside it. */}
      {braid.map((g, k) => (
        <Part key={k} id="braid" strength={0.3} geometry={g} color="#c9cfd6" metalness={0.9} roughness={0.32} />
      ))}
      <Rod id="braid" role="ghost" a={L0} b={ends.braid} r={0.625} open color="#c9cfd6" />

      {/* 3 · Foil shield: a thin wrap, so its cut end is a narrow ring with the wires coming out of it */}
      <Rod id="foil" a={L0} b={ends.foil} r={0.52} open color="#dfe4ea" metalness={1} roughness={0.22} />
      <Part id="foil" geometry={foilEnd} position={[ends.foil, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#c4cbd3" metalness={1} roughness={0.3} side={THREE.DoubleSide} />
      <Rod id="foil" role="solid" a={L0} b={ends.foil} r={0.495} open color="#7d8690" metalness={1} roughness={0.45} side={THREE.BackSide} />
      <Part id="foil" strength={0.5} geometry={foilSeam} color="#9aa3ad" metalness={1} roughness={0.35} />

      {/* 2 and 1 · Insulated wires. The copper runs their whole length (hidden inside the coating,
          and seen when the other layers are x-rayed), bare where the coating stops. X-rayed, each
          wire's seven strands become one outline of the bundle. */}
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
                  role="solid"
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
            <Rod id="copper" role="ghost" a={reach} b={ends.copper} r={0.11} y={w.y} z={w.z} open color="#d08a52" />
          </group>
        ))}
      </group>
    </group>
    </LooksContext.Provider>
  )
}


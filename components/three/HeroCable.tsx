'use client'

// A silicone data cable with its end stripped back in steps, the way a cable
// engineer would show it: satin silicone jacket, woven metal braid, foil wrap,
// four colour-coded wires and bare stranded copper. Used live in the home hero
// and pre-rendered (scripts/render-models.mjs) for the hero still and cards.
//
// In the hero the cable can also flex like a real one: a wave runs along it
// (worked out on the graphics card, see FLEX_GLSL) while the stripped end
// follows the bend and twists, and its colour blends from one to the next.

import { useFrame, type ThreeElements } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { cableColours, type CableColour } from './cableColours'
import { studioMaterial } from './studioMatcap'

/** Jacket outer radius, shared with the hero callout dots so they sit on the surface. */
export const JACKET_RADIUS = 0.3
const R = JACKET_RADIUS
const JACKET_IN = 0.245
const BRAID_R = 0.236
const FOIL_R = 0.222

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

/** The cable's path. `hero` sits in the right-hand column of the home hero; `card` fits a 4:3 still. */
export const cablePaths = {
  hero: [v(1.5, -4.8, -2.4), v(1.1, -2.7, -0.7), v(0.55, -1.25, 0.3), v(0.02, -0.05, 0.8), v(-0.28, 0.75, 1.1)],
  card: [v(-4.8, -2.2, -1.6), v(-2.6, -1.5, 0.1), v(-0.6, -0.8, 0.6), v(0.7, 0.1, 0.6), v(1.25, 0.9, 0.55)],
}

/** A woven-braid texture, drawn once: two sets of strand bundles passing over and under each other. */
function useBraidTexture() {
  const tex = useMemo(() => {
    const size = 256
    const c = document.createElement('canvas')
    c.width = c.height = size
    const g = c.getContext('2d')!
    g.fillStyle = '#4a525b'
    g.fillRect(0, 0, size, size)
    const cell = size / 8
    // Each cell holds one bundle of 4 strands, alternating direction like a basket weave.
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const x0 = i * cell
        const y0 = j * cell
        const horizontal = (i + j) % 2 === 0
        for (let k = 0; k < 4; k++) {
          const off = (k + 0.5) * (cell / 4)
          const grad = horizontal ? g.createLinearGradient(0, y0 + off - 3, 0, y0 + off + 3) : g.createLinearGradient(x0 + off - 3, 0, x0 + off + 3, 0)
          grad.addColorStop(0, '#7d868f')
          grad.addColorStop(0.5, '#f1f4f7')
          grad.addColorStop(1, '#7d868f')
          g.fillStyle = grad
          if (horizontal) g.fillRect(x0 + 1, y0 + off - 3, cell - 2, 6)
          else g.fillRect(x0 + off - 3, y0 + 1, 6, cell - 2)
        }
      }
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.colorSpace = THREE.SRGBColorSpace
    // Turned 45° by the UV repeat below, so the bundles run diagonally like a real braid.
    t.rotation = Math.PI / 4
    t.repeat.set(5, 2.5)
    t.anisotropy = 8
    return t
  }, [])
  useEffect(() => () => tex.dispose(), [tex])
  return tex
}

const wires = [
  { at: [0.082, 0.082], color: '#c8382f' },
  { at: [-0.082, 0.082], color: '#eef1f4' },
  { at: [-0.082, -0.082], color: '#1d2228' },
  { at: [0.082, -0.082], color: '#2f8f55' },
] as const

/**
 * The four insulated wires leaving the foil and splaying slightly, each ending
 * in bare copper strands. All the insulation is one mesh, coloured per vertex,
 * and all the copper another: two draws instead of thirty-six, which matters
 * most on devices drawing without a graphics card.
 */
function useWireGeometry() {
  const geo = useMemo(() => {
    const insulation: THREE.BufferGeometry[] = []
    const copper: THREE.BufferGeometry[] = []
    const m = new THREE.Matrix4()
    const one = v(1, 1, 1)
    const upright = new THREE.Quaternion().setFromAxisAngle(v(1, 0, 0), Math.PI / 2)
    const strands = [[0, 0], ...Array.from({ length: 6 }, (_, k) => [Math.cos((k * Math.PI) / 3) * 0.042, Math.sin((k * Math.PI) / 3) * 0.042])]
    for (const { at: [x, y], color } of wires) {
      const curve = new THREE.CatmullRomCurve3([v(x, y, 0.05), v(x, y, 0.46), v(x * 1.3, y * 1.3, 0.66), v(x * 1.65, y * 1.65, 0.86)])
      const atEnd = new THREE.Matrix4().compose(curve.getPoint(1), new THREE.Quaternion().setFromUnitVectors(v(0, 0, 1), curve.getTangent(1).normalize()), one)
      const rgb = new THREE.Color(color)
      for (const g of [new THREE.TubeGeometry(curve, 48, 0.066, 28, false), new THREE.CircleGeometry(0.066, 28).applyMatrix4(atEnd)]) {
        const colours = new Float32Array(g.attributes.position.count * 3)
        for (let i = 0; i < colours.length; i += 3) rgb.toArray(colours, i)
        g.setAttribute('color', new THREE.BufferAttribute(colours, 3))
        insulation.push(g)
      }
      for (const [sx, sy] of strands) {
        copper.push(new THREE.CylinderGeometry(0.019, 0.019, 0.17, 12).applyMatrix4(m.compose(v(sx, sy, 0.085), upright, one)).applyMatrix4(atEnd))
      }
    }
    const merged = { insulation: mergeGeometries(insulation), copper: mergeGeometries(copper) }
    for (const g of [...insulation, ...copper]) g.dispose()
    return merged
  }, [])
  useEffect(
    () => () => {
      geo.insulation.dispose()
      geo.copper.dispose()
    },
    [geo],
  )
  return geo
}

/**
 * Surfaces of the stripped end: lit by the scene's lights and reflections, or,
 * given the baked studio (`matcap`, for devices without a graphics card), by that.
 */
function useEndMaterials(braid: THREE.Texture, matcap: THREE.Texture | undefined) {
  const mats = useMemo(() => {
    const double = THREE.DoubleSide
    if (matcap) {
      return {
        braid: studioMaterial(matcap, { metal: true, map: braid, color: '#f2f5f8' }),
        foilEdge: studioMaterial(matcap, { metal: true, color: '#8d969f' }),
        foil: studioMaterial(matcap, { metal: true, color: '#e3e8ed' }),
        filler: studioMaterial(matcap, { color: '#0c1117', gloss: 0.2 }),
        insulation: studioMaterial(matcap, { vertexColors: true }),
        copper: studioMaterial(matcap, { metal: true, color: '#c97f4c' }),
      }
    }
    return {
      braid: new THREE.MeshStandardMaterial({ map: braid, color: '#f2f5f8', metalness: 0.6, roughness: 0.32, side: double }),
      foilEdge: new THREE.MeshStandardMaterial({ color: '#8d969f', metalness: 0.9, roughness: 0.4, side: double }),
      foil: new THREE.MeshStandardMaterial({ color: '#e3e8ed', metalness: 1, roughness: 0.2, side: double }),
      filler: new THREE.MeshStandardMaterial({ color: '#0c1117', roughness: 0.9 }),
      insulation: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.3 }),
      copper: new THREE.MeshStandardMaterial({ color: '#c97f4c', metalness: 1, roughness: 0.28 }),
    }
  }, [braid, matcap])
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats])
  return mats
}

/** The stripped end, built along +z from the jacket's cut face at z = 0. */
function StrippedEnd({ cut, matcap }: { cut: THREE.Material; matcap?: THREE.Texture }) {
  const braid = useBraidTexture()
  const m = useEndMaterials(braid, matcap)
  const wiring = useWireGeometry()
  return (
    <group>
      {/* Cut face of the silicone jacket: matte, slightly lighter than the moulded surface */}
      <mesh material={cut}>
        <ringGeometry args={[JACKET_IN, R, 64]} />
      </mesh>
      {/* Woven braid, exposed for a short step */}
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={m.braid}>
        <cylinderGeometry args={[BRAID_R, BRAID_R, 0.44, 64, 1, true]} />
      </mesh>
      <mesh position={[0, 0, 0.24]} material={m.foilEdge}>
        <ringGeometry args={[FOIL_R, BRAID_R + 0.004, 64]} />
      </mesh>
      {/* Aluminium foil wrap */}
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]} material={m.foil}>
        <cylinderGeometry args={[FOIL_R, FOIL_R, 0.5, 64, 1, true]} />
      </mesh>
      {/* Dark filler behind the wires, so the open foil never shows daylight */}
      <mesh position={[0, 0, 0.34]} material={m.filler}>
        <circleGeometry args={[FOIL_R * 0.98, 48]} />
      </mesh>
      {/* The four insulated wires and their bare copper strands */}
      <mesh geometry={wiring.insulation} material={m.insulation} />
      <mesh geometry={wiring.copper} material={m.copper} />
    </group>
  )
}

// ── Flexing ──────────────────────────────────────────────────────────────
//
// One slow, gentle bend drifting up the cable: zero at the far end (held,
// off-screen) and growing towards the free, stripped end, with long periods
// (around seven seconds) so it reads as a calm sway, never a wiggle. Each ring
// of the jacket moves with the bend and turns to follow it, so the surface and
// its lighting stay smooth. flexOffset() below must match the GLSL version
// exactly: the stripped end is placed with it on the CPU.

const FLEX_GLSL = /* glsl */ `
uniform float uFlexTime;
uniform float uFlexAmp;
uniform float uFlexLength;
attribute float aS;
attribute vec3 aCenter;
attribute vec3 aTangent;
vec3 flexOffset(float s) {
  float w = s * s * uFlexAmp;
  float t = uFlexTime;
  return w * vec3(
    sin(t * 0.9 - s * 1.6) * 0.32,
    sin(t * 0.7 - s * 1.2) * 0.06,
    cos(t * 0.8 - s * 1.4) * 0.2
  );
}
// The rotation that turns unit vector a onto unit vector b.
mat3 rotateOnto(vec3 a, vec3 b) {
  vec3 v = cross(a, b);
  float c = dot(a, b);
  float k = 1.0 / (1.0 + c);
  return mat3(
    c + v.x * v.x * k, v.z + v.x * v.y * k, -v.y + v.x * v.z * k,
    -v.z + v.x * v.y * k, c + v.y * v.y * k, v.x + v.y * v.z * k,
    v.y + v.x * v.z * k, -v.x + v.y * v.z * k, c + v.z * v.z * k
  );
}
`

function flexOffset(s: number, time: number, amp: number, out: THREE.Vector3) {
  const w = s * s * amp
  return out.set(
    w * Math.sin(time * 0.9 - s * 1.6) * 0.32,
    w * Math.sin(time * 0.7 - s * 1.2) * 0.06,
    w * Math.cos(time * 0.8 - s * 1.4) * 0.2,
  )
}

const heroCurve = new THREE.CatmullRomCurve3(cablePaths.hero, false, 'centripetal')
const flexScratch = new THREE.Vector3()

/**
 * Centre of the home-hero jacket at `t` (0 is the lower end, 1 is the cut),
 * in the cable's own space, including the live flex when the cable is moving.
 */
export function heroJacketCentre(t: number, motion: { time: number; amp: number } | undefined, point: THREE.Vector3, tangent: THREE.Vector3) {
  heroCurve.getPointAt(t, point)
  heroCurve.getTangentAt(t, tangent).normalize()
  if (motion && motion.amp > 0) point.add(flexOffset(t, motion.time, motion.amp, flexScratch))
}

type FlexUniforms = { uFlexTime: { value: number }; uFlexAmp: { value: number }; uFlexLength: { value: number } }

/** Teaches a material (standard, physical or baked studio) to bend with the flex uniforms. */
function flexify<M extends THREE.Material>(mat: M, uniforms: FlexUniforms) {
  const before = mat.onBeforeCompile
  const key = mat.customProgramCacheKey()
  mat.onBeforeCompile = (shader, renderer) => {
    before.call(mat, shader, renderer)
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${FLEX_GLSL}`)
      .replace(
        '#include <beginnormal_vertex>',
        `#include <beginnormal_vertex>
        vec3 flexBend = (flexOffset(aS + 0.01) - flexOffset(aS - 0.01)) / 0.02;
        mat3 flexR = rotateOnto(aTangent, normalize(aTangent * uFlexLength + flexBend));
        objectNormal = flexR * objectNormal;`,
      )
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed = aCenter + flexOffset(aS) + flexR * (position - aCenter);')
  }
  mat.customProgramCacheKey = () => `${key}|cable-flex`
  return mat
}

/** Per-vertex position along the cable, ring centre and direction, for the flex shader. */
function addFlexAttributes(geo: THREE.TubeGeometry, curve: THREE.Curve<THREE.Vector3>) {
  const { tubularSegments: rings, radialSegments: around } = geo.parameters
  const count = geo.attributes.position.count
  const s = new Float32Array(count)
  const centre = new Float32Array(count * 3)
  const tangent = new Float32Array(count * 3)
  const p = new THREE.Vector3()
  const t = new THREE.Vector3()
  for (let i = 0; i <= rings; i++) {
    const u = i / rings
    curve.getPointAt(u, p)
    curve.getTangentAt(u, t)
    for (let j = 0; j <= around; j++) {
      const k = i * (around + 1) + j
      s[k] = u
      p.toArray(centre, k * 3)
      t.toArray(tangent, k * 3)
    }
  }
  geo.setAttribute('aS', new THREE.BufferAttribute(s, 1))
  geo.setAttribute('aCenter', new THREE.BufferAttribute(centre, 3))
  geo.setAttribute('aTangent', new THREE.BufferAttribute(tangent, 3))
}

/** How strongly the cable is flexing (0 = at rest), the wave's clock, and the twist of the stripped end in radians. */
export type CableMotion = { amp: number; time: number; twist: number }

/** How much detail the live cable draws: `low` is for devices without a graphics card. */
export type CableQuality = 'high' | 'mid' | 'low'

// Rings along the cable, segments around the jacket and its inner wall, and the
// jacket's satin sheen and clearcoat. `low` skips those last two: it is drawn
// with the baked studio (see studioMatcap), or with the plainer standard
// surface if that image can't be fetched.
const DETAIL: Record<CableQuality, { rings: number; around: number; innerAround: number; sheen: number; clearcoat: number }> = {
  high: { rings: 320, around: 72, innerAround: 48, sheen: 0.55, clearcoat: 0.3 },
  mid: { rings: 220, around: 48, innerAround: 32, sheen: 0.55, clearcoat: 0 },
  low: { rings: 140, around: 32, innerAround: 24, sheen: 0, clearcoat: 0 },
}

function buildCable(points: THREE.Vector3[], colour: CableColour, quality: CableQuality, matcap?: THREE.Texture) {
  const d = DETAIL[quality]
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
  const jacket = new THREE.TubeGeometry(curve, d.rings, R, d.around, false)
  const inner = new THREE.TubeGeometry(curve, d.rings, JACKET_IN, d.innerAround, false)
  addFlexAttributes(jacket, curve)
  addFlexAttributes(inner, curve)
  const uniforms: FlexUniforms = { uFlexTime: { value: 0 }, uFlexAmp: { value: 0 }, uFlexLength: { value: curve.getLength() } }
  const materials = matcap
    ? {
        // One-sided, like the lit versions below: the jacket is the largest surface.
        jacket: flexify(studioMaterial(matcap, { color: colour.jacket, side: THREE.FrontSide }), uniforms),
        inner: flexify(studioMaterial(matcap, { color: colour.inner, gloss: 0.3, side: THREE.BackSide }), uniforms),
        cut: studioMaterial(matcap, { color: colour.cut, gloss: 0.3 }),
      }
    : {
        jacket: flexify(
          quality === 'low'
            ? new THREE.MeshStandardMaterial({ color: colour.jacket, roughness: 0.42 })
            : new THREE.MeshPhysicalMaterial({ color: colour.jacket, roughness: 0.42, sheen: d.sheen, sheenRoughness: 0.55, sheenColor: colour.sheen, clearcoat: d.clearcoat, clearcoatRoughness: 0.4 }),
          uniforms,
        ),
        inner: flexify(new THREE.MeshStandardMaterial({ color: colour.inner, roughness: 0.8, side: THREE.BackSide }), uniforms),
        cut: new THREE.MeshStandardMaterial({ color: colour.cut, roughness: 0.75, side: THREE.DoubleSide }),
      }
  const end = curve.getPointAt(1)
  const endTangent = curve.getTangentAt(1)
  return {
    jacket,
    inner,
    materials,
    end,
    endTangent,
    endQuat: new THREE.Quaternion().setFromUnitVectors(v(0, 0, 1), endTangent),
    length: uniforms.uFlexLength.value,
    /** Sets the shader's flex state for the next frame. */
    setFlex(time: number, amp: number) {
      uniforms.uFlexTime.value = time
      uniforms.uFlexAmp.value = amp
    },
    dispose() {
      jacket.dispose()
      inner.dispose()
      Object.values(materials).forEach((m) => m.dispose())
    },
  }
}

const scratch = { a: new THREE.Vector3(), b: new THREE.Vector3(), t: new THREE.Vector3(), q: new THREE.Quaternion(), twist: new THREE.Quaternion() }
const Z = v(0, 0, 1)

/**
 * Silicone-jacketed data cable with a stepped, stripped end. `colour` changes
 * blend in smoothly; `motion` (live hero only) makes it flex and twist.
 * `quality` sets its detail and surfaces, fixed once built; `matcap` (the
 * baked studio, see studioMatcap) lights it without lights or reflections,
 * for devices drawing without a graphics card.
 */
export function HeroCableModel({
  path = 'hero',
  colour = cableColours[0],
  motion,
  quality = 'high',
  matcap,
}: {
  path?: keyof typeof cablePaths
  colour?: CableColour
  motion?: RefObject<CableMotion>
  quality?: CableQuality
  matcap?: THREE.Texture
}) {
  const [cable] = useState(() => buildCable(cablePaths[path], colour, quality, matcap))
  useEffect(() => () => cable.dispose(), [cable])
  const endRef = useRef<THREE.Group>(null)

  const target = useMemo(
    () => ({ jacket: new THREE.Color(colour.jacket), sheen: new THREE.Color(colour.sheen), inner: new THREE.Color(colour.inner), cut: new THREE.Color(colour.cut) }),
    [colour],
  )

  useFrame((state, delta) => {
    const m = cable.materials
    // Blend towards the chosen colour: a soft cross-fade of about a second, on the
    // real clock (not the capped motion step) so it keeps its pace if frames drop.
    const k = 1 - Math.exp(-Math.min(delta, 0.1) * 3.5)
    let blending = false
    const pairs: Array<[THREE.Color, THREE.Color]> = [
      [m.jacket.color, target.jacket],
      [m.inner.color, target.inner],
      [m.cut.color, target.cut],
    ]
    if (m.jacket instanceof THREE.MeshPhysicalMaterial) pairs.push([m.jacket.sheenColor, target.sheen])
    for (const [c, t] of pairs) {
      if (Math.abs(c.r - t.r) + Math.abs(c.g - t.g) + Math.abs(c.b - t.b) < 0.002) c.copy(t)
      else {
        c.lerp(t, k)
        blending = true
      }
    }
    if (blending) state.invalidate()

    // Flex: the jacket bends in the shader; the stripped end follows on the CPU.
    const mo = motion?.current
    const g = endRef.current
    if (!mo || !g) return
    cable.setFlex(mo.time, mo.amp)
    const { a, b, t, q, twist } = scratch
    flexOffset(1, mo.time, mo.amp, a)
    g.position.copy(cable.end).add(a)
    flexOffset(1.01, mo.time, mo.amp, b)
    flexOffset(0.99, mo.time, mo.amp, t)
    t.subVectors(b, t).divideScalar(0.02).addScaledVector(cable.endTangent, cable.length).normalize()
    q.setFromUnitVectors(cable.endTangent, t)
    twist.setFromAxisAngle(Z, mo.twist)
    g.quaternion.copy(q).multiply(cable.endQuat).multiply(twist)
  })

  return (
    <group>
      <mesh geometry={cable.jacket} material={cable.materials.jacket} />
      <mesh geometry={cable.inner} material={cable.materials.inner} />
      <group ref={endRef} position={cable.end} quaternion={cable.endQuat}>
        <StrippedEnd cut={cable.materials.cut} matcap={matcap} />
      </group>
    </group>
  )
}

/**
 * An invisible, simplified, slightly fatter copy of the cable (running on past
 * the stripped end) for pointer hit-testing, which is far cheaper than testing
 * the detailed jacket.
 */
export function CableHitArea({ path = 'hero', ...events }: { path?: keyof typeof cablePaths } & Omit<ThreeElements['mesh'], 'geometry'>) {
  const geometry = useMemo(() => {
    const pts = cablePaths[path]
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
    const tip = curve.getPointAt(1).addScaledVector(curve.getTangentAt(1), 0.9)
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([...pts, tip], false, 'centripetal'), 48, R * 1.9, 8, false)
  }, [path])
  useEffect(() => () => geometry.dispose(), [geometry])
  // Hidden, so it is never drawn: pointer hit-testing still finds it.
  return <mesh geometry={geometry} visible={false} {...events} />
}

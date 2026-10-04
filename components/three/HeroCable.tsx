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
import { cableColours, type CableColour } from './cableColours'

const R = 0.3 // jacket outer radius
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

/** One insulated wire leaving the foil and splaying slightly, ending in bare copper strands. */
function Wire({ at: [x, y], color }: { at: readonly [number, number]; color: string }) {
  const { tube, end, quat, strands } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([v(x, y, 0.05), v(x, y, 0.46), v(x * 1.3, y * 1.3, 0.66), v(x * 1.65, y * 1.65, 0.86)])
    const end = curve.getPoint(1)
    const quat = new THREE.Quaternion().setFromUnitVectors(v(0, 0, 1), curve.getTangent(1).normalize())
    const strands = [[0, 0], ...Array.from({ length: 6 }, (_, k) => [Math.cos((k * Math.PI) / 3) * 0.042, Math.sin((k * Math.PI) / 3) * 0.042])]
    return { tube: new THREE.TubeGeometry(curve, 48, 0.066, 28, false), end, quat, strands }
  }, [x, y])
  useEffect(() => () => tube.dispose(), [tube])
  return (
    <group>
      <mesh geometry={tube}>
        <meshPhysicalMaterial color={color} roughness={0.38} clearcoat={0.35} clearcoatRoughness={0.3} />
      </mesh>
      <group position={end} quaternion={quat}>
        <mesh>
          <circleGeometry args={[0.066, 28]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {strands.map(([sx, sy], k) => (
          <mesh key={k} position={[sx, sy, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.019, 0.019, 0.17, 12]} />
            <meshStandardMaterial color="#c97f4c" metalness={1} roughness={0.28} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** The stripped end, built along +z from the jacket's cut face at z = 0. */
function StrippedEnd({ cut }: { cut: THREE.Material }) {
  const braid = useBraidTexture()
  return (
    <group>
      {/* Cut face of the silicone jacket: matte, slightly lighter than the moulded surface */}
      <mesh material={cut}>
        <ringGeometry args={[JACKET_IN, R, 64]} />
      </mesh>
      {/* Woven braid, exposed for a short step */}
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[BRAID_R, BRAID_R, 0.44, 64, 1, true]} />
        <meshStandardMaterial map={braid} color="#f2f5f8" metalness={0.6} roughness={0.32} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.24]}>
        <ringGeometry args={[FOIL_R, BRAID_R + 0.004, 64]} />
        <meshStandardMaterial color="#8d969f" metalness={0.9} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Aluminium foil wrap */}
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[FOIL_R, FOIL_R, 0.5, 64, 1, true]} />
        <meshStandardMaterial color="#e3e8ed" metalness={1} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Dark filler behind the wires, so the open foil never shows daylight */}
      <mesh position={[0, 0, 0.34]}>
        <circleGeometry args={[FOIL_R * 0.98, 48]} />
        <meshStandardMaterial color="#0c1117" roughness={0.9} />
      </mesh>
      {wires.map((w) => (
        <Wire key={w.color} at={w.at} color={w.color} />
      ))}
    </group>
  )
}

// ── Flexing ──────────────────────────────────────────────────────────────
//
// The bend is a sum of waves running up the cable, zero at the far end (held,
// off-screen) and growing towards the free, stripped end. Each ring of the
// jacket moves with the wave and turns to follow the bent cable, so the
// surface and its lighting stay smooth. flexOffset() below must match the
// GLSL version exactly: the stripped end is placed with it on the CPU.

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
    sin(s * 3.2 - t * 2.6) * 0.34 + sin(s * 6.1 - t * 3.9) * 0.08,
    sin(s * 2.1 - t * 2.2) * 0.06,
    cos(s * 2.4 - t * 2.0) * 0.24
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
    w * (Math.sin(s * 3.2 - time * 2.6) * 0.34 + Math.sin(s * 6.1 - time * 3.9) * 0.08),
    w * Math.sin(s * 2.1 - time * 2.2) * 0.06,
    w * Math.cos(s * 2.4 - time * 2.0) * 0.24,
  )
}

type FlexUniforms = { uFlexTime: { value: number }; uFlexAmp: { value: number }; uFlexLength: { value: number } }

/** Teaches a standard material to bend with the flex uniforms. */
function flexify<M extends THREE.Material>(mat: M, uniforms: FlexUniforms) {
  mat.onBeforeCompile = (shader) => {
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
  mat.customProgramCacheKey = () => 'cable-flex'
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

function buildCable(points: THREE.Vector3[], colour: CableColour) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
  const jacket = new THREE.TubeGeometry(curve, 320, R, 72, false)
  const inner = new THREE.TubeGeometry(curve, 320, JACKET_IN, 48, false)
  addFlexAttributes(jacket, curve)
  addFlexAttributes(inner, curve)
  const uniforms: FlexUniforms = { uFlexTime: { value: 0 }, uFlexAmp: { value: 0 }, uFlexLength: { value: curve.getLength() } }
  const materials = {
    jacket: flexify(
      new THREE.MeshPhysicalMaterial({ color: colour.jacket, roughness: 0.42, sheen: 0.55, sheenRoughness: 0.55, sheenColor: colour.sheen, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
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
 */
export function HeroCableModel({ path = 'hero', colour = cableColours[0], motion }: { path?: keyof typeof cablePaths; colour?: CableColour; motion?: RefObject<CableMotion> }) {
  const [cable] = useState(() => buildCable(cablePaths[path], colour))
  useEffect(() => () => cable.dispose(), [cable])
  const endRef = useRef<THREE.Group>(null)

  const target = useMemo(
    () => ({ jacket: new THREE.Color(colour.jacket), sheen: new THREE.Color(colour.sheen), inner: new THREE.Color(colour.inner), cut: new THREE.Color(colour.cut) }),
    [colour],
  )

  useFrame((state, delta) => {
    const m = cable.materials
    // Blend towards the chosen colour.
    const k = 1 - Math.exp(-Math.min(delta, 1 / 30) * 8)
    let blending = false
    for (const [c, t] of [
      [m.jacket.color, target.jacket],
      [m.jacket.sheenColor, target.sheen],
      [m.inner.color, target.inner],
      [m.cut.color, target.cut],
    ] as const) {
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
        <StrippedEnd cut={cable.materials.cut} />
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
  return (
    <mesh geometry={geometry} {...events}>
      <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
    </mesh>
  )
}

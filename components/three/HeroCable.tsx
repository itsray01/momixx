'use client'

// A silicone data cable with its end stripped back in steps, the way a cable
// engineer would show it: satin silicone jacket, woven metal braid, foil wrap,
// four colour-coded wires and bare stranded copper. Used live in the home hero
// and pre-rendered (scripts/render-models.mjs) for the hero still and cards.

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

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
function StrippedEnd() {
  const braid = useBraidTexture()
  return (
    <group>
      {/* Cut face of the silicone jacket: matte, slightly lighter than the moulded surface */}
      <mesh>
        <ringGeometry args={[JACKET_IN, R, 64]} />
        <meshStandardMaterial color="#1f9d91" roughness={0.75} side={THREE.DoubleSide} />
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

/** Silicone-jacketed data cable with a stepped, stripped end. */
export function HeroCableModel({ path = 'hero' }: { path?: keyof typeof cablePaths }) {
  const { jacket, inner, end, quat } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(cablePaths[path], false, 'centripetal')
    return {
      jacket: new THREE.TubeGeometry(curve, 320, R, 72, false),
      inner: new THREE.TubeGeometry(curve, 320, JACKET_IN, 48, false),
      end: curve.getPoint(1),
      quat: new THREE.Quaternion().setFromUnitVectors(v(0, 0, 1), curve.getTangent(1).normalize()),
    }
  }, [path])
  useEffect(
    () => () => {
      jacket.dispose()
      inner.dispose()
    },
    [jacket, inner],
  )
  return (
    <group>
      <mesh geometry={jacket}>
        <meshPhysicalMaterial color="#0f8378" roughness={0.42} sheen={0.55} sheenRoughness={0.55} sheenColor="#7fd9cf" clearcoat={0.3} clearcoatRoughness={0.4} />
      </mesh>
      <mesh geometry={inner}>
        <meshStandardMaterial color="#0b3f3b" roughness={0.8} side={THREE.BackSide} />
      </mesh>
      <group position={end} quaternion={quat}>
        <StrippedEnd />
      </group>
    </group>
  )
}

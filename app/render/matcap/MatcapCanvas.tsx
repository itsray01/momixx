'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Studio } from '@/components/three/Studio'
import { MATCAP_SCALE } from '@/components/three/studioMatcap'

export type MatcapKind = 'diffuse' | 'specular' | 'metal'

function DoneAfter({ frames }: { frames: number }) {
  const n = useRef(0)
  useFrame(() => {
    n.current += 1
    if (n.current === frames) window.__renderReady = true
  })
  return null
}

const grey = (x: number) => new THREE.Color().setRGB(x, x, x, THREE.LinearSRGBColorSpace)

/**
 * One lighting component of the hero's studio, on a sphere seen straight on:
 * the light a matte surface receives, the reflection a glossy dielectric adds,
 * or what a polished metal reflects. Each is scaled down by MATCAP_SCALE so
 * its brightest point still fits the image; studioMaterial scales it back up.
 * Drawn without tone mapping, so the lite surfaces can apply it themselves.
 */
export function MatcapCanvas({ kind }: { kind: MatcapKind }) {
  const material = useMemo(() => {
    const s = 1 / MATCAP_SCALE[kind]
    if (kind === 'diffuse') return new THREE.MeshPhysicalMaterial({ color: grey(s), roughness: 0.42, specularIntensity: 0 })
    if (kind === 'specular') return new THREE.MeshPhysicalMaterial({ color: grey(0), roughness: 0.42, specularIntensity: s })
    return new THREE.MeshStandardMaterial({ color: grey(s), metalness: 1, roughness: 0.3 })
  }, [kind])
  // A sphere that just fills a narrow (nearly orthographic) view.
  const distance = 10
  const fov = 8
  const radius = distance * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * 0.995
  return (
    <div id="stage" style={{ width: 256, height: 256 }}>
      <Canvas
        dpr={2}
        flat
        camera={{ position: [0, 0, distance], fov }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 1)}
      >
        <Studio resolution={512} rim="#ffffff" />
        <mesh material={material}>
          <sphereGeometry args={[radius, 160, 160]} />
        </mesh>
        <DoneAfter frames={10} />
      </Canvas>
    </div>
  )
}

'use client'

// Shared lighting for every live scene and pre-rendered image. Kept apart from
// the model library so a page's 3D bundle only carries the model it shows.

import { Environment, Lightformer } from '@react-three/drei'

export const SILICONE = '#e6e7e9'
export const GRAPHITE = '#3a3d42'
export const HIGHLIGHT = '#f4f5f6'

/**
 * Studio lighting with glossy reflections, generated locally (no HDR downloads):
 * a large overhead softbox, white strip lights for crisp edge highlights, a white
 * rim from behind and a soft floor bounce. `rim` swaps that rim for another
 * colour (the hero cable uses white, so every cable colour reads true).
 * `lite` keeps only the key and rim lights (plus the reflections), for devices
 * drawing without a graphics card: each light costs time on every pixel.
 */
export function Studio({ resolution = 256, rim = '#ffffff', lite = false }: { resolution?: number; rim?: string; lite?: boolean }) {
  return (
    <>
      <ambientLight intensity={lite ? 0.35 : 0.22} />
      <hemisphereLight args={['#f4f5f6', '#0b0b0c', lite ? 0.6 : 0.45]} />
      <directionalLight position={[4, 7, 6]} intensity={2.3} />
      <directionalLight position={[-6, 3, -5]} intensity={1.5} color={rim} />
      {!lite && <directionalLight position={[6, 2, -6]} intensity={0.9} />}
      {!lite && <directionalLight position={[0, -4, 3]} intensity={0.3} />}
      <Environment resolution={resolution} frames={1}>
        <Lightformer form="rect" intensity={3.4} position={[0, 7, 2]} rotation-x={Math.PI / 2} scale={[14, 6, 1]} />
        <Lightformer form="rect" intensity={2.6} position={[8, 1.5, 2]} rotation-y={-Math.PI / 2} scale={[1.2, 9, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-8, 1, 3]} rotation-y={Math.PI / 2} scale={[1.2, 7, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, 2, 9]} scale={[10, 3, 1]} />
        <Lightformer form="ring" intensity={3} color={rim} position={[-5, 2.5, -4]} scale={3.5} />
        <Lightformer form="rect" intensity={1.4} color={rim} position={[4, 3, -7]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={0.5} position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[14, 14, 1]} />
      </Environment>
    </>
  )
}

'use client'

// Live 3D for the cable anatomy infographic. Loaded lazily by <CableAnatomy>.

import { ContactShadows } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { CableAnatomyModel } from './CableAnatomy'
import { anatomyView, cableLayers, layerAnchors } from './cableLayers'
import { Ready } from './Ready'
import { Studio } from './Studio'

function Markers({ markers, shown }: { markers: RefObject<Array<HTMLElement | null>>; shown: RefObject<number> }) {
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, size }) => {
    const anchors = layerAnchors(shown.current)
    cableLayers.forEach((l, i) => {
      const el = markers.current[i]
      if (!el) return
      v.set(...anchors[l.id]).project(camera)
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -50%)`
      el.style.visibility = 'visible'
    })
  })
  return null
}

/** Points the camera at the cable and lets it drift gently with the pointer. */
function Rig() {
  const target = useMemo(() => new THREE.Vector3(...anatomyView.target), [])
  const base = useMemo(() => new THREE.Vector3(...anatomyView.position), [])
  useFrame(({ camera, pointer }, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, base.x + pointer.x * 0.5, 3, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, base.y + pointer.y * 0.3, 3, delta)
    camera.lookAt(target)
  })
  return null
}

export default function CableAnatomyCanvas({
  explode,
  highlight,
  markers,
  animate,
  onReady,
}: {
  explode: RefObject<number>
  highlight: string | null
  markers: RefObject<Array<HTMLElement | null>>
  animate: boolean
  onReady: () => void
}) {
  const shown = useRef(explode.current)
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: anatomyView.position, fov: anatomyView.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => camera.lookAt(...anatomyView.target)}
    >
      <Studio />
      <Rig />
      <CableAnatomyModel explodeRef={explode} shownRef={shown} highlight={highlight} />
      <ContactShadows position={[0, -1.25, 0]} opacity={0.5} scale={10} blur={2.6} far={3} resolution={512} />
      <Markers markers={markers} shown={shown} />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

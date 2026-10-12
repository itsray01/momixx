'use client'

// Live 3D for the charging scene. Loaded lazily by <CableCharging>.

import { ContactShadows } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { CableChargingModel, type ChargingStill } from './CableCharging'
import { chargingAspect, chargingFov, chargingView, chargingWindow, narrowCrop } from './chargingView'
import { Ready } from './Ready'
import { Studio } from './Studio'

/**
 * Frames exactly what the still shows (the wide frame, or its narrower slice on
 * phones and tablets) whatever the stage's shape, drifting gently with the pointer.
 */
function Rig() {
  const target = useMemo(() => new THREE.Vector3(...chargingView.target), [])
  const base = useMemo(() => new THREE.Vector3(...chargingView.position), [])
  const framed = useRef('')
  useFrame(({ camera, pointer, size }, delta) => {
    const cam = camera as THREE.PerspectiveCamera
    const wide = window.innerWidth >= 1024
    const key = `${size.width}x${size.height}:${wide}`
    if (framed.current !== key) {
      framed.current = key
      const { from, to } = wide ? { from: 0, to: 1 } : narrowCrop
      const aspect = size.width / size.height
      const w = chargingWindow(aspect, from, to)
      cam.fov = chargingFov(chargingAspect)
      // setViewOffset takes the full frame's aspect from its first two numbers, so the full frame is aspect × 1.
      cam.setViewOffset(aspect, 1, w.x * aspect, w.y, w.size * aspect, w.size)
    }
    cam.position.x = THREE.MathUtils.damp(cam.position.x, base.x + pointer.x * 0.6, 3, delta)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, base.y + pointer.y * 0.35, 3, delta)
    cam.lookAt(target)
  })
  return null
}

export default function CableChargingCanvas({
  plug,
  charging,
  still,
  animate,
  onReady,
}: {
  plug: RefObject<number>
  charging: RefObject<boolean>
  /** Reduced motion: one fixed moment, no movement. */
  still?: ChargingStill
  animate: boolean
  onReady: () => void
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: chargingView.position, fov: chargingFov(chargingAspect) }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => camera.lookAt(...chargingView.target)}
    >
      <Studio />
      <Rig />
      <CableChargingModel plugRef={plug} chargingRef={charging} still={still} />
      <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={30} blur={2.2} far={2} resolution={1024} />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

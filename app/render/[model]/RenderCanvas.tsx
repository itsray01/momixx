'use client'

import { ContactShadows } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { renderViews } from '@/components/three/renderViews'
import { modelRegistry, Studio } from '@/components/three/models'
import type { ModelName } from '@/components/three/modelNames'

declare global {
  interface Window {
    __renderReady?: boolean
  }
}

/** Every mesh in the model casts a shadow onto the studio floor. */
function CastShadows({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useLayoutEffect(() => {
    ref.current?.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true
    })
  })
  return <group ref={ref}>{children}</group>
}

/** Signals the render script once the soft shadows have finished accumulating. */
function DoneAfter({ frames }: { frames: number }) {
  const n = useRef(0)
  useFrame(() => {
    n.current += 1
    if (n.current === frames) window.__renderReady = true
  })
  return null
}

// Fixed 4:3 studio shot of one model on a transparent background.
export function RenderCanvas({ name }: { name: ModelName }) {
  const Model = modelRegistry[name]
  // Interactive models are framed exactly like their live view, so markers line up.
  const view = renderViews[name] ?? { position: [0, 0.9, 10] as [number, number, number], target: [0, 0, 0] as [number, number, number], fov: 30, floor: -2.1 }
  const line = name === 'extruder-line'
  return (
    <div id="stage" style={{ width: 1200, height: 900, background: 'transparent' }}>
      <Canvas
        dpr={2}
        camera={{ position: view.position, fov: view.fov }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onCreated={({ gl, camera }) => {
          camera.lookAt(...view.target)
          gl.setClearColor(0x000000, 0)
        }}
      >
        <Studio resolution={512} />
        <CastShadows>
          <Model />
        </CastShadows>
        {line ? (
          <ContactShadows position={[0.35, 0.001, -0.35]} opacity={0.55} scale={14} blur={2.4} far={4} resolution={1024} />
        ) : (
          <ContactShadows position={[0, view.floor, 0]} opacity={0.5} scale={12} blur={2.8} far={4.5} resolution={1024} />
        )}
        <DoneAfter frames={30} />
      </Canvas>
    </div>
  )
}

'use client'

import { ContactShadows } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { extruderOverview } from '@/components/three/extruderParts'
import { modelRegistry, Studio } from '@/components/three/models'
import type { ModelName } from '@/components/three/modelNames'

declare global {
  interface Window {
    __renderReady?: boolean
  }
}

// Fixed 4:3 studio shot of one model on a transparent background.
export function RenderCanvas({ name }: { name: ModelName }) {
  const Model = modelRegistry[name]
  // The extrusion line is framed exactly like the interactive explorer's overview.
  const line = name === 'extruder-line'
  const view = line ? extruderOverview : { position: [0, 0.9, 10] as [number, number, number], target: [0, 0, 0] as [number, number, number], fov: 30 }
  return (
    <div id="stage" style={{ width: 1200, height: 900, background: 'transparent' }}>
      <Canvas
        dpr={2}
        camera={{ position: view.position, fov: view.fov }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onCreated={({ gl, camera }) => {
          camera.lookAt(...view.target)
          gl.setClearColor(0x000000, 0)
          setTimeout(() => (window.__renderReady = true), 1500)
        }}
      >
        <Studio />
        <Model />
        {line ? (
          <ContactShadows position={[0.35, 0.001, -0.35]} opacity={0.55} scale={14} blur={2.4} far={4} resolution={1024} />
        ) : (
          <ContactShadows position={[0, -2.1, 0]} opacity={0.45} scale={12} blur={2.6} far={4.5} resolution={512} />
        )}
      </Canvas>
    </div>
  )
}

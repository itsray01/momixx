'use client'

import { ContactShadows } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
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
  return (
    <div id="stage" style={{ width: 1200, height: 900, background: 'transparent' }}>
      <Canvas
        dpr={2}
        camera={{ position: [0, 0.9, 10], fov: 30 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          setTimeout(() => (window.__renderReady = true), 1500)
        }}
      >
        <Studio />
        <Model />
        <ContactShadows position={[0, -2.1, 0]} opacity={0.45} scale={12} blur={2.6} far={4.5} resolution={512} />
      </Canvas>
    </div>
  )
}

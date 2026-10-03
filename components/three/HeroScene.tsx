'use client'

// The live 3D cable in the home hero. Loaded lazily by <Scene3D>, only on
// desktop screens with a GPU, once the page has loaded.

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { HeroCableModel } from './HeroCable'
import { heroCamera, heroProgress } from './heroProgress'
import { Ready } from './Ready'
import { Studio } from './Studio'

/** Turns the cut end towards you as the page scrolls, and drifts gently with the pointer. */
function LiveCable() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const p = heroProgress.value
    const t = state.clock.elapsedTime
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, 0.5 * p + state.pointer.x * 0.12 + Math.sin(t * 0.3) * 0.04, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.22 * p - state.pointer.y * 0.08, 3, delta)
    g.position.z = THREE.MathUtils.damp(g.position.z, 0.9 * p, 3, delta)
  })
  return (
    <group ref={ref}>
      <HeroCableModel />
    </group>
  )
}

export default function HeroScene({ animate, onReady }: { animate: boolean; onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: heroCamera.position, fov: heroCamera.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      // Track the pointer across the whole page, so the canvas never blocks clicks.
      eventSource={document.body}
      eventPrefix="client"
    >
      <Studio />
      <fog attach="fog" args={['#05070a', 9, 16]} />
      <LiveCable />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

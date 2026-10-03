'use client'

// The live 3D cable in the home hero. Loaded lazily by <Scene3D>, only on
// desktop screens with a GPU, once the page has loaded.

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { HeroCableModel } from './HeroCable'
import { heroCamera, heroProgress } from './heroProgress'
import { Ready } from './Ready'
import { Studio } from './Studio'

// The cable turns about its own middle rather than the scene's origin, so the
// cut end turns towards you instead of swinging sideways.
const PIVOT: [number, number, number] = [0.45, -0.6, 0.45]
const damp = THREE.MathUtils.damp

/**
 * Turns the cut end towards you as the page scrolls, and leans slightly towards
 * the pointer. Scroll progress arrives raw (unsmoothed) and is eased once here,
 * so the cable follows the scroll closely instead of trailing behind it.
 */
function LiveCable({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const invalidate = useThree((s) => s.invalidate)

  // Draw a frame only when something changes: a scroll, a pointer move, or the ease still settling.
  useEffect(() => {
    if (!animate) return
    const kick = () => invalidate()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('pointermove', kick, { passive: true })
    kick()
    return () => {
      window.removeEventListener('scroll', kick)
      window.removeEventListener('pointermove', kick)
    }
  }, [animate, invalidate])

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const p = heroProgress.value
    // After an idle pause the first delta is long; cap it so the ease never jumps.
    const dt = Math.min(delta, 1 / 30)
    const ry = 0.32 * p + state.pointer.x * 0.08
    const rx = 0.14 * p - state.pointer.y * 0.05
    const z = 0.6 * p
    g.rotation.y = damp(g.rotation.y, ry, 7, dt)
    g.rotation.x = damp(g.rotation.x, rx, 7, dt)
    g.position.z = damp(g.position.z, PIVOT[2] + z, 7, dt)
    const settling = Math.abs(g.rotation.y - ry) + Math.abs(g.rotation.x - rx) + Math.abs(g.position.z - PIVOT[2] - z) > 1e-4
    if (settling && animate) state.invalidate()
  })

  return (
    <group ref={ref} position={PIVOT}>
      <group position={[-PIVOT[0], -PIVOT[1], -PIVOT[2]]}>
        <HeroCableModel />
      </group>
    </group>
  )
}

export default function HeroScene({ animate, onReady }: { animate: boolean; onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="demand"
      camera={{ position: heroCamera.position, fov: heroCamera.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      // Track the pointer across the whole page, so the canvas never blocks clicks.
      eventSource={document.body}
      eventPrefix="client"
    >
      <Studio />
      <fog attach="fog" args={['#05070a', 9, 16]} />
      <LiveCable animate={animate} />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

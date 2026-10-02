'use client'

// Real-time 3D scenes (Three.js via React Three Fiber). Loaded lazily by
// <Scene3D>, only on screens that support WebGL, and only once scrolled near.

import { Float } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { heroProgress } from './heroProgress'
import type { ModelName } from './modelNames'
import { CableModel, GlobeModel, LoopModel, modelRegistry, Studio } from './models'

export type SceneVariant = 'hero' | ModelName

/** Follows the pointer gently and drifts on its own. */
function Rig({ children, strength = 1, spin = 0 }: { children: React.ReactNode; strength?: number; spin?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime
    const targetY = state.pointer.x * 0.35 * strength + Math.sin(t * 0.25) * 0.12 + t * spin
    const targetX = -state.pointer.y * 0.2 * strength + Math.cos(t * 0.2) * 0.05
    g.rotation.y = spin ? targetY : THREE.MathUtils.damp(g.rotation.y, targetY, 2.5, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 2.5, delta)
  })
  return <group ref={ref}>{children}</group>
}

/** Home hero: the cable turns towards you and comes closer as you scroll. */
function HeroCable() {
  const ref = useRef<THREE.Group>(null)
  // On wide screens the canvas spans the hero, so sit the cable to the right of the headline.
  const wide = useThree((s) => s.size.width >= 1024)
  // Size and offset follow the visible width, so narrower desktop windows don't crop the cable end.
  const viewWidth = useThree((s) => s.viewport.width)
  const scale = wide ? 0.9 * Math.min(1, viewWidth / 8.6) : 1
  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const p = heroProgress.value
    const t = state.clock.elapsedTime
    const baseX = wide ? viewWidth * 0.26 : 0
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.75 * p + state.pointer.x * 0.3 + Math.sin(t * 0.25) * 0.1, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.25 * p - state.pointer.y * 0.18, 3, delta)
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX - (wide ? 1.6 : 0.9) * p, 3, delta)
    g.position.z = THREE.MathUtils.damp(g.position.z, 1.6 * p, 3, delta)
  })
  return (
    <group ref={ref} scale={scale}>
      <CableModel />
    </group>
  )
}

/** Recycling ring that slowly turns, so the material appears to flow round it. */
function LiveLoop() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z -= delta * 0.12
  })
  return (
    <group rotation={[0.9, 0, 0.2]}>
      <group ref={ref}>
        <LoopModel tilt={false} />
      </group>
    </group>
  )
}

function Ready({ onReady }: { onReady?: () => void }) {
  const { invalidate } = useThree()
  const fired = useRef(false)
  useFrame(() => {
    if (fired.current) return
    fired.current = true
    requestAnimationFrame(() => onReady?.())
  })
  useLayoutEffect(() => invalidate(), [invalidate])
  return null
}

function camera(variant: SceneVariant) {
  if (variant === 'hero' || variant === 'cable' || variant === 'ev-cable') return { position: [0, 0, 8.5] as [number, number, number], fov: 35 }
  return { position: [0, 0.9, 10] as [number, number, number], fov: 30 }
}

export default function Scene({ variant, animate, onReady }: { variant: SceneVariant; animate: boolean; onReady?: () => void }) {
  const Model = variant !== 'hero' ? modelRegistry[variant] : null
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={animate ? 'always' : 'demand'}
      camera={camera(variant)}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      // Track the pointer across the whole page, so the canvas never blocks clicks.
      eventSource={document.body}
      eventPrefix="client"
    >
      <Studio />
      {(variant === 'hero' || variant === 'cable' || variant === 'ev-cable') && <fog attach="fog" args={['#05070a', 9, 17]} />}
      {variant === 'hero' && <HeroCable />}
      {variant === 'cable' && (
        <Rig>
          <CableModel />
        </Rig>
      )}
      {variant === 'recycle' && (
        <Rig strength={0.5}>
          <LiveLoop />
        </Rig>
      )}
      {variant === 'globe' && (
        <Rig strength={0.35}>
          <GlobeModel spin />
        </Rig>
      )}
      {Model && variant !== 'cable' && variant !== 'recycle' && variant !== 'globe' && (
        <Rig strength={0.8}>
          <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6} floatingRange={[-0.08, 0.08]}>
            <Model />
          </Float>
        </Rig>
      )}
      <Ready onReady={onReady} />
    </Canvas>
  )
}

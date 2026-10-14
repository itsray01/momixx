'use client'

import { ContactShadows } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { defaultView, renderViews } from '@/components/three/renderViews'
import { cableColourById } from '@/components/three/cableColours'
import { modelRegistry } from '@/components/three/models'
import { Studio } from '@/components/three/Studio'
import type { ModelName } from '@/components/three/modelNames'

declare global {
  interface Window {
    __renderReady?: boolean
    /** Turntable (spin mode): the model's yaw in radians, set by the script before each frame. */
    __yaw?: number
    /** Turntable: frames drawn so far, so the script knows a new yaw has been rendered. */
    __frames?: number
  }
}

/** Turntable: turns the model to window.__yaw every frame and counts the frames drawn. */
function Turntable({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (ref.current) ref.current.rotation.y = window.__yaw ?? 0
    window.__frames = (window.__frames ?? 0) + 1
  })
  return <group ref={ref}>{children}</group>
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

// Studio shot of one model on a transparent background (4:3 unless the view says otherwise).
// `colour` (the cables only) picks a colour from cableColours; colour variants are
// lit with a neutral rim, like the live hero, so each colour reads true.
export function RenderCanvas({ name, colour: colourId, spin = false }: { name: ModelName; colour?: string; spin?: boolean }) {
  const Model = modelRegistry[name]
  const colour = cableColourById(colourId)
  // Interactive models are framed exactly like their live view, so markers line up.
  const view = renderViews[name] ?? defaultView
  // Spin mode draws the clip's frames at their final size, one pixel per pixel.
  const [width, height] = spin ? [960, 720] : (view.size ?? [1200, 900])
  const line = name === 'extruder-line'
  return (
    <div id="stage" style={{ width, height, background: 'transparent' }}>
      <Canvas
        dpr={spin ? 1 : 2}
        camera={{ position: view.position, fov: view.fov }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onCreated={({ gl, camera }) => {
          camera.lookAt(...view.target)
          gl.setClearColor(0x000000, 0)
        }}
      >
        <Studio resolution={512} rim={colour ? '#ffffff' : undefined} />
        {view.fog && <fog attach="fog" args={['#fbfbf9', ...view.fog]} />}
        <CastShadows>{spin ? <Turntable><Model colour={colour} /></Turntable> : <Model colour={colour} />}</CastShadows>
        {line ? (
          <ContactShadows position={[0.35, 0.001, -0.35]} opacity={0.55} scale={14} blur={2.4} far={4} resolution={1024} />
        ) : (
          view.floor !== undefined && <ContactShadows position={[0, view.floor, 0]} opacity={0.5} scale={12} blur={2.8} far={4.5} resolution={1024} />
        )}
        <DoneAfter frames={30} />
      </Canvas>
    </div>
  )
}

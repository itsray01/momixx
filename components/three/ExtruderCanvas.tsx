'use client'

// The live, clickable 3D extrusion line. Loaded lazily by <ExtruderExplorer>.

import { CameraControls, ContactShadows } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { ExtruderLineModel } from './ExtruderLine'
import { extruderOverview, extruderParts } from './extruderParts'
import { Studio } from './models'

/** Flies the camera to the selected part, or back to the whole line. Drag to look around. */
function Rig({ selected }: { selected: number | null }) {
  const ref = useRef<CameraControls>(null)
  const aspect = useThree((s) => s.size.width / s.size.height)

  useLayoutEffect(() => {
    const c = ref.current
    if (!c) return
    // Only left-drag rotates: the mouse wheel and touch keep scrolling the page.
    c.mouseButtons.wheel = 0
    c.mouseButtons.middle = 0
    c.mouseButtons.right = 0
    c.touches.one = 0
    c.touches.two = 0
    c.touches.three = 0
    c.minPolarAngle = 0.75
    c.maxPolarAngle = 1.62
    c.smoothTime = 0.6
  }, [])

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const view = selected === null ? extruderOverview : extruderParts[selected].camera
    // Narrow screens see the whole line from further back.
    const k = selected === null ? Math.max(1, 1.33 / aspect) : Math.max(1, 1.1 / aspect)
    const [px, py, pz] = view.position
    const [tx, ty, tz] = view.target
    c.setLookAt(tx + (px - tx) * k, ty + (py - ty) * k, tz + (pz - tz) * k, tx, ty, tz, true)
  }, [selected, aspect])

  return <CameraControls ref={ref} makeDefault />
}

/** Keeps the HTML markers (rendered outside the canvas) pinned to their parts. */
function Markers({ markers }: { markers: RefObject<Array<HTMLElement | null>> }) {
  const anchors = useMemo(() => extruderParts.map((p) => new THREE.Vector3(...p.anchor)), [])
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, size }) => {
    anchors.forEach((a, i) => {
      const el = markers.current[i]
      if (!el) return
      v.copy(a).project(camera)
      const off = v.z > 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -50%)`
      el.style.visibility = off ? 'hidden' : 'visible'
    })
  })
  return null
}

function Ready({ onReady }: { onReady: () => void }) {
  const fired = useRef(false)
  useFrame(() => {
    if (fired.current) return
    fired.current = true
    requestAnimationFrame(onReady)
  })
  return null
}

export default function ExtruderCanvas({
  selected,
  hovered,
  onSelect,
  onHover,
  animate,
  onReady,
  markers,
}: {
  selected: number | null
  hovered: number | null
  onSelect: (i: number) => void
  onHover: (i: number | null) => void
  animate: boolean
  onReady: () => void
  markers: RefObject<Array<HTMLElement | null>>
}) {
  const [x, y, z] = extruderOverview.position
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: [x, y, z * 1.25], fov: extruderOverview.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => onHover(null)}
    >
      <Studio />
      <Rig selected={selected} />
      <ExtruderLineModel selected={selected} hovered={hovered} onSelect={onSelect} onHover={onHover} animate={animate} />
      <ContactShadows position={[0.35, 0.001, -0.35]} opacity={0.55} scale={14} blur={2.4} far={4} resolution={512} />
      <Markers markers={markers} />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

'use client'

// The live 3D extruder you can turn around. Loaded lazily by <ExtruderExplorer>.

import { CameraControls, ContactShadows } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { ExtruderMachineModel } from './ExtruderMachine'
import { extruderParts, machineOverview } from './extruderParts'
import { Studio } from './models'

/** Flies the camera to the selected part, or back to the whole machine. Drag to turn it around. */
function Rig({ selected }: { selected: number | null }) {
  const ref = useRef<CameraControls>(null)
  const aspect = useThree((s) => s.size.width / s.size.height)

  useLayoutEffect(() => {
    const c = ref.current
    if (!c) return
    // Only left-drag turns the machine: the mouse wheel and touch keep scrolling the page.
    c.mouseButtons.wheel = 0
    c.mouseButtons.middle = 0
    c.mouseButtons.right = 0
    c.touches.one = 0
    c.touches.two = 0
    c.touches.three = 0
    c.minPolarAngle = 0.55
    c.maxPolarAngle = 1.62
    c.smoothTime = 0.6
  }, [])

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const view = (selected !== null && extruderParts[selected].machine?.camera) || machineOverview
    // Narrow screens see the machine from further back.
    const k = selected === null ? Math.max(1, 0.95 / aspect) : Math.max(1, 0.8 / aspect)
    const [px, py, pz] = view.position
    const [tx, ty, tz] = view.target
    c.setLookAt(tx + (px - tx) * k, ty + (py - ty) * k, tz + (pz - tz) * k, tx, ty, tz, true)
  }, [selected, aspect])

  return <CameraControls ref={ref} makeDefault />
}

/** Keeps the HTML markers (rendered outside the canvas) on their parts, hidden while a part faces away. */
function Markers({ markers }: { markers: RefObject<Array<HTMLElement | null>> }) {
  const spots = useMemo(
    () => extruderParts.map((p) => p.machine && { anchor: new THREE.Vector3(...p.machine.anchor), normal: new THREE.Vector3(...p.machine.normal).normalize() }),
    [],
  )
  const v = useMemo(() => new THREE.Vector3(), [])
  const toCamera = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, size }) => {
    spots.forEach((spot, i) => {
      const el = markers.current[i]
      if (!el || !spot) return
      const facing = toCamera.subVectors(camera.position, spot.anchor).dot(spot.normal) > 0
      v.copy(spot.anchor).project(camera)
      const off = !facing || v.z > 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05
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

export default function MachineCanvas({
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
  const [x, y, z] = machineOverview.position
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: [x * 1.2, y, z * 1.2], fov: machineOverview.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => onHover(null)}
    >
      <Studio />
      <Rig selected={selected} />
      <ExtruderMachineModel selected={selected} hovered={hovered} onSelect={onSelect} onHover={onHover} animate={animate} />
      <ContactShadows position={[0.05, 0.001, 0.1]} opacity={0.6} scale={4} blur={2.2} far={2.5} resolution={512} />
      <Markers markers={markers} />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

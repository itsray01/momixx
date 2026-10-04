'use client'

// The live 3D cable in the home hero. Loaded lazily by <Scene3D>, only on
// desktop screens with a GPU, once the page has loaded.

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { cableColours, cableColourStore, useCableColour } from './cableColours'
import { CableHitArea, HeroCableModel, type CableMotion } from './HeroCable'
import { heroCamera, heroProgress } from './heroProgress'
import { Ready } from './Ready'
import { Studio } from './Studio'

// The cable turns about its own middle rather than the scene's origin, so the
// cut end turns towards you instead of swinging sideways.
const PIVOT: [number, number, number] = [0.45, -0.6, 0.45]
const damp = THREE.MathUtils.damp
/** Seconds per colour while the pointer rests on the cable. */
const CYCLE = 1.6
/** The scene hears pointer events from the whole page; ignore the cable while the pointer is on a button or link in front of it (the colour swatches). */
const overControl = (e: { nativeEvent: Event }) => e.nativeEvent.target instanceof Element && !!e.nativeEvent.target.closest('a, button, input, select, textarea')

/**
 * Turns the cut end towards you as the page scrolls, and leans slightly towards
 * the pointer. Scroll progress arrives raw (unsmoothed) and is eased once here,
 * so the cable follows the scroll closely instead of trailing behind it.
 *
 * With the pointer on the cable, it comes alive: a wave runs along it, the
 * stripped end twists, and it moves through its colours. A click flicks it and
 * shows the next colour. When the pointer leaves it settles, with a little
 * wobble, like a real cable let go.
 */
function LiveCable({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const invalidate = useThree((s) => s.invalidate)
  const colour = cableColours[useCableColour()]
  const motion = useRef<CableMotion>({ amp: 0, time: 0, twist: 0 })
  const spring = useRef({ velocity: 0, hovered: false, changedAt: 0 })

  const setHovered = (on: boolean) => {
    const sp = spring.current
    if (on === sp.hovered) return
    sp.hovered = on
    // The first new colour arrives a little sooner than the rest.
    if (on) sp.changedAt = performance.now() - CYCLE * 550
    document.body.style.cursor = on ? 'pointer' : ''
    invalidate()
  }

  // Draw a frame only when something changes: a scroll, a pointer move, or motion still settling.
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

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const p = heroProgress.value
    // After an idle pause the first delta is long; cap it so nothing jumps.
    const dt = Math.min(delta, 1 / 30)
    const m = motion.current
    const sp = spring.current
    const alive = sp.hovered && animate

    // Colours change on the real clock, so they keep their pace even when frames drop.
    if (alive && performance.now() - sp.changedAt >= CYCLE * 1000) {
      sp.changedAt = performance.now()
      cableColourStore.next()
    }

    // A soft spring drives the flex, so the cable eases in and settles with a wobble.
    if (animate) {
      sp.velocity += (38 * ((alive ? 1 : 0) - m.amp) - 6.5 * sp.velocity) * dt
      m.amp += sp.velocity * dt
    }
    const moving = Math.abs(m.amp) > 0.0005 || Math.abs(sp.velocity) > 0.0005
    if (moving) m.time += dt
    else m.amp = sp.velocity = 0
    m.twist = Math.sin(m.time * 1.7) * 1.1 * m.amp

    // The pointer is tracked across the whole page; only its position over the cable's column steers the lean.
    const px = THREE.MathUtils.clamp(state.pointer.x, -1, 1)
    const py = THREE.MathUtils.clamp(state.pointer.y, -1, 1)
    const ry = 0.32 * p + px * 0.08 + Math.sin(m.time * 0.8) * 0.1 * m.amp
    const rx = 0.14 * p - py * 0.05
    const z = 0.6 * p + 0.3 * m.amp
    g.rotation.y = damp(g.rotation.y, ry, 7, dt)
    g.rotation.x = damp(g.rotation.x, rx, 7, dt)
    g.position.z = damp(g.position.z, PIVOT[2] + z, 7, dt)
    const settling = Math.abs(g.rotation.y - ry) + Math.abs(g.rotation.x - rx) + Math.abs(g.position.z - PIVOT[2] - z) > 1e-4
    if ((settling || moving || alive) && animate) state.invalidate()
  })

  return (
    <group ref={ref} position={PIVOT}>
      <group position={[-PIVOT[0], -PIVOT[1], -PIVOT[2]]}>
        <HeroCableModel colour={colour} motion={motion} />
        <CableHitArea
          onPointerOver={(e) => setHovered(!overControl(e))}
          onPointerMove={(e) => setHovered(!overControl(e))}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            if (overControl(e)) return
            cableColourStore.next()
            spring.current.changedAt = performance.now()
            if (animate) spring.current.velocity += 5
            invalidate()
          }}
        />
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
      // Track the pointer across the whole page, so the canvas never blocks clicks,
      // measuring it from the canvas (which sits in the right-hand column).
      eventSource={document.body}
      onCreated={(state) =>
        state.setEvents({
          compute: (event, s) => {
            const r = s.gl.domElement.getBoundingClientRect()
            s.pointer.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1)
            s.raycaster.setFromCamera(s.pointer, s.camera)
          },
        })
      }
    >
      {/* A white rim light, so every cable colour reads true. */}
      <Studio rim="#ffffff" />
      <fog attach="fog" args={['#05070a', 9, 16]} />
      <LiveCable animate={animate} />
      <Ready onReady={onReady} />
    </Canvas>
  )
}

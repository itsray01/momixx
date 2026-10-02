'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { afterLoadIdle, canRun3D } from './capability'
import type { SceneVariant } from './scenes'

// Soft edges so long objects fade out instead of being cut off by the canvas.
const masks: Partial<Record<SceneVariant, string>> = {
  hero: 'radial-gradient(ellipse 70% 90% at 66% 45%, black 50%, transparent 88%)',
  cable: 'linear-gradient(to top right, transparent 4%, black 38%)',
  'ev-cable': 'linear-gradient(to top right, transparent 4%, black 38%)',
}

// Three.js is only downloaded when a scene scrolls near the viewport.
const Scene = dynamic(() => import('./scenes'), { ssr: false })

/**
 * A 3D scene with a static fallback. The fallback (a pre-rendered image) is server-rendered,
 * so it is what search engines, screen readers, devices without a GPU and slow
 * connections get; the 3D canvas loads after the page and fades in over it once ready. Rendering pauses
 * while off-screen and is frozen for visitors who prefer reduced motion.
 */
export function Scene3D({
  variant,
  fallback,
  overlay,
  className = '',
}: {
  variant: SceneVariant
  fallback: ReactNode
  /** Shown on top of the 3D once it has rendered (e.g. labels). */
  overlay?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    mq.addEventListener('change', onMq)
    setReduced(mq.matches)
    let io: IntersectionObserver | undefined
    const cancel = afterLoadIdle(() => {
      if (!canRun3D()) return
      io = new IntersectionObserver(
        ([entry]) => {
          setVisible(entry.isIntersecting)
          if (entry.isIntersecting) setEnabled(true)
        },
        { rootMargin: '200px' },
      )
      io.observe(el)
    })
    return () => {
      cancel()
      io?.disconnect()
      mq.removeEventListener('change', onMq)
    }
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className={`h-full w-full transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}>{fallback}</div>
      {enabled && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
          style={masks[variant] ? { maskImage: masks[variant], WebkitMaskImage: masks[variant] } : undefined}
        >
          <Scene variant={variant} animate={visible && !reduced} onReady={() => setReady(true)} />
        </div>
      )}
      {overlay && <div className={`pointer-events-none absolute inset-0 transition-opacity delay-300 duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>{overlay}</div>}
    </div>
  )
}

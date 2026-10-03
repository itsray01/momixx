'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { CanvasBoundary } from './CanvasBoundary'
import { useLazy3D } from './useLazy3D'

// Soft edges, so the cable fades out instead of being cut off by the canvas.
const mask = 'linear-gradient(to top, transparent 0%, black 22%), linear-gradient(to right, transparent 0%, black 14%)'

// Three.js is only downloaded on desktop screens with a GPU, after the page has loaded.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

/**
 * The home hero's 3D cable, with a pre-rendered still of the same view. The still
 * is server-rendered, so it is what search engines, phones, devices without a
 * GPU and slow connections get; the live scene fades in over it once ready.
 * Rendering pauses while off-screen and is frozen for visitors who prefer
 * reduced motion.
 */
export function Scene3D({ fallback, className = '' }: { fallback: ReactNode; className?: string }) {
  const { ref, enabled, visible, ready, markReady, reduced } = useLazy3D<HTMLDivElement>('200px')
  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className={`h-full w-full transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}>{fallback}</div>
      {enabled && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
          style={{ maskImage: mask, WebkitMaskImage: mask, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' }}
        >
          <CanvasBoundary>
            <HeroScene animate={visible && !reduced} onReady={markReady} />
          </CanvasBoundary>
        </div>
      )}
    </div>
  )
}

'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { CanvasBoundary } from './CanvasBoundary'
import { useLazy3D } from './useLazy3D'

// Three.js is only downloaded on desktop screens with a GPU, after the page has loaded.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

/**
 * The home hero's 3D cable, with a pre-rendered still of the same view. The still
 * is server-rendered, so it is what search engines, phones, devices without a
 * GPU and slow connections get; the live scene fades in over it once ready.
 * The scene only draws when the page scrolls or the pointer moves, and is
 * frozen for visitors who prefer reduced motion.
 */
export function Scene3D({ fallback, className = '' }: { fallback: ReactNode; className?: string }) {
  const { ref, enabled, visible, ready, markReady, reduced } = useLazy3D<HTMLDivElement>('200px')
  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className={`h-full w-full transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}>{fallback}</div>
      {enabled && (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <CanvasBoundary>
            <HeroScene animate={visible && !reduced} onReady={markReady} />
          </CanvasBoundary>
        </div>
      )}
      {/* The cable fades into the page at the bottom. A plain gradient on top is far cheaper than a CSS mask on the live canvas. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/4 bg-gradient-to-t from-[rgb(5_7_10)] to-transparent lg:block" />
    </div>
  )
}

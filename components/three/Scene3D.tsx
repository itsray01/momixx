'use client'

import { getImageProps } from 'next/image'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { CanvasBoundary } from './CanvasBoundary'
import { cableColours, cableColourStore, useCableColour, type CableColour } from './cableColours'
import { useLazy3D } from './useLazy3D'

// Three.js is only downloaded on desktop screens with a GPU, after the page has loaded.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

/** The hero still in one colour: the same view as the live 3D on desktop, a compact cable on phones. */
function HeroStillPicture({ colour, priority, onLoad }: { colour: CableColour; priority?: boolean; onLoad?: () => void }) {
  const common = { alt: '', sizes: '(min-width: 1024px) 50vw, min(100vw, 560px)' }
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: `/renders/cable-hero-${colour.id}.webp`, width: 960, height: 1200 })
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: `/renders/data-cable-${colour.id}.webp`, width: 1200, height: 900, ...(priority ? { loading: 'eager', fetchPriority: 'high' } : {}) })
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop} sizes="50vw" />
      <source srcSet={mobile} sizes="min(100vw, 560px)" />
      <img {...rest} alt="" draggable={false} onLoad={onLoad} className="h-full w-full object-contain select-none lg:object-cover" />
    </picture>
  )
}

/**
 * Stills of the other colours, layered over the server-rendered first one. A
 * colour is only shown once its image has loaded, and the previous one stays
 * underneath while it fades in, so the cable never flashes back to teal.
 */
function ColourStills({ index }: { index: number }) {
  const [requested, setRequested] = useState<number[]>([])
  const [loaded, setLoaded] = useState<number[]>([0])
  const [shown, setShown] = useState({ now: 0, before: 0 })
  if (index !== 0 && !requested.includes(index)) setRequested([...requested, index])
  const next = loaded.includes(index) ? index : shown.now
  if (next !== shown.now) setShown({ now: next, before: shown.now })
  return requested.map((i) => (
    <div
      key={i}
      className={`absolute inset-0 transition-opacity duration-500 ${i === shown.now ? 'z-10 opacity-100' : i === shown.before && shown.now !== 0 ? 'opacity-100' : 'opacity-0'}`}
    >
      <HeroStillPicture colour={cableColours[i]} onLoad={() => setLoaded((l) => (l.includes(i) ? l : [...l, i]))} />
    </div>
  ))
}

/**
 * The home hero's 3D cable, with a pre-rendered still of the same view. The still
 * (teal, the first colour) is server-rendered, so it is what search engines, phones, devices without a
 * GPU and slow connections get; the live scene fades in over it once ready.
 * The scene only draws when the page scrolls or the pointer moves, and is
 * frozen for visitors who prefer reduced motion.
 *
 * The cable comes in several colours (see cableColours): stills for each are
 * swapped in on phones, and the live scene blends between them on desktop.
 */
export function Scene3D({ className = '' }: { className?: string }) {
  const { ref, enabled, visible, ready, markReady, reduced } = useLazy3D<HTMLDivElement>('200px')
  const index = useCableColour()
  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Until the live scene takes over, tapping the cable shows the next colour. */}
      <div
        onClick={ready ? undefined : () => cableColourStore.next()}
        className={`relative h-full w-full transition-opacity duration-700 ${ready ? 'pointer-events-none opacity-0' : 'cursor-pointer opacity-100'}`}
      >
        <HeroStillPicture colour={cableColours[0]} priority />
        <ColourStills index={index} />
      </div>
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

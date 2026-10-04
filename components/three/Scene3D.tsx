'use client'

import { getImageProps } from 'next/image'
import dynamic from 'next/dynamic'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { CanvasBoundary } from './CanvasBoundary'
import { why3D } from './capability'
import { CABLE_CYCLE_MS, cableColours, cableColourStore, useCableColour, type CableColour } from './cableColours'
import { useLazy3D } from './useLazy3D'

// Add ?debug3d to the address to see whether live 3D runs on this device, and why not.
const noSubscribe = () => () => {}
const debugSnapshot = () => (new URLSearchParams(window.location.search).has('debug3d') ? why3D() : null)

// Three.js is only downloaded on desktop screens with a GPU, after the page has loaded.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

/**
 * The hero still in one colour: the same view as the live 3D on desktop, a
 * compact cable on phones. It is sized to the column's height and centred, as
 * the 3D camera is, so the two line up exactly at any screen shape and the
 * cable doesn't jump when the live scene takes over.
 */
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
      <img {...rest} alt="" draggable={false} onLoad={onLoad} className="absolute inset-y-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none" />
    </picture>
  )
}

/**
 * Stills of the other colours, layered over the server-rendered first one. A
 * colour is only shown once its image has loaded, and the previous one stays
 * underneath while it fades in, so the cable never flashes back to teal.
 */
function ColourStills({ index, preloadAll }: { index: number; preloadAll: boolean }) {
  const [requested, setRequested] = useState<number[]>([])
  const [loaded, setLoaded] = useState<number[]>([0])
  const [shown, setShown] = useState({ now: 0, before: 0 })
  if (index !== 0 && !requested.includes(index)) setRequested([...requested, index])
  const next = loaded.includes(index) ? index : shown.now
  if (next !== shown.now) setShown({ now: next, before: shown.now })
  // While someone hovers the still, every colour is fetched up front so the cycle never waits.
  const layers = preloadAll ? cableColours.map((_, i) => i).slice(1) : requested
  return layers.map((i) => (
    <div
      key={i}
      className={`absolute inset-0 transition-opacity duration-700 ${i === shown.now ? 'z-10 opacity-100' : i === shown.before && shown.now !== 0 ? 'opacity-100' : 'opacity-0'}`}
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
  const debug = useSyncExternalStore(noSubscribe, debugSnapshot, () => null)
  const index = useCableColour()
  // The live scene handles hover itself, on the cable, with motion. Otherwise
  // (the still is showing, e.g. no GPU, or motion is reduced) hovering the
  // cable's area with a mouse cycles the colours here.
  const liveHover = ready && !reduced
  const [hovering, setHovering] = useState(false)
  const [preload, setPreload] = useState(false)
  useEffect(() => {
    if (!hovering || liveHover) return
    let id = window.setTimeout(function tick() {
      cableColourStore.next()
      id = window.setTimeout(tick, CABLE_CYCLE_MS)
    }, CABLE_CYCLE_MS * 0.5)
    return () => window.clearTimeout(id)
  }, [hovering, liveHover])
  return (
    <div
      ref={ref}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        setHovering(true)
        if (!ready) setPreload(true)
      }}
      onPointerLeave={() => setHovering(false)}
      className={`relative ${className}`}
    >
      {/* Until the live scene takes over, tapping the cable shows the next colour. */}
      <div
        onClick={ready ? undefined : () => cableColourStore.next()}
        className={`relative h-full w-full overflow-hidden transition-opacity duration-700 ${ready ? 'pointer-events-none opacity-0' : 'cursor-pointer opacity-100'}`}
      >
        <HeroStillPicture colour={cableColours[0]} priority />
        <ColourStills index={index} preloadAll={preload} />
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
      {debug && (
        <p className="absolute top-24 right-4 z-30 max-w-sm rounded-lg bg-black/85 px-3 py-2 font-mono text-[11px] leading-relaxed text-white">
          Live 3D: {ready ? 'running' : enabled ? 'loading…' : 'off, showing the still'}
          {reduced && ' · reduce motion is on, so the cable stays still'}
          <br />
          {debug}
        </p>
      )}
    </div>
  )
}

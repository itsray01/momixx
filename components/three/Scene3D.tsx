'use client'

import { getImageProps } from 'next/image'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { CanvasBoundary } from './CanvasBoundary'
import { heroProfile, prefersLowData } from './capability'
import { CABLE_CYCLE_MS, cableColours, cableColourStore, useCableColour, type CableColour } from './cableColours'
import { heroReady } from './heroReady'
import type { HeroQuality } from './HeroScene'

// The scene (and Three.js) starts downloading as soon as this script runs, alongside
// the page's own start-up and the graphics check; the welcome screen covers the wait.
const loadHeroScene = () => import('./HeroScene')
if (typeof window !== 'undefined' && !prefersLowData()) void loadHeroScene()
const HeroScene = dynamic(loadHeroScene, { ssr: false })

const noSubscribe = () => () => {}
const mediaStore = (query: string) => ({
  subscribe: (cb: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  },
  get: () => window.matchMedia(query).matches,
})
const desktopMq = mediaStore('(min-width: 1024px)')
const reducedMq = mediaStore('(prefers-reduced-motion: reduce)')
const profileSnapshot = () => heroProfile()
// Add ?debug3d to the address to see how the hero's 3D runs on this device.
const debugSnapshot = () => new URLSearchParams(window.location.search).has('debug3d')

/**
 * The hero still in one colour, shown only where the live cable can't run (no
 * WebGL, data saver or a failed scene): the desktop view in a tall column, the
 * compact cable on phones, sized to the column's height and centred.
 */
function HeroStillPicture({ colour, onLoad }: { colour: CableColour; onLoad?: () => void }) {
  const common = { alt: '', sizes: '(min-width: 1024px) 50vw, min(100vw, 560px)' }
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: `/renders/cable-hero-${colour.id}.webp`, width: 960, height: 1200 })
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: `/renders/data-cable-${colour.id}.webp`, width: 1200, height: 900 })
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop} sizes="50vw" />
      <source srcSet={mobile} sizes="min(100vw, 560px)" />
      <img {...rest} alt="" draggable={false} onLoad={onLoad} className="absolute inset-y-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none" />
    </picture>
  )
}

/**
 * Stills of the other colours, layered over the first one. A colour is only
 * shown once its image has loaded, and the previous one stays underneath while
 * it fades in, so the cable never flashes back to teal.
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
 * The home hero's live 3D cable, on every device that can draw WebGL: the tall
 * desktop framing beside the headline, the compact one on phones. It tunes its
 * own quality before showing (see HeroScene), then fades in, while the welcome
 * screen covers the first visit's wait. Only without WebGL, with data saver or
 * a 2G connection, or if the scene fails, does a still image stand in.
 *
 * The cable comes in several colours (see cableColours). Where the live scene
 * isn't animating (the still, or reduced motion), hovering its area with a
 * mouse cycles the colours here instead, and the still floats up gently.
 */
export function Scene3D({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  // Null on the server: the scene is decided in the browser.
  const profile = useSyncExternalStore(noSubscribe, profileSnapshot, () => null)
  const desktop = useSyncExternalStore(desktopMq.subscribe, desktopMq.get, () => true)
  const reduced = useSyncExternalStore(reducedMq.subscribe, reducedMq.get, () => false)
  const debug = useSyncExternalStore(noSubscribe, debugSnapshot, () => false)
  const [visible, setVisible] = useState(true)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [quality, setQuality] = useState<HeroQuality | null>(null)
  const [readyAt, setReadyAt] = useState(0)
  const index = useCableColour()

  const showStill = !!profile && (!profile.run || failed)
  const live = ready && !showStill

  // Keep animating only while the hero is on screen. One callback can carry
  // several entries (the pinned hero briefly measures zero while the page
  // relays out): only the latest counts.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => setVisible(entries[entries.length - 1].isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Without a graphics card, drop the hero's decorative layers (see globals.css).
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('hero-lite', !!profile?.run && profile.tier === 'low')
    return () => root.classList.remove('hero-lite')
  }, [profile])

  // Tell the welcome screen once there is something to see.
  useEffect(() => {
    if (live || showStill) heroReady.set()
  }, [live, showStill])

  // Hover colour cycling where the live scene isn't doing it itself.
  const liveHover = live && !reduced
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
        if (showStill) setPreload(true)
      }}
      onPointerLeave={() => setHovering(false)}
      className={`relative ${className}`}
    >
      {showStill && (
        <div
          onClick={() => cableColourStore.next()}
          style={{ transition: 'scale 1.6s cubic-bezier(0.22, 1, 0.36, 1), translate 1.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
          className={`relative h-full w-full cursor-pointer overflow-hidden ${hovering && !reduced ? '-translate-y-2 scale-[1.025]' : ''}`}
        >
          <HeroStillPicture colour={cableColours[0]} />
          <ColourStills index={index} preloadAll={preload} />
        </div>
      )}
      {profile?.run && !failed && (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <CanvasBoundary onError={() => setFailed(true)}>
            <HeroScene
              key={desktop ? 'hero' : 'card'}
              tier={profile.tier}
              variant={desktop ? 'hero' : 'card'}
              animate={visible && !reduced}
              onReady={() => {
                setReady(true)
                setReadyAt(Math.round(performance.now()))
              }}
              onQuality={debug ? setQuality : undefined}
            />
          </CanvasBoundary>
        </div>
      )}
      {/* The cable fades into the page at the bottom. A plain gradient on top is far cheaper than a CSS mask on the live canvas. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/4 bg-gradient-to-t from-[rgb(5_7_10)] to-transparent lg:block" />
      {debug && profile && (
        <p className="absolute top-24 right-4 z-30 max-w-sm rounded-lg bg-black/85 px-3 py-2 font-mono text-[11px] leading-relaxed text-white">
          {showStill
            ? `Still image: ${failed ? 'the 3D scene failed' : profile.reason}`
            : `Live 3D: ${live ? `running (ready ${(readyAt / 1000).toFixed(1)} s after opening)` : 'tuning…'} · ${profile.tier} tier${profile.tier === 'low' ? ' (baked lighting)' : ''}`}
          {quality && !showStill && ` · ${quality.fps} fps at ${quality.dpr}× resolution`}
          {reduced && ' · reduce motion is on, so the cable stays still'}
          <br />
          {profile.reason}
        </p>
      )}
    </div>
  )
}

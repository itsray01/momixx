'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { site } from '@/lib/site'
import { LogoMark } from './Logo'
import { heroReady } from './three/heroReady'

/** Shortest and longest time the welcome screen shows, counted from the start of the page load. */
const MIN_MS = 2200
const MAX_MS = 4000

// Shown only on a full page load of the home page, once per visit (a session).
// Decided once in the browser; later client-side visits to the home page skip it.
let showIntro: boolean | undefined
const noSubscribe = () => () => {}
const introSnapshot = () => (showIntro ??= !document.documentElement.classList.contains('intro-seen') && performance.now() < MAX_MS)

/**
 * The welcome screen: the MoMixx mark and a thin progress line on black. It
 * covers the hero while its live 3D loads and tunes itself, then fades away
 * once the cable is ready (never sooner than MIN_MS, never later than MAX_MS),
 * so the hero appears complete instead of popping in.
 */
export function IntroOverlay() {
  const ref = useRef<HTMLDivElement>(null)
  const show = useSyncExternalStore(noSubscribe, introSnapshot, () => true)

  useEffect(() => {
    const el = ref.current
    if (!el || !show) return
    let done = false
    let pending = 0
    let gone = 0
    const hide = () => {
      if (done) return
      done = true
      showIntro = false
      el.dataset.state = 'leave'
      try {
        sessionStorage.setItem('mx-intro', '1')
      } catch {}
      gone = window.setTimeout(() => (el.dataset.state = 'gone'), 1000)
    }
    const onReady = () => {
      if (heroReady.get()) pending = window.setTimeout(hide, Math.max(0, MIN_MS - performance.now()))
    }
    const unsubscribe = heroReady.subscribe(onReady)
    onReady()
    const latest = window.setTimeout(hide, Math.max(0, MAX_MS - performance.now()))
    return () => {
      unsubscribe()
      window.clearTimeout(pending)
      window.clearTimeout(latest)
      window.clearTimeout(gone)
    }
  }, [show])

  if (!show) return null
  return (
    <div ref={ref} id="intro" data-state="show" aria-hidden="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950">
      <div className="intro-content flex flex-col items-center">
        <div className="flex items-center gap-3 text-white">
          <LogoMark className="h-11 w-11" />
          <span className="font-display text-3xl leading-none font-extrabold tracking-tight">{site.name}</span>
        </div>
        <div className="mt-9 h-px w-44 overflow-hidden rounded-full bg-white/10">
          <div className="intro-bar h-full w-full origin-left bg-white/70" />
        </div>
      </div>
    </div>
  )
}

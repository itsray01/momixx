'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { site } from '@/lib/site'
import { LogoMark } from './Logo'
import { heroReady } from './three/heroReady'

/** Shortest and longest time the welcome screen shows, counted from the start of the page load. */
const MIN_MS = 4500
const MAX_MS = 6200

// Shown only on a full page load of the home page, once per visit (a session).
// Decided once in the browser; later client-side visits to the home page skip it.
let showIntro: boolean | undefined
const noSubscribe = () => () => {}
const introSnapshot = () => (showIntro ??= !document.documentElement.classList.contains('intro-seen') && performance.now() < MAX_MS)

/**
 * The welcome screen: the MoMixx name rising letter by letter, the tagline and a
 * thin progress line, in the hero's light. It covers the hero while its live 3D
 * loads and tunes itself, then lifts away like a curtain
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
    <div ref={ref} id="intro" data-state="show" aria-hidden="true" className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink-950">
      {/* The same light as the hero, so the curtain lifts onto a scene that is already lit. */}
      <div className="intro-glow pointer-events-none absolute inset-0 bg-[radial-gradient(55%_75%_at_80%_-12%,rgb(255_255_255/0.13),rgb(255_255_255/0.04)_45%,transparent_75%)]" />
      <div className="intro-content relative flex flex-col items-center px-6 text-center">
        <div className="flex items-center gap-[0.24em] text-[clamp(3rem,7.5vw,7rem)] text-white">
          <LogoMark className="intro-mark size-[0.86em] shrink-0" />
          <span className="font-display leading-none font-extrabold tracking-[-0.045em]">
            {[...site.name].map((ch, i) => (
              // Each letter rises out of its own slot, one after another.
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="intro-letter inline-block" style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
                  {ch}
                </span>
              </span>
            ))}
          </span>
        </div>
        <p className="intro-tagline mt-7 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">{site.tagline}</p>
        <div className="mt-10 h-px w-56 overflow-hidden rounded-full bg-white/10">
          <div className="intro-bar h-full w-full origin-left bg-white/70" />
        </div>
      </div>
    </div>
  )
}

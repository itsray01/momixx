'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Site-wide motion, driven by data attributes so pages stay server components:
//   data-reveal            fade/slide in when scrolled into view
//   data-reveal="stagger"  same, one child at a time
//   data-grow / data-grow-y  bars grow from their baseline
//   data-countup           numbers count up ("20+", "100 m/min", "30%")
//   data-hero, data-hscroll  pinned, scroll-scrubbed sequences (desktop; see pins.ts)
//
// Everything except the pinned sequences is plain CSS transitions started by one
// IntersectionObserver, so no animation library ships with ordinary pages.
// Content is fully visible without JavaScript: only elements that start below
// the fold are hidden, just before they animate in. Nothing moves for visitors
// who prefer reduced motion.
export function ScrollEffects() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cleanups: Array<() => void> = []

    // ── Reveals, bars and count-ups: start each once it scrolls into view ──
    // Positions come from IntersectionObserver entries rather than reading the
    // layout directly, so setting up never forces the browser to re-layout.
    type Job = { below?: () => void; start: () => void }
    const jobs = new Map<Element, Job>()
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          jobs.get(e.target)?.start()
          jobs.delete(e.target)
          reveal.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    // First sighting: anything already on screen is left alone; anything below
    // the fold is hidden (if it animates in) and handed to the reveal observer.
    const sort = new IntersectionObserver((entries) => {
      for (const e of entries) {
        sort.unobserve(e.target)
        const job = jobs.get(e.target)
        if (!job) continue
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          // Count-ups already in view still count, once; reveals just stay visible.
          if (!job.below) job.start()
          jobs.delete(e.target)
          continue
        }
        job.below?.()
        reveal.observe(e.target)
      }
    })
    const when = (el: Element, job: Job) => {
      jobs.set(el, job)
      sort.observe(el)
    }

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const targets = el.dataset.reveal === 'stagger' ? (Array.from(el.children) as HTMLElement[]) : [el]
      when(el, {
        below: () =>
          targets.forEach((t, i) => {
            t.dataset.motion = 'wait'
            t.style.setProperty('--motion-delay', `${i * 0.08}s`)
          }),
        start: () => targets.forEach((t) => (t.dataset.motion = 'in')),
      })
    })

    document.querySelectorAll<HTMLElement>('[data-grow],[data-grow-y]').forEach((el) => {
      when(el, { below: () => (el.dataset.motionGrow = 'wait'), start: () => (el.dataset.motionGrow = 'in') })
    })

    document.querySelectorAll<HTMLElement>('[data-countup]').forEach((el) => {
      const original = el.textContent ?? ''
      const m = original.match(/^(\d[\d,]*)(\D.*)?$/)
      if (!m) return
      const target = Number(m[1].replace(/,/g, ''))
      const suffix = m[2] ?? ''
      const isYear = !suffix && target >= 1900 && target <= 2100
      if (target < 10 || isYear) return
      const fmt = (v: number) => (m[1].includes(',') ? Math.round(v).toLocaleString('en') : String(Math.round(v))) + suffix
      // The real value stays in the page until the number scrolls into view,
      // so crawlers and no-scroll visitors never see "0".
      let raf = 0
      when(el, {
        below: () => {},
        start: () => {
          const t0 = performance.now()
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / 1600)
            el.textContent = p < 1 ? fmt(target * (1 - (1 - p) ** 2)) : original
            if (p < 1) raf = requestAnimationFrame(tick)
          }
          raf = requestAnimationFrame(tick)
        },
      })
      cleanups.push(() => {
        cancelAnimationFrame(raf)
        el.textContent = original
      })
    })
    cleanups.push(() => {
      sort.disconnect()
      reveal.disconnect()
    })

    // ── Pinned sequences: GSAP is only downloaded where one exists, on desktop ──
    let disposed = false
    if (document.querySelector('[data-hero],[data-hscroll]') && window.matchMedia('(min-width: 1024px)').matches) {
      import('./pins').then(({ setupPins }) => {
        if (!disposed) cleanups.push(setupPins())
      })
    }

    return () => {
      disposed = true
      cleanups.forEach((c) => c())
      document.querySelectorAll<HTMLElement>('[data-motion]').forEach((el) => delete el.dataset.motion)
      document.querySelectorAll<HTMLElement>('[data-motion-grow]').forEach((el) => delete el.dataset.motionGrow)
    }
  }, [pathname])

  return null
}

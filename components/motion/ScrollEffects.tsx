'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from 'next/navigation'
import { heroProgress } from '@/components/three/heroProgress'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Site-wide motion, driven by data attributes so pages stay server components:
//   data-reveal            fade/slide in when scrolled into view
//   data-reveal="stagger"  same, one child at a time
//   data-grow / data-grow-y  bars grow from their baseline
//   data-draw              SVG strokes draw themselves
//   data-countup           numbers count up ("20+", "100 m/min", "30%")
//   data-tilt              3D tilt with a light sheen that follows the pointer
//   data-words             words light up one by one as you scroll through
//   data-hero              pinned hero; drives the 3D cable via heroProgress
//   data-hscroll           pinned horizontal-scroll story (desktop)
// Pinned elements must sit inside a plain wrapper element: GSAP moves them into
// a spacer, so React has to remove the wrapper (not the moved element) on navigation.
// Content is fully visible without JavaScript, and nothing moves for visitors
// who prefer reduced motion.
export function ScrollEffects() {
  const pathname = usePathname()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const once = (trigger: Element, start = 'top 88%') => ({ trigger, start, once: true })

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          const targets = el.dataset.reveal === 'stagger' ? Array.from(el.children) : el
          // Opacity only (not visibility), so unrevealed sections stay in the
          // accessibility tree and screen readers can still navigate to them.
          gsap.from(targets, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: once(el) })
        })

        gsap.utils.toArray<HTMLElement>('[data-grow]').forEach((el) => {
          gsap.from(el, { scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'power3.out', scrollTrigger: once(el, 'top 92%') })
        })
        gsap.utils.toArray<HTMLElement>('[data-grow-y]').forEach((el) => {
          gsap.from(el, { scaleY: 0, transformOrigin: 'center bottom', duration: 1.1, ease: 'power3.out', scrollTrigger: once(el, 'top 92%') })
        })

        gsap.utils.toArray<SVGGeometryElement>('[data-draw]').forEach((el) => {
          const len = el.getTotalLength()
          gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', scrollTrigger: once(el, 'top 85%') })
        })
        gsap.utils.toArray<SVGElement>('[data-pop]').forEach((el, i) => {
          gsap.from(el, { scale: 0, transformOrigin: '50% 50%', duration: 0.6, delay: i * 0.08, ease: 'back.out(2)', scrollTrigger: once(el, 'top 90%') })
        })

        gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll('[data-word]'),
            { opacity: 0.4 },
            { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
          )
        })

        const restore: Array<() => void> = []
        gsap.utils.toArray<HTMLElement>('[data-countup]').forEach((el) => {
          const original = el.textContent ?? ''
          const m = original.match(/^(\d[\d,]*)(\D.*)?$/)
          if (!m) return
          const target = Number(m[1].replace(/,/g, ''))
          const suffix = m[2] ?? ''
          const isYear = !suffix && target >= 1900 && target <= 2100
          if (target < 10 || isYear) return
          const fmt = (v: number) => (m[1].includes(',') ? Math.round(v).toLocaleString('en') : String(Math.round(v))) + suffix
          // The real value stays in the page until the number scrolls into
          // view, so crawlers and no-scroll visitors never see "0".
          const state = { v: 0 }
          restore.push(() => (el.textContent = original))
          gsap.to(state, {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => (el.textContent = fmt(state.v)),
            onComplete: () => (el.textContent = original),
            scrollTrigger: once(el, 'top bottom'),
          })
        })
        return () => restore.forEach((r) => r())
      })

      // Pinned, scroll-scrubbed sequences: desktop only, never for reduced motion.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const hero = document.querySelector<HTMLElement>('[data-hero]')
        if (hero) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: '+=90%',
              pin: true,
              scrub: 0.6,
              onUpdate: (self) => (heroProgress.value = self.progress),
            },
          })
          tl.to(hero.querySelectorAll('[data-hero-fade]'), { y: -80, autoAlpha: 0, ease: 'power1.in', duration: 1 }, 0)
          tl.from(hero.querySelectorAll('[data-hero-label]'), { y: 30, autoAlpha: 0, stagger: 0.25, duration: 0.6, ease: 'power2.out' }, 0.25)
        }

        const hscrollCleanups = gsap.utils.toArray<HTMLElement>('[data-hscroll]').map((wrap) => {
          const track = wrap.querySelector<HTMLElement>('[data-hscroll-track]')
          const viewport = wrap.querySelector<HTMLElement>('[data-hscroll-viewport]')
          const bar = wrap.querySelector<HTMLElement>('[data-hscroll-progress]')
          if (!track || !viewport) return () => {}
          // While pinned, the row is moved by scrolling the page, not swiped.
          // Scroll-snap must be off too, or the browser re-snaps the viewport
          // against the transform and the cards stop moving.
          viewport.style.overflowX = 'hidden'
          viewport.style.scrollSnapType = 'none'
          viewport.scrollLeft = 0
          const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
          gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
            },
          })
          return () => {
            viewport.style.overflowX = ''
            viewport.style.scrollSnapType = ''
          }
        })
        return () => {
          heroProgress.value = 0
          hscrollCleanups.forEach((c) => c())
        }
      })

      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const cleanups = gsap.utils.toArray<HTMLElement>('[data-tilt]').map((el) => {
          gsap.set(el, { transformPerspective: 900 })
          const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
          const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width
            const py = (e.clientY - r.top) / r.height
            rx((0.5 - py) * 4)
            ry((px - 0.5) * 5)
            el.style.setProperty('--mx', `${px * 100}%`)
            el.style.setProperty('--my', `${py * 100}%`)
          }
          const leave = () => {
            rx(0)
            ry(0)
          }
          el.addEventListener('pointermove', move)
          el.addEventListener('pointerleave', leave)
          return () => {
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
          }
        })
        return () => cleanups.forEach((c) => c())
      })

      // Fonts and lazy 3D can shift layout; recalculate trigger positions.
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 800)
      return () => {
        window.clearTimeout(t)
        mm.revert()
      }
    },
    { dependencies: [pathname], revertOnUpdate: true },
  )

  return null
}

// The two pinned, scroll-scrubbed sequences: the home hero (the 3D cable turns
// towards you) and the sideways "sand to silicone" story. They need GSAP's
// ScrollTrigger, so this module is only downloaded on desktop pages that have
// one, after the page has loaded. Everything else on the site animates with CSS.
//
// Pinned elements must sit inside a plain wrapper element: GSAP moves them into
// a spacer, so React has to remove the wrapper (not the moved element) on navigation.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { revealHeroCallouts } from '@/components/calloutAnchors'
import { heroProgress } from '@/components/three/heroProgress'

gsap.registerPlugin(ScrollTrigger)

/** Sets up the pinned sequences on the current page; returns a cleanup. */
export function setupPins(): () => void {
  const mm = gsap.matchMedia()

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
          onUpdate: (self) => {
            // This progress turns the cable and reveals the callouts. A second
            // trigger on the pinned element barely advances, so both stay here.
            heroProgress.value = self.progress
            // The headline fades across the whole pin. Callouts wait until it has
            // mostly gone, so they never sit on top of "what's next."
            if (self.progress >= 0.8) revealHeroCallouts()
          },
        },
      })
      tl.to(hero.querySelectorAll('[data-hero-fade]'), { y: -80, autoAlpha: 0, ease: 'power1.in', duration: 1 }, 0)
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

  // Fonts and lazy images can shift layout after load; recalculate trigger positions.
  const t = window.setTimeout(() => ScrollTrigger.refresh(), 800)
  return () => {
    window.clearTimeout(t)
    mm.revert()
  }
}

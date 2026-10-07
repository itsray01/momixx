// The two pinned, scroll-scrubbed sequences: the home hero (the headline gives
// way to three specs, one step at a time, as the 3D cable turns to each) and the
// sideways "sand to silicone" story. They need GSAP's
// ScrollTrigger, so this module is only downloaded on desktop pages that have
// one, after the page has loaded. Everything else on the site animates with CSS.
//
// Pinned elements must sit inside a plain wrapper element: GSAP moves them into
// a spacer, so React has to remove the wrapper (not the moved element) on navigation.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_LAST_STEP, setHeroProgress } from '@/components/three/heroProgress'

gsap.registerPlugin(ScrollTrigger)

/** The home hero's story, one label per step (see heroProgress). */
const HERO_STEPS = ['intro', 'heat', 'fire', 'flex', 'release']

/** Sets up the pinned sequences on the current page; returns a cleanup. */
export function setupPins(): () => void {
  const mm = gsap.matchMedia()

  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    const hero = document.querySelector<HTMLElement>('[data-hero]')
    if (hero) {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        // The scrubbed playhead, in steps, poses the cable and brings in the specs.
        onUpdate: () => setHeroProgress(tl.time()),
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          // One screen per step: Page Down or Space (seven-eighths of a screen)
          // lands just short of the next step, and the snap settles it there.
          end: `+=${HERO_LAST_STEP * 100}%`,
          pin: true,
          scrub: 0.5,
          // Once scrolling stops, settle on the next step in the direction of
          // travel, so it never jumps back. Any scroll cancels it, and it only
          // acts inside the pinned range: the rest of the page never snaps.
          snap: { snapTo: 'labelsDirectional', duration: { min: 0.4, max: 0.6 }, delay: 0.15, ease: 'power2.inOut', inertia: false },
        },
      })
      HERO_STEPS.forEach((label, step) => tl.addLabel(label, step))
      // The headline, intro and buttons leave first; the specs take their place from step 1.
      tl.to(hero.querySelectorAll('[data-hero-fade]'), { y: -80, autoAlpha: 0, duration: 0.6 }, 0)
      tl.set({}, {}, HERO_LAST_STEP)
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
      setHeroProgress(0)
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

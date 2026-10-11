'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef } from 'react'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Motion between pages and while they load:
// - each new page fades in over a moment instead of swapping in a single frame
//   (opacity only, so pinned sections and fixed elements are unaffected; not on
//   the first load, so it never delays the first paint);
// - pictures that are still loading fade in when they arrive instead of popping in.
// Nothing moves for visitors who prefer reduced motion.
export function PageMotion() {
  const pathname = usePathname()
  const first = useRef(true)

  // Before the new page paints, so it never flashes in at full strength first.
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (reduced()) return
    document.getElementById('main')?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: EASE })
  }, [pathname])

  useEffect(() => {
    if (reduced()) return
    const cleanups: Array<() => void> = []
    document.querySelectorAll<HTMLImageElement>('main img').forEach((img) => {
      // The hero's cable stills cross-fade on their own, and the main picture at the
      // top of a page (loaded first, at high priority) is never held back.
      if (img.closest('[data-hero]') || img.fetchPriority === 'high' || (img.complete && img.naturalWidth > 0)) return
      img.dataset.fade = 'wait'
      const done = () => {
        img.dataset.fade = 'in'
      }
      img.addEventListener('load', done, { once: true })
      img.addEventListener('error', done, { once: true })
      cleanups.push(() => {
        img.removeEventListener('load', done)
        img.removeEventListener('error', done)
        delete img.dataset.fade
      })
    })
    return () => cleanups.forEach((c) => c())
  }, [pathname])

  return null
}

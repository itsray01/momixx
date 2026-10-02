'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Inertia smooth scrolling (Lenis), kept in sync with GSAP ScrollTrigger. Off for reduced motion and touch. */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse) return
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true, anchors: { offset: -96 } })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  // New page: start at the top.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return null
}

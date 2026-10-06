'use client'

import { useEffect, useRef, useState } from 'react'
import { afterLoadIdle, canRun3D } from './capability'

/**
 * Shared loading rules for every live 3D scene. The still image always paints
 * first; once the page has loaded and the browser is idle, devices that can run
 * 3D start loading it as the stage comes near the viewport.
 *
 * - `enabled`: mount the canvas (and so download Three.js)
 * - `visible`: the stage is on screen, so keep animating
 * - `ready` / `markReady`: the first frame is drawn; fade the canvas in
 * - `reduced`: the visitor prefers reduced motion, so render on demand only
 */
export function useLazy3D<T extends HTMLElement>(rootMargin = '300px') {
  const ref = useRef<T>(null)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    let stopped = false
    let io: IntersectionObserver | undefined
    const cancel = afterLoadIdle(() => {
      void canRun3D().then((ok) => {
        if (stopped || !ok) return
        io = new IntersectionObserver(
          ([entry]) => {
            setVisible(entry.isIntersecting)
            if (entry.isIntersecting) setEnabled(true)
          },
          { rootMargin },
        )
        io.observe(el)
      })
    })
    return () => {
      stopped = true
      cancel()
      io?.disconnect()
      mq.removeEventListener('change', onMq)
    }
  }, [rootMargin])

  return { ref, enabled, visible, ready, markReady: () => setReady(true), reduced }
}

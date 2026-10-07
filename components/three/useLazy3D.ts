'use client'

import { useEffect, useRef, useState } from 'react'
import { afterLoadIdle, canRun3D } from './capability'

/**
 * Shared loading rules for every live 3D scene. The still image always paints
 * first; once the page has loaded and the browser is idle, devices that can run
 * 3D start loading it as the stage comes near the viewport. With `onDemand`,
 * nothing loads until `load()` is called (a "View in 3D" button, say).
 *
 * - `capable`: this device can run the 3D scene
 * - `enabled` / `load`: mount the canvas (and so download Three.js)
 * - `visible`: the stage is on screen, so keep animating
 * - `ready` / `markReady`: the first frame is drawn; fade the canvas in
 * - `reduced`: the visitor prefers reduced motion, so render on demand only
 */
export function useLazy3D<T extends HTMLElement>({ rootMargin = '300px', onDemand = false }: { rootMargin?: string; onDemand?: boolean } = {}) {
  const ref = useRef<T>(null)
  const [capable, setCapable] = useState(false)
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
        setCapable(true)
        io = new IntersectionObserver(
          ([entry]) => {
            setVisible(entry.isIntersecting)
            if (entry.isIntersecting && !onDemand) setEnabled(true)
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
  }, [rootMargin, onDemand])

  return { ref, capable, enabled, load: () => setEnabled(true), visible, ready, markReady: () => setReady(true), reduced }
}

'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { afterLoadIdle, canRun3D } from './three/capability'
import hotspots from './three/cableHotspots.json'
import { anatomyStillExplode, cableLayers } from './three/cableLayers'

const CableAnatomyCanvas = dynamic(() => import('./three/CableAnatomyCanvas'), { ssr: false })

/**
 * Anatomy of a silicone data cable. On capable devices the layers pull apart
 * in 3D as you scroll; everywhere else it is a labelled pre-rendered image.
 * Hover a layer (in the list or on its marker) to pick it out.
 */
export function CableAnatomy() {
  const stage = useRef<HTMLDivElement>(null)
  const explode = useRef(anatomyStillExplode)
  const markers = useRef<Array<HTMLButtonElement | null>>([])
  const [active, setActive] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    // Scroll drives the explode: neat steps as the cable enters, fully apart at mid-screen.
    const onScroll = () => {
      if (mq.matches) return
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.9)))
      explode.current = p * p * (3 - 2 * p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    let io: IntersectionObserver | undefined
    const cancel = afterLoadIdle(() => {
      if (!canRun3D()) return
      io = new IntersectionObserver(
        ([entry]) => {
          setVisible(entry.isIntersecting)
          if (entry.isIntersecting) setEnabled(true)
        },
        { rootMargin: '300px' },
      )
      io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancel()
      io?.disconnect()
    }
  }, [])

  const markerClass = (id: string, momixx?: boolean) =>
    `flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[11px] font-semibold backdrop-blur transition-colors ${
      active === id ? 'border-brand-200 bg-brand-300 text-ink-950' : momixx ? 'border-brand-300 bg-brand-400/90 text-ink-950' : 'border-white/30 bg-ink-950/70 text-slate-100'
    }`

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
      <ol className="space-y-1 lg:order-1">
        {cableLayers.map((l, i) => (
          <li key={l.id}>
            <button
              type="button"
              onMouseEnter={() => setActive(l.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(l.id)}
              onBlur={() => setActive(null)}
              className={`flex w-full gap-4 rounded-2xl p-4 text-left transition-colors ${active === l.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'} ${l.momixx ? 'border border-brand-400/30 bg-brand-400/[0.06]' : ''}`}
            >
              <span className={`mt-0.5 shrink-0 ${markerClass(l.id, l.momixx)}`}>{i + 1}</span>
              <span>
                <span className="flex items-center gap-2 font-semibold text-white">
                  {l.name}
                  {l.momixx && <span className="rounded-full bg-brand-400 px-2 py-0.5 text-[10px] font-semibold text-ink-950">Momixx</span>}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-400">{l.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div ref={stage} className="card relative order-first aspect-[4/3] overflow-hidden lg:order-2">
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
          <Image src="/renders/cable-anatomy.webp" alt="Cutaway of a silicone data cable showing its layers" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain" />
          {cableLayers.map((l, i) => {
            const h = hotspots[l.id as keyof typeof hotspots]
            return (
              <span
                key={l.id}
                aria-hidden="true"
                onMouseEnter={() => setActive(l.id)}
                onMouseLeave={() => setActive(null)}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${markerClass(l.id, l.momixx)}`}
              >
                {i + 1}
              </span>
            )
          })}
        </div>
        {enabled && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <CableAnatomyCanvas explode={explode} highlight={active} markers={markers} animate={visible && !reduced} onReady={() => setReady(true)} />
            {cableLayers.map((l, i) => (
              <button
                key={l.id}
                ref={(el) => void (markers.current[i] = el)}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onMouseEnter={() => setActive(l.id)}
                onMouseLeave={() => setActive(null)}
                style={{ visibility: 'hidden' }}
                className={`absolute top-0 left-0 ${markerClass(l.id, l.momixx)}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
        <p className="pointer-events-none absolute right-4 bottom-4 left-4 text-center text-[11px] text-slate-500">A typical USB-C cable. Designs vary by maker.</p>
      </div>
    </div>
  )
}

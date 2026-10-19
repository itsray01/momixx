'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CableCharging } from './CableCharging'
import { CableStory } from './CableStory'
import { CanvasBoundary } from './three/CanvasBoundary'
import { afterLoadIdle, canRun3D } from './three/capability'
import { useLazy3D } from './three/useLazy3D'
import hotspots from './three/cableHotspots.json'
import { anatomyStillExplode, cableLayers } from './three/cableLayers'

const CableAnatomyCanvas = dynamic(() => import('./three/CableAnatomyCanvas'), { ssr: false })

// Where each label sits on wide screens (a 12-column grid), so its line drops
// close to its layer: labels alternate above and below the cable.
const place: Record<string, string> = {
  jacket: 'lg:col-start-2 lg:col-span-4',
  braid: 'lg:col-start-5 lg:col-span-3',
  foil: 'lg:col-start-6 lg:col-span-3',
  insulation: 'lg:col-start-8 lg:col-span-3',
  copper: 'lg:col-start-9 lg:col-span-3',
}

/**
 * Anatomy of a silicone data cable, drawn like an exploded technical diagram.
 * On wide screens each layer's label sits above or below the cable, joined to
 * it by a fine line; on phones the layers are numbered on the picture and
 * listed beneath it. On capable devices the layers pull apart in 3D as you
 * scroll (the lines follow); everywhere else it is a pre-rendered image.
 * Hover or focus a label to pick its layer out; click to keep it picked.
 */
function StaticAnatomy({ productLink = true }: { productLink?: boolean }) {
  const { ref: stage, enabled, visible, ready, markReady, reduced } = useLazy3D<HTMLDivElement>()
  const wrap = useRef<HTMLDivElement>(null)
  const explode = useRef(anatomyStillExplode)
  const markers = useRef<Array<HTMLButtonElement | null>>([])
  const stills = useRef<Array<HTMLSpanElement | null>>([])
  const badges = useRef<Array<HTMLSpanElement | null>>([])
  const lines = useRef<Array<SVGPolylineElement | null>>([])
  const live = useRef(false)
  const [previewed, setActive] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [seen, setSeen] = useState(false)
  const active = previewed ?? pinned

  useEffect(() => {
    live.current = ready
  }, [ready])

  // Scroll drives the explode: neat steps as the cable enters, fully apart at mid-screen.
  // Only needed once the live 3D is running.
  useEffect(() => {
    const el = stage.current
    if (!el || !enabled || reduced) return
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.9)))
      explode.current = p * p * (3 - 2 * p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [stage, enabled, reduced])

  // The label lines (wide screens only): from each label's number, along its edge,
  // then across to its layer. Redrawn every frame while on screen, so they follow
  // the layers as they move apart and the camera drifts.
  useEffect(() => {
    const w = wrap.current
    if (!w) return
    const wide = window.matchMedia('(min-width: 1024px)')
    let raf = 0
    let on = false
    const draw = () => {
      raf = 0
      const box = stage.current
      if (!on || !wide.matches || !box) return
      const base = w.getBoundingClientRect()
      const s = box.getBoundingClientRect()
      cableLayers.forEach((l, i) => {
        const line = lines.current[i]
        const badge = badges.current[i]
        const dot = live.current ? markers.current[i] : stills.current[i]
        if (!line || !badge || !dot) return
        const a = badge.getBoundingClientRect()
        const b = dot.getBoundingClientRect()
        const above = l.side === 'above'
        const x = a.left + a.width / 2 - base.left
        const y = (above ? a.bottom + 6 : a.top - 6) - base.top
        // Every line turns on one level, just inside the stage, so the labels read as a set.
        const turn = (above ? s.top + s.height * 0.12 : s.bottom - s.height * 0.12) - base.top
        const tx = b.left + b.width / 2 - base.left
        const ty = b.top + b.height / 2 - base.top
        line.setAttribute('points', `${x},${y} ${x},${turn} ${tx},${ty}`)
      })
      raf = requestAnimationFrame(draw)
    }
    const io = new IntersectionObserver(([entry]) => {
      on = entry.isIntersecting
      if (on) {
        setSeen(true)
        if (!raf) raf = requestAnimationFrame(draw)
      }
    })
    io.observe(w)
    const onWide = () => {
      if (on && wide.matches && !raf) raf = requestAnimationFrame(draw)
    }
    wide.addEventListener('change', onWide)
    return () => {
      io.disconnect()
      wide.removeEventListener('change', onWide)
      cancelAnimationFrame(raf)
    }
  }, [stage])

  const dim = (id: string) => active !== null && active !== id
  // A numbered disc on phones; a small point on wide screens, where the label carries the number.
  const marker = (id: string, momixx?: boolean) =>
    `flex h-6 w-6 items-center justify-center rounded-full border font-mono text-xs font-semibold backdrop-blur transition-[background-color,border-color,opacity,scale] duration-300 lg:h-2.5 lg:w-2.5 lg:border-2 lg:border-ink-950/70 lg:bg-white lg:text-[0px] lg:backdrop-blur-none ${
      active === id ? 'border-white bg-white text-ink-950 lg:scale-150' : momixx ? 'border-white/80 bg-white/90 text-ink-950' : 'border-white/40 bg-ink-950/70 text-zinc-100'
    } ${dim(id) ? 'opacity-40' : ''}`
  const pick = (id: string) => ({
    onMouseEnter: () => setActive(id),
    onMouseLeave: () => setActive(null),
  })

  return (
    <>
    <div ref={wrap} className="relative grid grid-cols-1 lg:grid-cols-12 lg:gap-x-6">
      {/* The label lines, over everything (wide screens). */}
      <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 z-10 hidden h-full w-full overflow-visible transition-opacity delay-300 duration-1000 lg:block ${seen ? 'opacity-100' : 'opacity-0'}`}>
        {cableLayers.map((l, i) => (
          <polyline
            key={l.id}
            ref={(el) => void (lines.current[i] = el)}
            fill="none"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className={`transition-[stroke] duration-300 ${active === l.id ? 'stroke-white' : dim(l.id) ? 'stroke-white/10' : l.momixx ? 'stroke-white/60' : 'stroke-white/30'}`}
          />
        ))}
      </svg>

      {/* Edge to edge on phones and tablets, for the most cable; within the page column on desktops. */}
      <div ref={stage} className="relative -mx-4 aspect-[2/1] overflow-hidden sm:-mx-6 lg:col-span-12 lg:row-start-2 lg:mx-0 lg:aspect-[3/1]">
        {/* A soft pool of light and a faint drafting grid behind the cable. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_65%_at_55%_52%,rgb(255_255_255/0.07),transparent_72%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(to right, #121412 1px, transparent 1px), linear-gradient(to bottom, #121412 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            backgroundPosition: 'center',
            maskImage: 'radial-gradient(ellipse 60% 70% at 55% 50%, black 15%, transparent 75%)',
          }}
        />
        {/* The cable runs in from the left edge; the fade keeps that edge soft. */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_18%)]">
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
            {/* The still is 21:9: full width and centred on every stage shape, cropped top and bottom where the stage is wider (the 3D frames the same width). */}
            <div className="absolute inset-x-0 top-1/2 aspect-[21/9] -translate-y-1/2">
              <Image src="/renders/cable-anatomy.webp" alt="Cutaway of a silicone data cable showing its layers" fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-contain" />
            </div>
          </div>
          {enabled && (
            <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
              <CanvasBoundary>
                <CableAnatomyCanvas explode={explode} highlight={active} markers={markers} animate={visible && !reduced} onReady={markReady} />
              </CanvasBoundary>
            </div>
          )}
        </div>
        {/* Markers sit outside the fade, so none is dimmed by it. */}
        <div className={`absolute inset-x-0 top-1/2 aspect-[21/9] -translate-y-1/2 transition-opacity duration-700 ${ready ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
          {cableLayers.map((l, i) => {
            const h = hotspots[l.id as keyof typeof hotspots]
            return (
              <span
                key={l.id}
                ref={(el) => void (stills.current[i] = el)}
                aria-hidden="true"
                {...pick(l.id)}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${marker(l.id, l.momixx)}`}
              >
                {i + 1}
              </span>
            )
          })}
        </div>
        {enabled &&
          cableLayers.map((l, i) => (
            <button
              key={l.id}
              ref={(el) => void (markers.current[i] = el)}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              {...pick(l.id)}
              style={{ visibility: 'hidden' }}
              // The 3D places this wrapper with `transform` every frame; the visible dot is inside it,
              // because scaling the wrapper itself (on hover) would scale that offset too and fling the dot away.
              className={`absolute top-0 left-0 ${ready ? '' : 'opacity-0'}`}
            >
              <span className={marker(l.id, l.momixx)}>{i + 1}</span>
            </button>
          ))}
        {/* Bottom left on desktops, under the jacket, where no label line runs. */}
        <p className="pointer-events-none absolute right-4 bottom-2 left-4 text-center text-xs text-zinc-500 lg:right-auto lg:bottom-3 lg:left-0 lg:text-left">A typical USB-C cable. Designs vary by maker.</p>
      </div>

      {/* One list of layers, outside in. On wide screens its items join the grid around the cable. */}
      <ol className="mt-6 space-y-1 lg:contents">
        {cableLayers.map((l, i) => (
          <li
            key={l.id}
            data-reveal
            style={{ '--motion-delay': `${0.15 + i * 0.09}s` } as CSSProperties}
            className={`${l.side === 'above' ? 'lg:row-start-1 lg:self-start lg:pb-4' : 'lg:row-start-3 lg:self-start lg:pt-4'} ${place[l.id]}`}
          >
            <button
              type="button"
              aria-pressed={pinned === l.id}
              onClick={() => setPinned((p) => (p === l.id ? null : l.id))}
              {...pick(l.id)}
              onFocus={() => setActive(l.id)}
              onBlur={() => setActive(null)}
              className={`group flex w-full gap-4 rounded-2xl p-4 text-left transition-[background-color,opacity] duration-300 lg:-mx-3 lg:w-[calc(100%+1.5rem)] lg:p-3 ${active === l.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'} ${dim(l.id) ? 'lg:opacity-45' : ''} ${l.momixx ? 'max-lg:border max-lg:border-white/15 max-lg:bg-white/[0.04]' : ''}`}
            >
              <span
                ref={(el) => void (badges.current[i] = el)}
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-colors ${
                  active === l.id || l.momixx ? 'border-white bg-white text-ink-950' : 'border-white/30 text-zinc-100'
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className={`flex flex-wrap items-center gap-2 font-semibold text-white ${l.momixx ? 'lg:text-lg' : ''}`}>
                  {l.name}
                  {l.momixx && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold tracking-wide text-ink-950">MoMixx</span>}
                </span>
                <span className={`mt-1 block text-sm leading-relaxed ${l.momixx ? 'text-zinc-300' : 'text-zinc-400'}`}>{l.body}</span>
              </span>
            </button>
            {l.momixx && productLink && (
              <Link href="/products/momixx-mm" className="mt-1 ml-15 inline-flex items-center gap-1.5 text-sm font-medium text-white underline decoration-white/25 underline-offset-4 hover:decoration-white lg:ml-11">
                About MoMixx MM silicone <span aria-hidden="true">→</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
    {/* The last beat: the same cable plugs into a phone and charges. */}
    <CableCharging />
    </>
  )
}

/**
 * The cable anatomy section. On desktops that run live 3D it becomes a scroll
 * story (CableStory.tsx): the section holds still while you scroll through the
 * five layers, then the cable plugs into a phone. Everyone else (phones, other
 * computers, reduced motion) gets the labelled picture and the charging scene
 * below it. The page first draws the simple version; it switches only while the
 * section is still below the screen, so nothing jumps under the reader.
 */
export function CableAnatomy({ productLink = true }: { productLink?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [story, setStory] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 1024px) and (min-height: 640px)').matches) return
    let stopped = false
    const cancel = afterLoadIdle(() => {
      void canRun3D().then((ok) => {
        const el = ref.current
        if (stopped || !ok || !el) return
        if (el.getBoundingClientRect().top > window.innerHeight) setStory(true)
      })
    })
    return () => {
      stopped = true
      cancel()
    }
  }, [])

  return <div ref={ref}>{story && !failed ? <CableStory productLink={productLink} onFail={() => setFailed(true)} /> : <StaticAnatomy productLink={productLink} />}</div>
}

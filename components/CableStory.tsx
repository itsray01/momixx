'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CanvasBoundary } from './three/CanvasBoundary'
import { cableLayers } from './three/cableLayers'
import type { StoryFrame } from './three/StoryScene'
import { STORY_SCREENS, STORY_STEPS, progressAtStop, storyFromProgress, storyLayer } from './three/storyTimeline'
import { endScriptedScroll, startScriptedScroll } from './motion/scriptedScroll'

const StoryCanvas = dynamic(() => import('./three/StoryScene'), { ssr: false })

/** Space kept clear between a row of labels and the cable. */
const CLEAR = 28

// Where each label sits around the cable (a 12-column grid): above for 1, 3, 5; below for 2, 4.
const place: Record<string, string> = {
  jacket: 'col-start-2 col-span-4',
  braid: 'col-start-5 col-span-3',
  foil: 'col-start-6 col-span-3',
  insulation: 'col-start-8 col-span-3',
  copper: 'col-start-9 col-span-3',
}

/**
 * The cable anatomy as a scroll story, on desktops that run live 3D. The section
 * holds still while you scroll through it, settling on each step: the five
 * layers one at a time (the rest x-rayed), then the cable closes up, grows a
 * USB-C plug, and plugs into a plain phone that charges. Scrolling back plays it
 * in reverse. Each step holds still for a stretch of scrolling instead of the page
 * snapping, so the wheel and trackpad always move freely. The script is in
 * three/storyTimeline.ts.
 */
export function CableStory({ productLink = true, onFail }: { productLink?: boolean; onFail: () => void }) {
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const target = useRef(0)
  const frame = useRef<StoryFrame | null>(null)
  const markers = useRef<Array<HTMLSpanElement | null>>([])
  const badges = useRef<Array<HTMLSpanElement | null>>([])
  const lines = useRef<Array<SVGPolylineElement | null>>([])
  const [active, setActive] = useState(0)
  const [plugged, setPlugged] = useState(false)
  const [told, setTold] = useState(false)
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)
  // Where the cable's middle sits on the stage, so the still before the 3D lines up with it.
  const [middle, setMiddle] = useState<number | null>(null)

  // Scroll sets the story's position. The last beat is a landing: once the scroll
  // reaches the plug going in, the page glides to the charging frame on its own and
  // holds there a few seconds, so the plug-in and the charge are seen in full.
  useEffect(() => {
    const el = track.current
    if (!el) return
    let raf = 0
    // The landing: 'free' until the plug goes in; 'gliding' to the frame; 'held' there while the charge gets under way; 'done' until the story is left.
    let landing: 'free' | 'gliding' | 'held' | 'done' = 'free'
    let landTimer = 0
    let glideRaf = 0
    // Where the page is pinned while held (the browser's own leftover wheel glide would push past it).
    let pinnedY = 0
    const read = () => {
      raf = 0
      if (landing === 'held' && Math.abs(window.scrollY - pinnedY) > 0.5) window.scrollTo(0, pinnedY)
      const r = el.getBoundingClientRect()
      const range = r.height - window.innerHeight
      const p = -r.top / range
      const t = storyFromProgress(p)
      target.current = t
      setActive(storyLayer(t))
      setPlugged(t >= 5.6)
      setTold(t >= 6.6)
      // Reaching the plug-in step, on the way down, starts the landing. Leaving the end of the story resets it.
      if (landing === 'free' && t >= 8.2 && t < STORY_STEPS) land(r.top + window.scrollY + progressAtStop(STORY_STEPS) * range)
      else if (landing === 'done' && t < 7.5) landing = 'free'
    }
    const land = (y: number) => {
      landing = 'gliding'
      startScriptedScroll()
      const from = window.scrollY
      const t0 = performance.now()
      const ms = Math.min(900, Math.max(350, Math.abs(y - from) * 1.2))
      const step = (now: number) => {
        const u = Math.min(1, (now - t0) / ms)
        const e = 1 - Math.pow(1 - u, 3)
        window.scrollTo(0, from + (y - from) * e)
        if (u < 1) glideRaf = requestAnimationFrame(step)
        else {
          landing = 'held'
          pinnedY = y
          // Held while the charge gets under way: the page's own scrolling is switched off at the root
          // (which stops the wheel, keys, trackpad and scrollbar alike), then the page is the visitor's again.
          hold(true)
          landTimer = window.setTimeout(() => {
            landing = 'done'
            hold(false)
            endScriptedScroll()
          }, 2800)
        }
      }
      glideRaf = requestAnimationFrame(step)
    }
    const root = document.documentElement
    const hold = (on: boolean) => {
      // Keeps the page's width the same, so nothing shifts when the scrollbar goes.
      root.style.scrollbarGutter = on ? 'stable' : ''
      root.style.overflowY = on ? 'hidden' : ''
    }
    // While gliding, the visitor's wheel and keys are set aside (touch scrolling is not, so phones never feel stuck).
    const block = (e: Event) => {
      if (landing === 'gliding' || landing === 'held') e.preventDefault()
    }
    const onKey = (e: KeyboardEvent) => {
      if ((landing === 'gliding' || landing === 'held') && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'End', 'Home'].includes(e.key)) e.preventDefault()
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('wheel', block, { passive: false })
    window.addEventListener('keydown', onKey)
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting))
    io.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(glideRaf)
      window.clearTimeout(landTimer)
      if (landing === 'held') hold(false)
      if (landing === 'gliding' || landing === 'held') endScriptedScroll()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', block)
      window.removeEventListener('keydown', onKey)
      io.disconnect()
    }
  }, [])

  // The room between the two rows of labels, which the 3D fits the cable into.
  useEffect(() => {
    const box = stage.current
    if (!box) return
    const measure = () => {
      const base = box.getBoundingClientRect()
      const rows = (side: string) => [...box.querySelectorAll<HTMLElement>(`li[data-side="${side}"]`)].map((li) => li.getBoundingClientRect())
      const above = rows('above')
      const below = rows('below')
      if (!above.length || !below.length) return
      const f = {
        top: Math.max(...above.map((r) => r.bottom)) - base.top + CLEAR,
        bottom: Math.min(...below.map((r) => r.top)) - base.top - CLEAR,
      }
      frame.current = f
      setMiddle((f.top + f.bottom) / 2)
    }
    // Measures as soon as it starts observing, and again on every resize.
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  // Label lines: from each label's number, along its edge, then across to its layer.
  useEffect(() => {
    const box = stage.current
    if (!box || !inView || plugged) return
    let raf = 0
    const draw = () => {
      const base = box.getBoundingClientRect()
      const dots = cableLayers.map((_, i) => markers.current[i]?.getBoundingClientRect())
      const ys = (side: 'above' | 'below') =>
        cableLayers.flatMap((l, i) => (l.side === side && dots[i] ? [dots[i]!.top + dots[i]!.height / 2 - base.top] : []))
      const aboveTurn = Math.min(...ys('above')) - 34
      const belowTurn = Math.max(...ys('below')) + 34
      cableLayers.forEach((l, i) => {
        const line = lines.current[i]
        const badge = badges.current[i]
        const dot = dots[i]
        if (!line || !badge || !dot) return
        const a = badge.getBoundingClientRect()
        const above = l.side === 'above'
        const x = a.left + a.width / 2 - base.left
        const y = (above ? a.bottom + 6 : a.top - 6) - base.top
        const turn = above ? aboveTurn : belowTurn
        line.setAttribute('points', `${x},${y} ${x},${turn} ${dot.left + dot.width / 2 - base.left},${dot.top + dot.height / 2 - base.top}`)
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [inView, plugged])

  const dimmed = (i: number) => active !== 0 && active !== i + 1
  const lit = (i: number) => active === i + 1

  return (
    // Full width of the window, breaking out of the page column, and tall enough to scroll through every step.
    <div ref={track} className="relative mx-[calc(50%-50vw)] w-screen" style={{ height: `${100 + STORY_SCREENS * 100}vh` }}>

      <div ref={stage} className="sticky top-0 h-screen overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_55%_at_55%_52%,rgb(255_255_255/0.07),transparent_72%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            backgroundPosition: 'center',
            maskImage: 'radial-gradient(ellipse 55% 60% at 55% 50%, black 15%, transparent 75%)',
          }}
        />

        {/* The cable runs in from the left edge; the fade keeps that edge soft. */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_14%)]">
          <div
            className={`absolute inset-x-0 top-1/2 aspect-[21/9] -translate-y-1/2 transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}
            style={middle === null ? undefined : { top: middle }}
          >
            <Image src="/renders/cable-anatomy.webp" alt="" fill sizes="100vw" className="object-contain" />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <CanvasBoundary onError={onFail}>
              <StoryCanvas target={target} frame={frame} markers={markers} animate={inView} onReady={() => setReady(true)} />
            </CanvasBoundary>
          </div>
        </div>

        {/* Each label's point on the cable, placed by the 3D every frame. */}
        <div aria-hidden="true" className={`transition-opacity duration-500 ${plugged ? 'opacity-0' : 'opacity-100'}`}>
          {cableLayers.map((l, i) => (
            <span
              key={l.id}
              ref={(el) => void (markers.current[i] = el)}
              style={{ visibility: 'hidden' }}
              className="absolute top-0 left-0 flex h-3 w-3 items-center justify-center"
            >
              <span className={`block h-full w-full rounded-full border-2 border-ink-950/70 bg-white transition-[scale,opacity] duration-300 ${lit(i) ? 'scale-150' : dimmed(i) ? 'opacity-40' : ''}`} />
            </span>
          ))}
        </div>
        <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-opacity duration-500 ${plugged ? 'opacity-0' : 'opacity-100'}`}>
          {cableLayers.map((l, i) => (
            <polyline
              key={l.id}
              ref={(el) => void (lines.current[i] = el)}
              fill="none"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className={`transition-[stroke] duration-300 ${lit(i) ? 'stroke-white' : dimmed(i) ? 'stroke-white/10' : 'stroke-white/35'}`}
            />
          ))}
        </svg>

        {/* The five layers, outside in, as one list: 1, 3 and 5 sit above the cable, 2 and 4 below it. */}
        <ol
          className={`container-page absolute inset-x-0 top-[max(12vh,9.5rem)] bottom-[6vh] grid grid-cols-12 grid-rows-[auto_1fr_auto] gap-x-6 transition-opacity duration-500 ${plugged ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        >
          {cableLayers.map((l, i) => (
            <li key={l.id} data-side={l.side} className={`${place[l.id]} ${l.side === 'above' ? 'row-start-1' : 'row-start-3 self-end'} transition-opacity duration-300 ${dimmed(i) ? 'opacity-35' : 'opacity-100'}`}>
              <div className="flex gap-4">
                <span
                  ref={(el) => void (badges.current[i] = el)}
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem] font-semibold transition-colors duration-300 ${
                    lit(i) ? 'border-white bg-white text-ink-950' : 'border-white/30 text-zinc-100'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className={`flex flex-wrap items-center gap-2 font-semibold text-white ${l.momixx ? 'text-lg' : ''}`}>
                    {l.name}
                    {l.momixx && <span className="rounded-full bg-white px-2 py-0.5 text-[0.625rem] font-semibold tracking-wide text-ink-950">MoMixx</span>}
                  </p>
                  <p className={`mt-1 text-sm leading-relaxed ${lit(i) ? 'text-zinc-200' : 'text-zinc-400'}`}>{l.body}</p>
                  {l.momixx && productLink && (
                    <Link href="/products/momixx-mm" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white underline decoration-white/25 underline-offset-4 hover:decoration-white">
                      About MoMixx MM silicone <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* Where you are: the five layers as five dots, then the caption. */}
        <div className="container-page pointer-events-none absolute inset-x-0 bottom-[6vh]">
          <div className={`transition-opacity duration-500 ${plugged ? 'opacity-0' : 'opacity-100'}`}>
            <div aria-hidden="true" className="flex gap-2">
              {cableLayers.map((l, i) => (
                <span key={l.id} className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${lit(i) ? 'w-6 bg-white' : 'w-1.5 bg-white/25'}`} />
              ))}
            </div>
            <p className="mt-4 text-[0.6875rem] text-zinc-500">A typical USB-C cable. Designs vary by maker.</p>
          </div>
        </div>

        {/* The last beat's words. */}
        <div className={`container-page pointer-events-none absolute inset-x-0 top-[max(12vh,9.5rem)] transition-opacity duration-700 ${told ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-md">
            <h3 className="text-3xl font-semibold tracking-[-0.03em]">Plugged in</h3>
            <p className="mt-3 text-lg leading-relaxed text-zinc-300">Power runs through the copper at the centre of the cable, inside the silicone you hold.</p>
          </div>
        </div>
        <p className={`container-page pointer-events-none absolute inset-x-0 bottom-[6vh] text-[0.6875rem] text-zinc-500 transition-opacity duration-700 ${told ? 'opacity-100' : 'opacity-0'}`}>
          Illustration of a USB-C cable charging a phone.
        </p>
      </div>
    </div>
  )
}

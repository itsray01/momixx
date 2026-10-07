'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { heroAnchorFeed, stillAnchors, type CalloutAnchors, type CalloutId, type CalloutPoint } from './calloutAnchors'
import { heroProgress, subscribeHeroProgress } from './three/heroProgress'

const ORDER: CalloutId[] = ['heat', 'fire', 'flex']
/** The story step at which each spec arrives, and the slightly lower one at which it leaves on the way back up. */
const ARRIVE = [0.6, 1.6, 2.6]
const LEAVE = [0.5, 1.5, 2.5]
/** The SCROLL hint only shows with the headline. */
const HINT_UNTIL = 0.3
const LINE_DELAY_MS = 150
const LINE_MS = 600
const COUNT_DELAY_MS = 150
const COUNT_MS = 800
/** Space between the end of a figure and the start of its line. */
const LINE_GAP = 20
/** The site header plus a margin: with reduced motion, a spec above this line is not yet in view. */
const HEADER_CLEAR = 96

const copy = {
  heat: {
    index: '01 · Heat',
    prefix: 'Up to',
    figure: '250\u00A0°C',
    caption: 'MoMixx MM grades, in\u00A0our\u00A0testing',
    count: 250,
  },
  fire: {
    index: '02 · Fire safety',
    prefix: null,
    figure: 'UL VW-1',
    caption: 'Flame-retardant MoMixx silicone jacket, for UL VW-1 cables',
    count: null,
  },
  flex: {
    index: '03 · Durability',
    prefix: null,
    figure: '10,000',
    caption: 'Twisting cycles, in MoMixx testing',
    count: 10000,
  },
}

const easeOut = (t: number) => 1 - (1 - t) ** 3
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const counted = (id: CalloutId, n: number) => (id === 'heat' ? `${n}\u00A0°C` : n.toLocaleString('en-GB'))
/** The children of a spec rise in one after another. */
const rise = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * The home hero's spec story, on desktop. As the pinned hero scrolls, the
 * headline gives way to three specs in its column, one per step (see pins.ts):
 * each rises into its slot and draws a line across to the part of the cable it
 * describes, and the ones before it dim. The dots follow the live cable from
 * the scene's own frame loop; on the still they use fixed points on that image.
 * With reduced motion the hero doesn't pin: the specs are a static list below
 * the headline, beside the cable (see globals.css). Hidden from assistive
 * technology: this overlay is decorative.
 */
export function HeroCallouts() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = root.current
    if (!overlay) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 1024px)')
    const stage = document.querySelector<HTMLElement>('[data-hero-stage]')
    const hint = document.querySelector<HTMLElement>('[data-scroll-hint]')
    const specs = ORDER.map((id) => ({
      id,
      count: copy[id].count,
      el: overlay.querySelector<HTMLElement>(`[data-spec="${id}"]`)!,
      figure: overlay.querySelector<HTMLElement>(`[data-spec="${id}"] [data-figure]`)!,
      value: overlay.querySelector<HTMLElement>(`[data-spec="${id}"] [data-value]`),
      line: overlay.querySelector<SVGLineElement>(`[data-line="${id}"]`)!,
      dot: overlay.querySelector<SVGCircleElement>(`[data-dot="${id}"]`)!,
      ring: overlay.querySelector<SVGCircleElement>(`[data-ring="${id}"]`)!,
      shown: false,
      shownAt: 0,
      countAt: 0,
    }))
    let live: CalloutAnchors | null = null
    let hintShown = true
    let frame = 0

    // The dots, in the overlay's pixels: on the live canvas, or at fixed points on the still.
    const anchors = (box: DOMRect): CalloutAnchors | null => {
      const canvas = stage?.querySelector('canvas')
      if (live && canvas) {
        const c = canvas.getBoundingClientRect()
        const at = (p: CalloutPoint) => ({ x: c.left - box.left + p.x, y: c.top - box.top + p.y })
        return { heat: at(live.heat), fire: at(live.fire), flex: at(live.flex) }
      }
      const img = stage?.querySelector('picture img')
      if (!img) return null
      const r = img.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return null
      const at = (p: CalloutPoint) => ({ x: r.left - box.left + p.x * r.width, y: r.top - box.top + p.y * r.height })
      return { heat: at(stillAnchors.heat), fire: at(stillAnchors.fire), flex: at(stillAnchors.flex) }
    }

    /** Draws every line and number for this moment; true while anything is still moving. */
    const draw = (now = performance.now()) => {
      const box = overlay.getBoundingClientRect()
      const points = anchors(box)
      let busy = false
      for (const spec of specs) {
        if (spec.countAt && spec.value) {
          const t = clamp01((now - spec.countAt - COUNT_DELAY_MS) / COUNT_MS)
          spec.value.textContent = counted(spec.id, Math.round((spec.count ?? 0) * easeOut(t)))
          if (t < 1) busy = true
          else spec.countAt = 0
        }
        const drawn = !spec.shown ? 0 : reduced ? 1 : easeOut(clamp01((now - spec.shownAt - LINE_DELAY_MS) / LINE_MS))
        if (spec.shown && drawn < 1) busy = true
        let visible = drawn > 0 && !!points
        if (visible && reduced) {
          const r = spec.el.getBoundingClientRect()
          visible = r.top >= HEADER_CLEAR && r.bottom <= window.innerHeight
        }
        if (!visible || !points) {
          for (const mark of [spec.line, spec.dot, spec.ring]) mark.style.opacity = '0'
          continue
        }
        // From just past the end of the figure, across to the cable.
        const f = spec.figure.getBoundingClientRect()
        const x1 = f.right - box.left + LINE_GAP
        const y1 = f.top + f.height / 2 - box.top
        const a = points[spec.id]
        spec.line.setAttribute('x1', String(x1))
        spec.line.setAttribute('y1', String(y1))
        spec.line.setAttribute('x2', String(x1 + (a.x - x1) * drawn))
        spec.line.setAttribute('y2', String(y1 + (a.y - y1) * drawn))
        const past = spec.el.dataset.state === 'past'
        spec.line.style.opacity = past ? '0.3' : '0.55'
        const mark = String(clamp01((drawn - 0.8) / 0.2) * (past ? 0.6 : 1))
        for (const m of [spec.dot, spec.ring]) {
          m.setAttribute('cx', String(a.x))
          m.setAttribute('cy', String(a.y))
          m.style.opacity = mark
        }
      }
      return busy
    }

    const tick = (now: number) => {
      frame = 0
      if (draw(now)) frame = window.requestAnimationFrame(tick)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(tick)
    }

    const onAnchors = (next: CalloutAnchors | null) => {
      live = next
      draw()
    }
    // Project only while a line is on screen, and only on desktop, so phones do no extra work.
    const attach = () => {
      const wanted = desktop.matches && specs.some((s) => s.shown)
      heroAnchorFeed.listener = wanted ? onAnchors : null
      if (!wanted) live = null
    }

    const sync = () => {
      const step = heroProgress.value
      if (hint && step < HINT_UNTIL !== hintShown) {
        hintShown = !hintShown
        hint.style.opacity = hintShown ? '' : '0'
      }
      let changed = false
      specs.forEach((spec, i) => {
        const shown = spec.shown ? step >= LEAVE[i] : step >= ARRIVE[i]
        if (shown === spec.shown) return
        changed = true
        spec.shown = shown
        if (!shown) return
        spec.shownAt = performance.now()
        // The numbers count up the first time they arrive.
        if (spec.value && spec.count !== null && !spec.el.dataset.counted) {
          spec.el.dataset.counted = 'true'
          spec.countAt = spec.shownAt
          spec.value.textContent = counted(spec.id, 0)
        }
      })
      if (!changed) return
      const active = specs.map((s) => s.shown).lastIndexOf(true)
      specs.forEach((spec, i) => (spec.el.dataset.state = !spec.shown ? 'hidden' : i === active ? 'active' : 'past'))
      attach()
      heroAnchorFeed.kick?.()
      schedule()
    }

    // With reduced motion the hero doesn't pin, so the steps never come: the
    // specs are a static list, and each line shows while its spec is in view.
    const onScroll = () => schedule()
    let unsubscribe = () => {}
    if (reduced) {
      for (const spec of specs) spec.shown = true
      attach()
      heroAnchorFeed.kick?.()
      schedule()
      window.addEventListener('scroll', onScroll, { passive: true })
    } else {
      sync()
      unsubscribe = subscribeHeroProgress(sync)
    }

    desktop.addEventListener('change', attach)
    const resize = new ResizeObserver(() => {
      heroAnchorFeed.kick?.()
      schedule()
    })
    resize.observe(overlay)
    if (stage) resize.observe(stage)
    for (const spec of specs) resize.observe(spec.figure)

    return () => {
      unsubscribe()
      window.removeEventListener('scroll', onScroll)
      desktop.removeEventListener('change', attach)
      resize.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
      if (heroAnchorFeed.listener === onAnchors) heroAnchorFeed.listener = null
    }
  }, [])

  return (
    <div ref={root} data-hero-callouts aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        {ORDER.map((id) => (
          <g key={id}>
            <line data-line={id} stroke="white" strokeWidth={1} />
            <circle data-ring={id} r={8} fill="white" fillOpacity={0.16} />
            <circle data-dot={id} r={3} fill="white" />
          </g>
        ))}
      </svg>
      {/* The headline's column: the same left edge and width, and the same space above and below. */}
      <div data-spec-column className="absolute inset-x-0 top-0 container-page flex h-full flex-col justify-center pt-24 pb-24">
        <div className="flex max-w-[min(44vw,38rem)] flex-col gap-[clamp(1.5rem,5svh,3.5rem)]">
          {ORDER.map((id) => {
            const item = copy[id]
            return (
              <div key={id} data-spec={id} data-state="hidden" className="w-max max-w-full">
                <p style={rise(0)} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                  <span className="h-px w-6 bg-zinc-500" />
                  {item.index}
                </p>
                {item.prefix && (
                  <p style={rise(1)} className="mt-3 text-sm font-medium text-zinc-300">
                    {item.prefix}
                  </p>
                )}
                <p
                  style={rise(1)}
                  className={`${item.prefix ? 'mt-1' : 'mt-3'} font-display text-[clamp(2.75rem,3.6vw,4rem)] leading-none font-semibold tracking-[-0.045em] text-white tabular-nums`}
                >
                  {item.count !== null ? (
                    // The final figure, invisible, holds the width so the count never moves the line.
                    <span data-figure className="relative inline-block whitespace-nowrap">
                      <span className="invisible">{item.figure}</span>
                      <span data-value className="absolute inset-0">
                        {item.figure}
                      </span>
                    </span>
                  ) : (
                    <span data-figure className="inline-block whitespace-nowrap">
                      {item.figure}
                    </span>
                  )}
                </p>
                <p style={rise(2)} className="mt-3 max-w-[17rem] text-[15px] leading-snug text-balance text-zinc-300">
                  {item.caption}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

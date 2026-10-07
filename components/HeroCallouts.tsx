'use client'

import { useEffect, useRef } from 'react'
import { heroAnchorFeed, heroCalloutsRevealed, stillAnchors, subscribeHeroCallouts, type CalloutAnchors, type CalloutId } from './calloutAnchors'

const ORDER: CalloutId[] = ['heat', 'fire', 'flex']
const STAGGER_MS = 150
const LINE_MS = 500
const TEXT_MS = 800
const TOTAL_MS = (ORDER.length - 1) * STAGGER_MS + LINE_MS + TEXT_MS

const copy = {
  heat: {
    index: '01 · Heat',
    prefix: 'Up to',
    figure: '250\u00A0°C',
    caption: 'MoMixx MM grades, in\u00A0our\u00A0testing',
    captionWidth: 'max-w-[9rem]',
    count: 250,
    // Beside the upper jacket. The right edge matches Contact us, and stops
    // at 18rem where a wider window would lay the figure on the cable.
    place: 'top-[6.5rem] w-max max-w-[12rem] text-right',
    edge: 'min(18rem, calc(1.75rem + max(0px, (100vw - 74rem) / 2)))',
    side: 'right' as const,
  },
  fire: {
    index: '02 · Fire safety',
    prefix: null,
    figure: 'UL VW-1',
    caption: 'Flame-retardant MoMixx silicone jacket, for UL VW-1 cables',
    captionWidth: 'max-w-[15rem]',
    count: null,
    // Mid-jacket, far enough right that the headline keeps a clear gap.
    place: 'top-[42%] left-14 w-max max-w-[15rem] text-left',
    edge: null,
    side: 'left' as const,
  },
  flex: {
    index: '03 · Durability',
    prefix: null,
    figure: '10,000',
    caption: 'Twisting cycles, in MoMixx testing',
    captionWidth: 'max-w-[15rem]',
    count: 10000,
    // Lower bend, above the colour swatches, on the same left line as fire safety.
    place: 'bottom-[8.25rem] left-14 w-max max-w-[15rem] text-left',
    edge: null,
    side: 'left' as const,
  },
}

const easeOut = (t: number) => 1 - (1 - t) ** 3
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

function phase(elapsed: number, index: number) {
  const start = index * STAGGER_MS
  return {
    line: easeOut(clamp01((elapsed - start) / LINE_MS)),
    text: easeOut(clamp01((elapsed - start - LINE_MS) / TEXT_MS)),
  }
}

/**
 * Engineering-drawing callouts for the home hero cable. Desktop only, and
 * hidden from assistive technology: this overlay is decorative.
 * The dots follow the live cable from the scene's own frame loop; on the still
 * they use fixed points measured on that image.
 */
export function HeroCallouts() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = root.current
    if (!stage) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 1024px)')
    let live: CalloutAnchors | null = null
    let elapsed = -1
    let frame = 0
    let played = false

    const still = (): CalloutAnchors | null => {
      const img = stage.parentElement?.querySelector('picture img')
      if (!img) return null
      const stageRect = stage.getBoundingClientRect()
      const imgRect = img.getBoundingClientRect()
      if (imgRect.width < 2 || imgRect.height < 2) return null
      const point = (id: CalloutId) => ({
        x: imgRect.left - stageRect.left + stillAnchors[id].x * imgRect.width,
        y: imgRect.top - stageRect.top + stillAnchors[id].y * imgRect.height,
      })
      return { heat: point('heat'), fire: point('fire'), flex: point('flex') }
    }

    const draw = () => {
      const anchors = live ?? still()
      if (!anchors || elapsed < 0) return
      ORDER.forEach((id, index) => {
        const node = stage.querySelector<HTMLElement>(`[data-callout="${id}"]`)
        const figure = node?.querySelector<HTMLElement>('[data-figure]')
        const text = node?.querySelector<HTMLElement>('[data-copy]')
        const line = stage.querySelector<SVGLineElement>(`[data-line="${id}"]`)
        const dot = stage.querySelector<SVGCircleElement>(`[data-dot="${id}"]`)
        const ring = stage.querySelector<SVGCircleElement>(`[data-ring="${id}"]`)
        if (!node || !figure || !text || !line || !dot || !ring) return
        const prog = phase(elapsed, index)
        const shown = prog.line > 0 || prog.text > 0
        const stageRect = stage.getBoundingClientRect()
        const block = node.getBoundingClientRect()
        const figureBox = figure.getBoundingClientRect()
        // Stop just under the figure, on the cable-facing side, so the line meets the callout and misses the glyphs.
        const portX = (copy[id].side === 'left' ? block.right : block.left) - stageRect.left
        const portY = figureBox.bottom + 4 - stageRect.top
        const dotPoint = anchors[id]
        const x = dotPoint.x + (portX - dotPoint.x) * prog.line
        const y = dotPoint.y + (portY - dotPoint.y) * prog.line
        line.setAttribute('x1', String(dotPoint.x))
        line.setAttribute('y1', String(dotPoint.y))
        line.setAttribute('x2', String(x))
        line.setAttribute('y2', String(y))
        line.style.opacity = shown ? '1' : '0'
        for (const mark of [dot, ring]) {
          mark.setAttribute('cx', String(dotPoint.x))
          mark.setAttribute('cy', String(dotPoint.y))
          mark.style.opacity = shown ? '1' : '0'
        }
        text.style.opacity = String(prog.text)
        text.style.transform = `translateY(${(1 - prog.text) * 10}px)`
        const target = copy[id].count
        const value = figure.querySelector('[data-value]')
        if (target !== null && value) {
          const n = Math.round(target * prog.text)
          value.textContent = id === 'heat' ? `${n.toLocaleString('en-GB')}\u00A0°C` : n.toLocaleString('en-GB')
        }
      })
    }

    const onAnchors = (anchors: CalloutAnchors | null) => {
      live = anchors
      if (elapsed >= 0) draw()
    }
    // Project only once the callouts are on screen, and only on desktop, so phones do no extra work.
    const attach = () => {
      heroAnchorFeed.listener = desktop.matches && played ? onAnchors : null
    }

    const play = () => {
      if (played) return
      played = true
      stage.dataset.shown = 'true'
      const hint = document.querySelector<HTMLElement>('[data-scroll-hint]')
      if (hint) hint.style.opacity = '0'
      attach()
      heroAnchorFeed.kick?.()
      if (reduced) {
        elapsed = TOTAL_MS
        draw()
        return
      }
      const started = performance.now()
      const tick = (now: number) => {
        elapsed = now - started
        draw()
        if (elapsed < TOTAL_MS) frame = window.requestAnimationFrame(tick)
        else frame = 0
      }
      frame = window.requestAnimationFrame(tick)
    }

    desktop.addEventListener('change', attach)

    // The stylesheet inset matches the nav button. Measure the button too, so a
    // scrollbar cannot leave the figure a few pixels past Contact us.
    const alignHeat = () => {
      const heat = stage.querySelector<HTMLElement>('[data-callout="heat"]')
      const button = [...document.querySelectorAll('header a[href="/contact"]')].find((el) => el.getClientRects().length > 0)
      if (!heat || !button) return
      const inset = Math.min(18 * 16, window.innerWidth - button.getBoundingClientRect().right)
      heat.style.right = `${inset}px`
    }
    alignHeat()

    const resize = new ResizeObserver(() => {
      alignHeat()
      heroAnchorFeed.kick?.()
      if (elapsed >= 0) draw()
    })
    resize.observe(stage)
    const img = stage.parentElement?.querySelector('picture img')
    if (img) resize.observe(img)

    if (reduced) play()
    else if (heroCalloutsRevealed()) play()
    const unsubscribe = subscribeHeroCallouts(play)

    return () => {
      unsubscribe()
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
            <line data-line={id} stroke="white" strokeOpacity={0.35} strokeWidth={1} />
            <circle data-ring={id} r={8} fill="white" fillOpacity={0.16} />
            <circle data-dot={id} r={3} fill="white" />
          </g>
        ))}
      </svg>
      {ORDER.map((id) => {
        const item = copy[id]
        return (
          <div key={id} data-callout={id} style={item.edge ? { right: item.edge } : undefined} className={`absolute ${item.place}`}>
            <div data-copy className="opacity-0">
              <p className="font-mono text-[11px] font-medium tracking-[0.22em] text-zinc-400 uppercase">{item.index}</p>
              {item.prefix && <p className="mt-2 text-sm font-medium text-zinc-400">{item.prefix}</p>}
              <p className="relative mt-1 font-display text-[clamp(2.75rem,2.9vw,3.5rem)] leading-none font-semibold tracking-[-0.045em] text-white tabular-nums">
                {item.count !== null ? (
                  <>
                    <span className="invisible whitespace-nowrap">{item.figure}</span>
                    <span data-figure className={`absolute inset-0 whitespace-nowrap ${item.side === 'right' ? 'text-right' : ''}`}>
                      <span data-value>{item.figure}</span>
                    </span>
                  </>
                ) : (
                  <span data-figure className="whitespace-nowrap">
                    {item.figure}
                  </span>
                )}
              </p>
              <p className={`mt-2 text-[13px] leading-snug text-balance text-zinc-400 ${item.captionWidth} ${item.side === 'right' ? 'ml-auto' : ''}`}>{item.caption}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

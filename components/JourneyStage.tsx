'use client'

import { useEffect, useRef, useState } from 'react'
import { Render } from './Render'
import type { ModelName } from './three/modelNames'
import { rich } from './ui'

export type JourneyStep = { title: string; body: string; model: ModelName; momixx?: boolean }

/** Scroll distance given to each step while the stage holds still, in viewport heights. */
const STEP_VH = 50

/** Where a stop sits along the rail, as a percentage. */
const at = (i: number, n: number) => (i / (n - 1)) * 100

/**
 * Sand to silicone, and back again, told one step at a time.
 *
 * Desktop with motion: the section holds still while you scroll. One large render sits on open black,
 * the step's name and line of text beside it, and a rail of seven stops along the bottom fills as you
 * go. Brackets over the rail mark the steps MoMixx does; at the last step a line curves back from
 * "Back to silicone" to "Silicone", closing the loop. Every stop is a button that scrolls to its step.
 *
 * Phones, reduced motion and no JavaScript: the same steps as a vertical list joined by a line.
 * Screen readers always get that list.
 */
export function JourneyStage({ steps, label, title, intro, tone = 'dark' }: { steps: JourneyStep[]; label: string; title: string; intro: string; tone?: 'dark' | 'muted' }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const n = steps.length
  const bg = tone === 'muted' ? 'bg-ink-900' : 'bg-ink-950'

  // Progress through the held stage, read once per frame while it is on screen.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let frame = 0
    let visible = false
    const update = () => {
      frame = 0
      const r = wrap.getBoundingClientRect()
      const run = r.height - window.innerHeight
      if (run <= 0) return
      const p = Math.min(1, Math.max(0, -r.top / run))
      // The line reaches each stop just as its step comes up.
      fillRef.current?.style.setProperty('--fill', String(Math.min(1, (p * n) / (n - 1))))
      setStep(Math.min(n - 1, Math.floor(p * n)))
    }
    const onScroll = () => {
      if (visible) frame ||= requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) onScroll()
    })
    io.observe(wrap)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [n])

  // A stop scrolls the page to the middle of its step.
  const goTo = (i: number) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const run = wrap.offsetHeight - window.innerHeight
    const top = wrap.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + ((i + 0.5) / n) * run, behavior: 'smooth' })
  }

  // Runs of MoMixx steps, for the brackets over the rail: [first, last] stop indexes.
  const runs: Array<[number, number]> = []
  steps.forEach((s, i) => {
    if (!s.momixx) return
    const last = runs[runs.length - 1]
    if (last && last[1] === i - 1) last[1] = i
    else runs.push([i, i])
  })
  // The loop closes from the last step back to the step that names the material.
  const back = Math.max(0, steps.findIndex((s) => s.title === 'Silicone'))
  const closed = step === n - 1

  return (
    <section aria-label={label} className={`relative ${bg}`}>
      {/* ── Everyone else: a vertical list joined by a line (and the screen-reader version everywhere) ── */}
      <div className="container-page py-20 sm:py-28 lg:motion-safe:sr-only">
        <h2 className="display-lg max-w-3xl">{rich(title)}</h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">{intro}</p>
        <ol className="relative mt-14 space-y-12 border-l border-white/15 pl-8 sm:pl-12">
          {steps.map((s, i) => (
            <li key={s.title} className="relative grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_14rem]">
              <span aria-hidden="true" className={`absolute top-2 -left-[calc(2rem+4.5px)] size-2 rounded-full sm:-left-[calc(3rem+4.5px)] ${s.momixx ? 'bg-white' : 'bg-zinc-600'}`} />
              <div>
                <p className="text-sm text-zinc-500">
                  Step {i + 1} of {n}
                  {s.momixx && <span className="text-gold-600">, by MoMixx</span>}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{s.title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-zinc-400">{s.body}</p>
              </div>
              <div className="max-w-[14rem]">
                <Render name={s.model} sizes="14rem" />
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-xl text-sm text-zinc-500">
          Step {n} leads back to step {back + 1}: recycled silicone starts the loop again.
        </p>
      </div>

      {/* ── Desktop with motion: the held stage ── */}
      <div ref={wrapRef} aria-hidden="true" className="hidden lg:motion-safe:block" style={{ height: `calc(${n * STEP_VH}vh + 100vh)` }}>
        <div className="sticky top-0 flex h-screen min-h-[40rem] flex-col overflow-hidden">
          {/* The same light as the hero, from above. */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_68%_30%,rgb(255_255_255/0.07),transparent_70%)]" />

          <div className="container-page relative flex items-end justify-between gap-10 pt-28 [@media(max-height:50rem)]:pt-24">
            <div>
              <p className="display-md max-w-xl text-white">{rich(title)}</p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-zinc-500 [@media(max-height:50rem)]:hidden">{intro}</p>
            </div>
            <p className="shrink-0 font-display text-base text-zinc-500 tabular-nums">
              <span className="text-gold-600">{String(step + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
            </p>
          </div>

          <div className="container-page relative grid min-h-0 flex-1 grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-12 py-4">
            {/* The words: every step stacked in one cell; the current one shows. */}
            <div className="grid">
              {steps.map((s, i) => (
                <div key={s.title} data-on={i === step || undefined} className="journey-text [grid-area:1/1]">
                  <p className="text-sm text-zinc-500">
                    Step {i + 1} of {n}
                    {s.momixx && <span className="text-gold-600">, by MoMixx</span>}
                  </p>
                  <p className="display-lg mt-3 text-white">{s.title}</p>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-300">{s.body}</p>
                </div>
              ))}
            </div>
            {/* The picture: every render stacked; the current one settles in. */}
            {/* Sized by the space left between the heading and the rail, so it never runs into either on short screens. */}
            <div className="relative h-full max-h-[36rem] min-h-0">
              {steps.map((s, i) => (
                <div key={s.title} data-on={i === step || undefined} className="journey-pic absolute inset-0 py-6">
                  <div className="relative h-full w-full">
                    <Render name={s.model} sizes="(min-width: 1024px) 50vw, 1px" className="absolute inset-0 h-full! w-full! object-contain" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The rail. */}
          <div className="container-page relative pt-4 pb-36">
            <div className="relative mx-6">
              {/* Brackets over the MoMixx steps, drawn like dimension lines. */}
              <div className="relative h-7">
                {runs.map(([a, b]) => (
                  <div
                    key={a}
                    className="absolute bottom-1 h-2.5 border-x border-t border-gold-400/70"
                    style={{ left: `calc(${at(a, n)}% - 1.25rem)`, width: `calc(${at(b, n) - at(a, n)}% + 2.5rem)` }}
                  >
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 -translate-y-full bg-transparent px-2 text-xs whitespace-nowrap text-gold-600">MoMixx</span>
                  </div>
                ))}
              </div>
              {/* The line, and how far along it you are. */}
              <div className="relative h-px bg-white/15">
                <div ref={fillRef} className="journey-fill absolute inset-y-0 left-0 bg-white" />
              </div>
              {/* The stops. */}
              {steps.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  tabIndex={-1}
                  onClick={() => goTo(i)}
                  className="group absolute top-7 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${at(i, n)}%` }}
                >
                  <span
                    className={`block rounded-full transition-all duration-500 ${i === step ? 'size-3 bg-white' : i < step ? 'size-2 bg-white' : 'size-2 border border-white/40 bg-ink-950 group-hover:border-white'}`}
                  />
                  <span className={`absolute top-6 text-sm whitespace-nowrap transition-colors duration-300 ${i === step ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                    {s.title}
                  </span>
                </button>
              ))}
              {/* The loop back: from under "Back to silicone", below the labels, up to under "Silicone". */}
              <svg
                className="journey-loop pointer-events-none absolute top-[4.3rem] h-10 overflow-visible"
                data-on={closed || undefined}
                style={{ left: `${at(back, n)}%`, width: `${at(n - 1, n) - at(back, n)}%` }}
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
              >
                <path d="M100 0 C100 40, 0 40, 0 2" fill="none" stroke="#168447" strokeOpacity="0.8" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
              {/* Its arrowhead, pointing up into "Silicone". */}
              <svg
                className="journey-loop-head pointer-events-none absolute top-[4.15rem] size-2.5 -translate-x-1/2"
                data-on={closed || undefined}
                style={{ left: `${at(back, n)}%` }}
                viewBox="0 0 10 10"
              >
                <path d="M1 7 L5 2 L9 7" fill="none" stroke="#168447" strokeOpacity="0.8" strokeWidth="1.2" />
              </svg>
              <span
                className="journey-loop-head pointer-events-none absolute top-[6.9rem] -translate-x-1/2 text-xs whitespace-nowrap text-zinc-400"
                data-on={closed || undefined}
                style={{ left: `${(at(back, n) + at(n - 1, n)) / 2}%` }}
              >
                Recycled back into silicone
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

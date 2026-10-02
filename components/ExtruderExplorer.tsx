'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { afterLoadIdle, canRun3D } from './three/capability'
import hotspots from './three/extruderHotspots.json'
import { extruderParts, specPart } from './three/extruderParts'

// Three.js only downloads when the explorer scrolls near the viewport, on devices that can run it.
const ExtruderCanvas = dynamic(() => import('./three/ExtruderCanvas'), { ssr: false })

type Spec = { label: string; value: string }
const n = extruderParts.length
const pad = (i: number) => String(i + 1).padStart(2, '0')

/**
 * The vertical extrusion line, part by part. Pick a part (in 3D, on a marker or
 * in the list) to fly to it and read what it does. Without WebGL, the same
 * controls zoom into a pre-rendered image instead.
 */
export function ExtruderExplorer({ specs, photo }: { specs: Spec[]; photo?: { src: string; alt: string } }) {
  const stage = useRef<HTMLDivElement>(null)
  const markers = useRef<Array<HTMLButtonElement | null>>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
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
      cancel()
      io?.disconnect()
    }
  }, [])

  const part = selected === null ? null : extruderParts[selected]
  const partSpecs = part ? specs.filter((s) => specPart[s.label] === part.id) : []
  const step = (d: number) => setSelected((s) => (s === null ? 0 : (s + d + n) % n))
  const focus = selected ?? hovered
  const spot = selected === null ? null : hotspots[extruderParts[selected].id as keyof typeof hotspots]

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Stage */}
        <div ref={stage} className="card relative aspect-[4/3] overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgb(20_159_148/0.16),transparent)]" />
          <div className="dots absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]" />

          {/* Pre-rendered view: what search engines, devices without WebGL and the first paint see */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={spot ? { transform: 'scale(1.8)', transformOrigin: `${spot.x}% ${spot.y}%` } : undefined}
            >
              <Image src="/renders/extruder-line.webp" alt="3D model of the Momixx vertical extrusion line" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain" />
              {extruderParts.map((p, i) => {
                const h = hotspots[p.id as keyof typeof hotspots]
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={`${i + 1}. ${p.name}`}
                    style={{ left: `${h.x}%`, top: `${h.y}%`, scale: spot ? 0.56 : 1 }}
                    className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-mono text-xs font-semibold backdrop-blur transition-colors ${
                      selected === i ? 'border-brand-200 bg-brand-300 text-ink-950' : 'border-brand-300/60 bg-ink-950/70 text-brand-100 hover:bg-brand-400 hover:text-ink-950'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>

          {enabled && (
            <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
              <ExtruderCanvas
                selected={selected}
                hovered={hovered}
                onSelect={setSelected}
                onHover={setHovered}
                animate={visible && !reduced}
                onReady={() => setReady(true)}
                markers={markers}
              />
              {/* Numbered markers, kept on their parts by the 3D scene */}
              {extruderParts.map((p, i) => (
                <button
                  key={p.id}
                  ref={(el) => void (markers.current[i] = el)}
                  type="button"
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`${i + 1}. ${p.name}`}
                  style={{ visibility: 'hidden' }}
                  className={`absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-semibold backdrop-blur transition-[background-color,border-color,color,opacity,box-shadow] duration-300 ${
                    selected === i
                      ? 'border-brand-200 bg-brand-300 text-ink-950 shadow-[0_0_24px_var(--color-brand-300)]'
                      : selected !== null
                        ? 'border-white/20 bg-ink-950/60 text-slate-300 opacity-60 hover:opacity-100'
                        : hovered === i
                          ? 'border-brand-200 bg-brand-400 text-ink-950'
                          : 'border-brand-300/60 bg-ink-950/70 text-brand-100'
                  }`}
                >
                  {selected === null && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full border border-brand-300/40 [animation-duration:2.4s]" />}
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          <p className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/10 bg-ink-950/60 px-3 py-1.5 text-xs text-slate-300 backdrop-blur">
            {ready ? 'Click a part to explore · drag to look around' : 'Select a numbered part to explore'}
          </p>
          {selected !== null && (
            <button type="button" onClick={() => setSelected(null)} className="btn-ghost-dark absolute top-4 right-4 py-1.5 text-xs">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M2 8h12M2 8l4-4M2 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Whole line
            </button>
          )}
        </div>

        {/* Part list, or the selected part's card */}
        <aside className="card flex flex-col p-6 sm:p-7" aria-live="polite">
          {part && selected !== null ? (
            <div key={part.id} className="flex flex-1 flex-col motion-safe:animate-[fade-in_0.4s_ease-out]">
              <p className="font-mono text-xs text-brand-300">
                {pad(selected)} / {pad(n - 1)}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{part.name}</h3>
              <p className="mt-1 text-sm text-brand-200">{part.short}</p>
              <p className="mt-4 leading-relaxed text-slate-300">{part.body}</p>
              {partSpecs.length > 0 && (
                <dl className="mt-6 divide-y divide-white/[0.06] border-y border-white/[0.06]">
                  {partSpecs.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                      <dt className="text-slate-400">{s.label}</dt>
                      <dd className="text-right font-medium text-white">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {part.href && (
                <Link href={part.href} className="mt-5 text-sm font-medium text-brand-300 hover:text-brand-200">
                  See the product <span aria-hidden="true">→</span>
                </Link>
              )}
              <div className="mt-auto flex items-center gap-2 pt-6">
                <button type="button" onClick={() => step(-1)} className="btn-ghost-dark flex-1 py-2 text-xs" aria-label="Previous part">
                  ← Previous
                </button>
                <button type="button" onClick={() => step(1)} className="btn-ghost-dark flex-1 py-2 text-xs" aria-label="Next part">
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">Follow the cable</p>
              <ol className="mt-4 -mx-2 flex-1 space-y-0.5">
                {extruderParts.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(i)}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(i)}
                      onBlur={() => setHovered(null)}
                      className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors ${focus === i ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'}`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-colors ${
                          focus === i ? 'border-brand-300 bg-brand-300 text-ink-950' : 'border-white/15 text-slate-300'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-white">{p.name}</span>
                        <span className="block text-xs text-slate-500">{p.short}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}
        </aside>
      </div>

      {/* Machine specification: each spec points at its part */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="card p-6 sm:p-8">
          <h3 className="text-lg font-semibold tracking-[-0.02em]">Machine specification</h3>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
            {specs.map((s) => {
              const i = extruderParts.findIndex((p) => p.id === specPart[s.label])
              return (
                <div key={s.label}>
                  <dt className="text-xs text-slate-400">
                    {i >= 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(i)
                          stage.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }}
                        className="text-left underline decoration-white/15 underline-offset-4 hover:text-brand-200 hover:decoration-brand-300"
                      >
                        {s.label}
                      </button>
                    ) : (
                      s.label
                    )}
                  </dt>
                  <dd className="mt-1 font-semibold text-white">{s.value}</dd>
                </div>
              )
            })}
          </dl>
        </div>
        {photo && (
          <figure className="card relative overflow-hidden">
            <Image src={photo.src} alt={photo.alt} width={526} height={806} sizes="(min-width: 1024px) 22rem, 100vw" className="mx-auto h-64 w-auto object-contain mix-blend-lighten [mask-image:radial-gradient(70%_70%_at_50%_50%,black_60%,transparent)] lg:h-full lg:max-h-72" />
            <figcaption className="absolute right-3 bottom-3 left-3 rounded-full border border-white/10 bg-ink-950/70 px-3 py-1.5 text-center text-xs text-slate-300 backdrop-blur">
              The real machine
            </figcaption>
          </figure>
        )}
      </div>
    </div>
  )
}

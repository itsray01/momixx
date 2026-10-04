'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CanvasBoundary } from './three/CanvasBoundary'
import { useLazy3D } from './three/useLazy3D'
import { extruderParts, specPart } from './three/extruderParts'

// Three.js only downloads when the explorer scrolls near the viewport, on devices that can run it.
const MachineCanvas = dynamic(() => import('./three/MachineCanvas'), { ssr: false })

type Spec = { label: string; value: string }
const n = extruderParts.length
const pad = (i: number) => String(i + 1).padStart(2, '0')
const zoom = 1.6

const markerClass = (selected: number | null, hovered: number | null, i: number) =>
  selected === i
    ? 'border-brand-200 bg-brand-300 text-ink-950'
    : selected !== null
      ? 'border-white/20 bg-ink-950/60 text-slate-300 opacity-60 hover:opacity-100'
      : hovered === i
        ? 'border-brand-200 bg-brand-400 text-ink-950'
        : 'border-brand-300/60 bg-ink-950/70 text-brand-100'

/**
 * The vertical extruder, part by part. On capable devices it is a 3D model you
 * can drag to turn around; everyone else (and the first paint) sees the photo of
 * the real machine with the same markers. Pick a part to zoom to it and read
 * what it does. Parts of the full line that are not on this machine are listed
 * without a marker.
 */
export function ExtruderExplorer({ specs, photo }: { specs: Spec[]; photo: { src: string; alt: string } }) {
  const { ref: stage, enabled, visible, ready, markReady, reduced } = useLazy3D<HTMLDivElement>()
  const markers = useRef<Array<HTMLButtonElement | null>>([])
  // Keyboard focus follows the selection when the control that was used disappears
  // (choosing from the list swaps it for the part card, and back again).
  const cardHeading = useRef<HTMLHeadingElement>(null)
  const listButtons = useRef<Array<HTMLButtonElement | null>>([])
  const focusNext = useRef<'card' | number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [view, setView] = useState<'3d' | 'photo'>('3d')

  const part = selected === null ? null : extruderParts[selected]
  const partSpecs = part ? specs.filter((s) => specPart[s.label] === part.id) : []
  const step = (d: number) => setSelected((s) => (s === null ? 0 : (s + d + n) % n))
  const chooseFromList = (i: number) => {
    focusNext.current = 'card'
    setSelected(i)
  }
  const backToMachine = () => {
    focusNext.current = selected
    setSelected(null)
  }
  useEffect(() => {
    const f = focusNext.current
    focusNext.current = null
    if (f === 'card') cardHeading.current?.focus({ preventScroll: true })
    else if (typeof f === 'number') listButtons.current[f]?.focus({ preventScroll: true })
  }, [selected])
  const focus = selected ?? hovered
  const live = ready && view === '3d'
  const spot = live ? undefined : part?.photo
  const onMachine = live ? Boolean(part?.machine) : Boolean(part?.photo)

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Stage */}
        <div ref={stage} className="card relative aspect-[4/5] overflow-hidden sm:aspect-[4/3]">
          <div className="dots absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]" />

          {/* Photo of the real machine: what search engines, devices without WebGL and the first paint see */}
          <div className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-700 sm:p-6 ${live ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
            <div
              className="relative aspect-[526/806] h-full transition-transform duration-700 ease-out"
              style={spot ? { transform: `translate(${(50 - spot.x) * zoom}%, ${(50 - spot.y) * zoom}%) scale(${zoom})` } : undefined}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 40vw, 80vw" className="object-contain mix-blend-lighten" />
              {extruderParts.map((p, i) =>
                p.photo ? (
                  <button
                    key={p.id}
                    type="button"
                    tabIndex={live ? -1 : undefined}
                    onClick={() => setSelected(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={`${i + 1}. ${p.name}`}
                    aria-pressed={selected === i}
                    style={{ left: `${p.photo.x}%`, top: `${p.photo.y}%`, scale: spot ? 1 / zoom : 1 }}
                    className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-mono text-xs font-semibold backdrop-blur transition-[background-color,border-color,color,opacity,box-shadow,scale] duration-300 ${markerClass(selected, hovered, i)}`}
                  >
                    {selected === null && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full border border-brand-300/40 [animation-duration:2.4s]" />}
                    {i + 1}
                  </button>
                ) : null,
              )}
            </div>
          </div>

          {enabled && (
            <div className={`absolute inset-0 transition-opacity duration-700 ${live ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              <CanvasBoundary>
                <MachineCanvas
                  selected={selected}
                  hovered={hovered}
                  onSelect={setSelected}
                  onHover={setHovered}
                  animate={visible && !reduced && view === '3d'}
                  onReady={markReady}
                  markers={markers}
                />
              </CanvasBoundary>
              {/* Numbered markers, kept on their parts by the 3D scene */}
              {extruderParts.map((p, i) =>
                p.machine ? (
                  <button
                    key={p.id}
                    ref={(el) => void (markers.current[i] = el)}
                    type="button"
                    tabIndex={live ? undefined : -1}
                    onClick={() => setSelected(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={`${i + 1}. ${p.name}`}
                    aria-pressed={selected === i}
                    style={{ visibility: 'hidden' }}
                    className={`absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-semibold backdrop-blur transition-[background-color,border-color,color,opacity,box-shadow] duration-300 ${markerClass(selected, hovered, i)}`}
                  >
                    {selected === null && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full border border-brand-300/40 [animation-duration:2.4s]" />}
                    {i + 1}
                  </button>
                ) : null,
              )}
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
            {ready && (
              <div role="group" aria-label="View" className="flex rounded-full border border-white/10 bg-ink-950/70 p-0.5 text-xs backdrop-blur">
                {(['3d', 'photo'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                    className={`rounded-full px-3 py-1 transition-colors ${view === v ? 'bg-white text-ink-950' : 'text-slate-300 hover:text-white'}`}
                  >
                    {v === '3d' ? '3D' : 'Photo'}
                  </button>
                ))}
              </div>
            )}
            {part && !onMachine && (
              <p className="pointer-events-none rounded-full border border-white/10 bg-ink-950/70 px-3 py-1.5 text-xs text-slate-300 backdrop-blur">
                Not in this photo · part of the full vertical line
              </p>
            )}
          </div>
          <p className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/10 bg-ink-950/60 px-3 py-1.5 text-xs text-slate-300 backdrop-blur">
            {live ? '3D model · drag to turn the machine, click a part to explore' : 'The real machine · select a numbered part to explore'}
          </p>
          {selected !== null && (
            <button type="button" onClick={backToMachine} className="btn-ghost-dark absolute top-4 right-4 py-1.5 text-xs">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M2 8h12M2 8l4-4M2 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Whole machine
            </button>
          )}
        </div>

        {/* Part list, or the selected part's card */}
        <aside className="card flex flex-col p-6 sm:p-7" aria-label="Machine parts">
          {part && selected !== null ? (
            <div key={part.id} className="flex flex-1 flex-col motion-safe:animate-[fade-in_0.4s_ease-out]">
              <p className="font-mono text-xs text-slate-500">
                {pad(selected)} / {pad(n - 1)}
              </p>
              <h3 ref={cardHeading} tabIndex={-1} aria-live="polite" className="mt-3 text-2xl font-semibold tracking-[-0.03em] focus:outline-none">
                {part.name}
              </h3>
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
                      ref={(el) => void (listButtons.current[i] = el)}
                      type="button"
                      onClick={() => chooseFromList(i)}
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
      <div className="card p-6 sm:p-8">
        <h3 className="text-lg font-semibold tracking-[-0.02em]">Key numbers</h3>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
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
                        stage.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
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
    </div>
  )
}

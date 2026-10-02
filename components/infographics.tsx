import { Render } from './Render'
import { Scene3D } from './three/Scene3D'
import type { ModelName } from './three/modelNames'

// ───────────────────────── Recycling ─────────────────────────

export const recycleSteps = [
  { title: 'Collect scrap', body: 'Factory offcuts (post-industrial) and used products (post-consumer) that would otherwise go to landfill.' },
  { title: 'Break it down', body: 'High-temperature depolymerisation splits the silicone back into its molecular building blocks.' },
  { title: 'Recover DMC', body: 'The vapour is cooled into a liquid called DMC (dimethylcyclosiloxane), then filtered several times.' },
  { title: 'Make silicone oil', body: 'Purified DMC is rebuilt into silicone oil, the same base used for virgin silicone.' },
  { title: 'New silicone', body: 'We compound the oil into new, high-performance silicone, traceable batch by batch.' },
]

/** The five recycling steps as a numbered list. */
export function RecycleSteps({ compact = false }: { compact?: boolean }) {
  return (
    <ol data-reveal="stagger" className="relative space-y-0">
      {recycleSteps.map((s, i) => (
        <li key={s.title} className="group relative grid grid-cols-[3rem_1fr] gap-4 border-t border-white/[0.08] py-5 first:border-t-0">
          <span className="font-mono text-sm text-brand-300">0{i + 1}</span>
          <div>
            <h3 className="text-lg font-medium tracking-[-0.02em] text-white">{s.title}</h3>
            {!compact && <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Live 3D recycling ring with the five steps placed around it. */
export function RecycleOrbit() {
  // Step chips sit on an ellipse around the ring (percent positions).
  const spots = [
    { left: '50%', top: '6%' },
    { left: '90%', top: '36%' },
    { left: '76%', top: '90%' },
    { left: '24%', top: '90%' },
    { left: '10%', top: '36%' },
  ]
  return (
    <div>
      <div className="relative mx-auto hidden aspect-[16/10] max-w-5xl md:block">
        <div className="absolute inset-x-[22%] inset-y-[14%]">
          <Scene3D variant="recycle" className="h-full" fallback={<Render name="recycle" className="h-full w-full object-contain" />} />
        </div>
        {recycleSteps.map((s, i) => (
          <div
            key={s.title}
            data-reveal
            className="glass absolute w-56 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-4"
            style={{ left: spots[i].left, top: spots[i].top }}
          >
            <p className="font-mono text-xs text-brand-300">0{i + 1}</p>
            <p className="mt-1 font-medium text-white">{s.title}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 hidden text-center text-sm text-slate-400 md:block">
        A closed loop for silicone, certified under <span className="text-white">GRS · ISCC PLUS · SCS</span>
      </p>
      <div className="mt-12">
        <RecycleSteps />
      </div>
    </div>
  )
}

// ───────────────────────── Sand to silicone ─────────────────────────

export const journey: Array<{ title: string; body: string; model: ModelName; momixx?: boolean }> = [
  { title: 'Sand', body: 'Quartz sand is silicon dioxide (SiO₂), one of the most abundant materials on Earth.', model: 'sand' },
  { title: 'Silicon', body: 'Heated in a furnace, quartz becomes silicon: the element that also goes into computer chips.', model: 'chip' },
  { title: 'Silicone', body: 'Silicon is combined with oxygen, carbon and hydrogen into long, flexible chains.', model: 'molecule' },
  { title: 'Momixx compound', body: 'We blend silicone with additives for fire safety, colour, strength or feel.', model: 'samples', momixx: true },
  { title: 'Your product', body: 'Cables, seals, cases, medical parts and more, made by our customers.', model: 'cable' },
]

/** Sand → product, as a pinned horizontal scroll on desktop and a list on mobile. */
export function JourneyScroll() {
  return (
    <div data-hscroll className="relative overflow-hidden lg:flex lg:h-screen lg:items-center">
      <div data-hscroll-track className="flex flex-col gap-5 px-4 sm:px-6 lg:w-max lg:flex-row lg:gap-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {journey.map((step, i) => (
          <article key={step.title} className="card relative flex w-full shrink-0 flex-col overflow-hidden lg:h-[70vh] lg:max-h-[640px] lg:w-[min(560px,42vw)]">
            <div className="relative flex flex-1 items-center justify-center px-8 pt-8">
              <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 50% 45%, rgb(20 159 148 / 0.18), transparent)' }} />
              <Render name={step.model} className="relative max-h-[300px] w-auto object-contain" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <div className="relative p-8 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-brand-300">Step 0{i + 1}</span>
                {step.momixx && <span className="rounded-full bg-brand-400 px-2.5 py-0.5 text-[11px] font-semibold text-ink-950">Momixx</span>}
              </div>
              <h3 className="display-md mt-3">{step.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-slate-400">{step.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

// ───────────────────────── Silicon vs silicone ─────────────────────────

export function SiliconVsSilicone() {
  const cols: Array<{ name: string; formula: string; what: string; looks: string; uses: string; model: ModelName; highlight: boolean }> = [
    {
      name: 'Silicon',
      formula: 'Si',
      what: 'A chemical element, number 14 on the periodic table.',
      looks: 'Hard, brittle, grey and shiny.',
      uses: 'Computer chips, solar panels, aluminium alloys.',
      model: 'chip',
      highlight: false,
    },
    {
      name: 'Silicone',
      formula: '[–Si–O–]ₙ',
      what: 'A man-made material built from silicon, oxygen, carbon and hydrogen.',
      looks: 'Soft rubber, liquid, gel or resin; any colour.',
      uses: 'Cables, seals, medical devices, phone cases, cookware. This is what Momixx makes.',
      model: 'samples',
      highlight: true,
    },
  ]
  return (
    <div data-reveal="stagger" className="grid gap-5 md:grid-cols-2">
      {cols.map((c) => (
        <div key={c.name} data-tilt className={`card lift overflow-hidden ${c.highlight ? 'border-brand-400/30' : ''}`}>
          <div className="relative px-10 pt-6">
            <div aria-hidden="true" className="absolute inset-0" style={{ background: `radial-gradient(60% 60% at 50% 50%, ${c.highlight ? 'rgb(20 159 148 / 0.22)' : 'rgb(148 163 184 / 0.1)'}, transparent)` }} />
            <Render name={c.model} className="relative mx-auto max-h-56 w-auto" sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
          <div className="p-8 pt-2">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="display-md">{c.name}</h3>
              <span className="font-serif text-2xl text-slate-400 italic">{c.formula}</span>
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              {(
                [
                  ['What it is', c.what],
                  ['What it looks like', c.looks],
                  ['Used in', c.uses],
                ] as const
              ).map(([k, val]) => (
                <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 border-t border-white/[0.06] pt-4">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="leading-relaxed text-slate-200">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ))}
    </div>
  )
}

import { recyclingCertificationNames } from '@/content/company'
import { Render } from './Render'
import { rich } from './ui'
import type { ModelName } from './three/modelNames'

// ───────────────────────── Recycling ─────────────────────────

export const recycleSteps = [
  { title: 'Collect scrap', body: 'Factory offcuts and used products that would otherwise go to landfill.' },
  { title: 'Break it down', body: 'Heat breaks the silicone back down into its basic building blocks, which rise as a vapour.' },
  { title: 'Collect the liquid', body: 'The vapour cools into a clear liquid (called DMC), which is filtered several times.' },
  { title: 'Make silicone oil', body: 'The clean liquid is rebuilt into silicone oil, the same starting point as brand-new silicone.' },
  { title: 'New silicone', body: 'We turn the oil into new, high-quality silicone. Certified chain-of-custody records cover the recycled content.' },
]

/** The five recycling steps as a numbered list. */
export function RecycleSteps({ compact = false }: { compact?: boolean }) {
  return (
    <ol data-reveal="stagger" className="relative space-y-0">
      {recycleSteps.map((s, i) => (
        <li key={s.title} className="group relative grid grid-cols-[3rem_1fr] gap-4 border-t border-white/[0.08] py-5 first:border-t-0">
          <span className="font-mono text-sm text-slate-500">0{i + 1}</span>
          <div>
            <h3 className="text-lg font-medium tracking-[-0.02em] text-white">{s.title}</h3>
            {!compact && <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

const flowCols: Record<number, string> = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }

/** A short numbered process: a vertical list on phones, a row of steps on a line on desktop. */
export function StepFlow({ steps }: { steps: Array<{ title: string; body: string }> }) {
  return (
    <ol data-reveal="stagger" className={`grid lg:gap-8 ${flowCols[steps.length] ?? 'lg:grid-cols-4'}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="relative grid grid-cols-[3rem_1fr] gap-4 border-t border-white/[0.08] py-5 first:border-t-0 lg:block lg:border-white/15 lg:py-0 lg:pt-6 lg:first:border-t">
          <span aria-hidden="true" className="absolute -top-[3px] left-0 hidden h-1.5 w-1.5 rounded-full bg-brand-300 lg:block" />
          <span className="font-mono text-sm text-slate-500">0{i + 1}</span>
          <div className="lg:mt-4">
            <h3 className="text-lg font-medium tracking-[-0.02em] text-white">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** The five recycling steps as a row of cards. */
export function RecycleFlow() {
  return (
    <div>
      <ol data-reveal="stagger" className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-5">
        {recycleSteps.map((s, i) => (
          <li key={s.title} className="bg-ink-950 p-7">
            <span className="font-mono text-xs text-slate-500">0{i + 1}</span>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-slate-400">
        Recycled content certified under <span className="text-white">{recyclingCertificationNames}</span>
      </p>
    </div>
  )
}

// ───────────────────────── Sand to silicone ─────────────────────────

export const journey: Array<{ title: string; body: string; model: ModelName; momixx?: boolean }> = [
  { title: 'Sand', body: 'Ordinary quartz sand, one of the most common materials on Earth.', model: 'sand' },
  { title: 'Silicon', body: 'Heated in a furnace, the sand becomes silicon: the same element that goes into computer chips.', model: 'chip' },
  { title: 'Silicone', body: 'Silicon is joined with oxygen, carbon and hydrogen into long, bendy chains.', model: 'molecule' },
  { title: 'MoMixx silicone', body: 'We mix in ingredients that add flame retardancy, colour, strength or a particular feel.', model: 'samples', momixx: true },
  { title: 'Shaped on our machines', body: 'Our patented vertical line coats wire with silicone at up to 100 metres a minute.', model: 'extruder-vertical', momixx: true },
  { title: 'Your product', body: 'Cables, seals, cases, medical parts and more, made by our customers.', model: 'data-cable' },
  { title: 'Back to silicone', body: 'Scrap and used parts come back to us, and we rebuild them into certified recycled silicone.', model: 'recycle', momixx: true },
]

/**
 * Sand → product. On desktop the whole section pins and the cards scroll sideways
 * with a progress bar; on phones (and with reduced motion) it is a swipeable row.
 */
export function JourneyScroll({ eyebrow, title, intro, tone = 'dark' }: { eyebrow: string; title: string; intro: string; tone?: 'dark' | 'muted' }) {
  return (
    <div>
      <section data-hscroll className={`relative overflow-hidden py-20 sm:py-24 lg:flex lg:h-screen lg:min-h-[640px] lg:flex-col lg:justify-center lg:py-0 ${tone === 'muted' ? 'bg-ink-900' : 'bg-ink-950'}`}>
        <div className="container-page flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display-lg mt-5">{rich(title)}</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">{intro}</p>
          </div>
          <div className="hidden w-64 shrink-0 lg:block" aria-hidden="true">
            <div className="flex justify-between font-mono text-xs text-slate-500">
              <span>01</span>
              <span>0{journey.length}</span>
            </div>
            <div className="mt-2 h-px bg-white/10">
              <div data-hscroll-progress className="h-px origin-left scale-x-0 bg-white/70" />
            </div>
          </div>
        </div>
        <div data-hscroll-viewport className="mt-10 snap-x snap-mandatory scroll-pl-4 overflow-x-auto [scrollbar-width:none] sm:scroll-pl-6 lg:mt-12 [&::-webkit-scrollbar]:hidden">
          <ol data-hscroll-track className="flex w-max gap-4 px-4 sm:px-6 lg:gap-5 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {journey.map((step, i) => (
              <li
                key={step.title}
                className={`card relative flex w-[78vw] max-w-[380px] shrink-0 snap-start flex-col overflow-hidden lg:h-[min(62vh,560px)] lg:w-[min(420px,30vw)] lg:max-w-none ${step.momixx ? 'border-brand-400/40' : ''}`}
              >
                <div className="relative flex h-52 items-center justify-center px-6 pt-6 lg:h-auto lg:flex-1">
                  <Render name={step.model} className="relative max-h-full w-auto object-contain lg:max-h-[min(34vh,320px)]" sizes="(min-width: 1024px) 30vw, 78vw" />
                </div>
                <div className="relative p-6 pt-4 sm:p-7 sm:pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">Step 0{i + 1}</span>
                    {step.momixx && <span className="rounded-full bg-brand-400 px-2.5 py-0.5 text-[11px] font-semibold text-ink-950">MoMixx</span>}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}

// ───────────────────────── Silicon vs silicone ─────────────────────────

export function SiliconVsSilicone() {
  const cols: Array<{ name: string; formula: string; what: string; looks: string; uses: string; highlight: boolean }> = [
    {
      name: 'Silicon',
      formula: 'Si',
      what: 'A chemical element, number 14 on the periodic table.',
      looks: 'Hard, brittle, grey and shiny.',
      uses: 'Computer chips, solar panels, aluminium alloys.',
      highlight: false,
    },
    {
      name: 'Silicone',
      formula: '[–Si–O–]ₙ',
      what: 'A man-made material built from silicon, oxygen, carbon and hydrogen.',
      looks: 'Soft rubber, liquid, gel or resin; any colour.',
      uses: 'Cables, seals, medical devices, phone cases, cookware. This is what MoMixx makes.',
      highlight: true,
    },
  ]
  return (
    <div data-reveal="stagger" className="grid gap-5 md:grid-cols-2">
      {cols.map((c) => (
        <div key={c.name} className={`card lift overflow-hidden ${c.highlight ? 'border-brand-400/30' : ''}`}>
          <div className="p-8">
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

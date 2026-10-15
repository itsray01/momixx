import type { LucideIcon } from 'lucide-react'
import { Building2, Cable, ClipboardCheck, Droplet, Factory, Flame, FlaskConical, PackageOpen, Recycle, Sparkles } from 'lucide-react'
import { recyclingCertificationNames } from '@/content/company'
import { JourneyStage } from './JourneyStage'
import { FeatureMark } from './ui'
import type { ModelName } from './three/modelNames'

// ───────────────────────── Recycling ─────────────────────────

export const recycleSteps: Array<{ title: string; body: string; icon: LucideIcon }> = [
  { icon: PackageOpen, title: 'Collect scrap', body: 'Factory offcuts and used products that would otherwise go to landfill.' },
  { icon: Flame, title: 'Break it down', body: 'Heat breaks the silicone back down into its basic building blocks, which rise as a vapour.' },
  { icon: Droplet, title: 'Collect the liquid', body: 'The vapour cools into a clear liquid (called DMC), which is filtered several times.' },
  { icon: FlaskConical, title: 'Make silicone oil', body: 'The clean liquid is rebuilt into silicone oil, the same starting point as brand-new silicone.' },
  { icon: Sparkles, title: 'New silicone', body: 'We turn the oil into new, high-quality silicone. Certified chain-of-custody records cover the recycled content.' },
]

/** The five recycling steps as a numbered list. */
export function RecycleSteps({ compact = false }: { compact?: boolean }) {
  return (
    <ol data-reveal="stagger" className="relative space-y-0">
      {recycleSteps.map((s, i) => (
        <li key={s.title} className="group relative grid grid-cols-[3rem_1fr] gap-4 border-t border-white/[0.08] py-5 first:border-t-0">
          <span className="font-mono text-sm text-zinc-500">0{i + 1}</span>
          <div>
            <h3 className="text-lg font-medium tracking-[-0.02em] text-white">{s.title}</h3>
            {!compact && <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{s.body}</p>}
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
          <span className="font-mono text-sm text-zinc-500">0{i + 1}</span>
          <div className="lg:mt-4">
            <h3 className="text-lg font-medium tracking-[-0.02em] text-white">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{s.body}</p>
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
          <li key={s.title} className="group bg-ink-950 p-7 transition-colors duration-300 hover:bg-ink-900">
            <FeatureMark icon={s.icon} index={i} numbered />
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-zinc-400">
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

/** Sand → product → back to silicone, as a held stage on desktop (see JourneyStage). */
export function JourneyScroll({ eyebrow, title, intro, tone = 'dark' }: { eyebrow: string; title: string; intro: string; tone?: 'dark' | 'muted' }) {
  return <JourneyStage steps={journey} label={eyebrow} title={title} intro={intro} tone={tone} />
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
              <span className="font-serif text-2xl text-zinc-400 italic">{c.formula}</span>
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
                  <dt className="text-zinc-500">{k}</dt>
                  <dd className="leading-relaxed text-zinc-200">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ))}
    </div>
  )
}

// ───────────────────────── Company timeline ─────────────────────────

/** One icon per year, chosen to summarise that year's events. */
const yearIcons: Record<number, LucideIcon> = {
  2019: Factory,
  2020: FlaskConical,
  2021: Cable,
  2022: Building2,
  2023: Recycle,
  2024: ClipboardCheck,
  2025: Factory,
  2026: ClipboardCheck,
}

/** Certification and quality-system lines. The milestone wording itself is unchanged. */
function isCertifiedLine(line: string) {
  return line.includes('GRS') || line.includes('ISCC PLUS') || line.includes('ISO 13485')
}

/**
 * Horizontal rail through the dot. It runs across the gap to the next card and
 * stops at the end of each row, so it never sticks out of the grid.
 */
function railClass(index: number, count: number, columns: 3 | 4) {
  const n = index + 1
  const endMd = n % 2 === 0 || n === count
  const endLg = n % columns === 0 || n === count
  return [
    'pointer-events-none absolute top-[5px] left-0 z-0 hidden h-px bg-white/15 md:block',
    endMd ? 'md:right-0' : 'md:-right-10',
    endLg ? 'lg:right-0' : 'lg:-right-8',
  ].join(' ')
}

/** Year cards: one column on phones, two on tablets, and `columns` (default four) from 1024 px. */
export function Timeline({ years, columns = 4 }: { years: Array<{ year: number; items: string[] }>; columns?: 3 | 4 }) {
  return (
    <ol
      data-reveal="stagger"
      className={`relative grid grid-cols-1 gap-y-10 before:absolute before:top-3 before:bottom-8 before:left-[5px] before:w-px before:bg-white/15 before:content-[''] md:grid-cols-2 md:gap-x-10 md:gap-y-14 md:before:hidden ${columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} lg:gap-x-8 lg:gap-y-16`}
    >
      {years.map((m, i) => {
        const Icon = yearIcons[m.year]
        return (
          <li key={m.year} className="relative pl-8 md:pt-8 md:pl-0">
            <span aria-hidden="true" className={railClass(i, years.length, columns)} />
            <span aria-hidden="true" className="absolute top-1.5 left-0 z-10 size-2.5 rounded-full bg-brand-300 md:top-0" />
            <h3 className="text-3xl leading-none font-semibold tracking-[-0.04em] text-white">{m.year}</h3>
            {Icon && (
              <span aria-hidden="true" className="mt-4 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200">
                <Icon className="size-[1.375rem]" strokeWidth={1.5} />
              </span>
            )}
            <ul className="mt-4 space-y-2">
              {m.items.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm leading-snug text-zinc-400">
                  <span aria-hidden="true" className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-zinc-500" />
                  <span className="min-w-0">
                    {line}
                    {isCertifiedLine(line) && (
                      <span className="ml-2 inline-block align-middle rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs font-medium tracking-wide text-zinc-100">
                        Certified
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        )
      })}
    </ol>
  )
}

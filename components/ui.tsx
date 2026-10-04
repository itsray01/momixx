import Link from 'next/link'
import type { ReactNode } from 'react'
import { absoluteUrl } from '@/lib/site'
import { JsonLd } from './JsonLd'

/**
 * Two-tone headings: wrap words in *asterisks* to set them in grey, e.g.
 * "Silicone that *comes back*". `serif` sets them in the silver serif italic
 * instead, which only the home hero uses.
 */
export function rich(text: ReactNode, { serif = false }: { serif?: boolean } = {}): ReactNode {
  if (typeof text !== 'string') return text
  // A heading that is all accent has no first tone to contrast with, so it stays plain white.
  if (!serif && /^\*[^*]+\*$/.test(text)) return text.slice(1, -1)
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <em key={i} className={serif ? 'accent-serif' : 'accent not-italic'}>
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  )
}

/** Plain-text version of a heading for metadata and aria labels. */
export const plain = (text: string) => text.replace(/\*/g, '')

export type Crumb = { href: string; label: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ href: '/', label: 'Home' }, ...items]
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-slate-300">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="transition-colors hover:text-white">
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
        }}
      />
    </>
  )
}

export function GridBackdrop({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-[0.06] ${className}`}
      style={{
        backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 60% 30%, black 10%, transparent 70%)',
      }}
    />
  )
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
  facts,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: ReactNode
  crumbs?: Crumb[]
  /** A few key figures, shown beside the heading on wide screens and under it on phones. */
  facts?: Array<{ value: string; label: string }>
  children?: ReactNode
}) {
  return (
    <section className="grain relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <GridBackdrop />
      <div className={`container-page relative ${facts ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end lg:gap-16' : ''}`}>
        <div className="max-w-4xl">
          {crumbs && <Breadcrumbs items={crumbs} />}
          {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
          <h1 className="display-lg mt-5">{rich(title)}</h1>
          {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">{intro}</div>}
          {children}
        </div>
        {facts && (
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] lg:grid-cols-1">
            {facts.map((f) => (
              // Label first for screen readers; shown under the value.
              <div key={f.label} className="flex flex-col-reverse bg-ink-950/80 px-5 py-4 backdrop-blur">
                <dt className="mt-0.5 text-xs leading-snug text-slate-400">{f.label}</dt>
                <dd className="text-2xl font-semibold tracking-[-0.03em] text-white">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <div className="hairline absolute inset-x-0 bottom-0" />
    </section>
  )
}

export function SectionHeading({ eyebrow, title, intro, align = 'left' }: { eyebrow?: string; title?: string; intro?: ReactNode; align?: 'left' | 'center' }) {
  if (!eyebrow && !title && !intro) return null
  return (
    <div data-reveal className={`mb-12 max-w-3xl sm:mb-16 ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && <h2 className="display-lg mt-5">{rich(title)}</h2>}
      {intro && <div className="mt-5 text-lg leading-relaxed text-slate-300 sm:text-xl">{intro}</div>}
    </div>
  )
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  tone = 'white',
  align,
  className = '',
}: {
  id?: string
  eyebrow?: string
  title?: string
  intro?: ReactNode
  children?: ReactNode
  /** white = base surface, muted = slightly raised, dark = raised with grain */
  tone?: 'white' | 'muted' | 'dark'
  align?: 'left' | 'center'
  className?: string
}) {
  const toneClass = tone === 'white' ? 'bg-ink-950' : tone === 'muted' ? 'bg-ink-900' : 'grain bg-ink-900'
  return (
    // overflow-x-clip (not hidden) keeps decorative glows in bounds without breaking sticky children.
    <section id={id} className={`relative overflow-x-clip ${toneClass} py-24 sm:py-32 ${className}`}>
      {tone !== 'white' && <div className="hairline absolute inset-x-0 top-0" />}
      <div className="container-page relative">
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} align={align} />
        {children}
      </div>
    </section>
  )
}

const lgCols = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' } as const

export function StatTiles({
  stats,
  cols,
}: {
  stats: Array<{ value: string; label: ReactNode }>
  /** Kept for compatibility; tiles are now plain figures over a hairline. */
  tone?: 'light' | 'dark'
  cols?: keyof typeof lgCols
}) {
  const n = cols ?? (Math.min(Math.max(stats.length, 1), 4) as keyof typeof lgCols)
  return (
    <ul data-reveal="stagger" className={`grid ${n === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-x-8 gap-y-10 sm:grid-cols-2 ${lgCols[n]}`}>
      {stats.map((s) => (
        <li key={s.value} className="flex flex-col border-t border-white/15 pt-6">
          <p
            data-countup
            className={`font-display leading-none font-semibold tracking-[-0.04em] text-balance text-white ${s.value.length > 9 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'}`}
          >
            {s.value}
          </p>
          <p className="mt-3 text-[15px] leading-snug text-slate-400">{s.label}</p>
        </li>
      ))}
    </ul>
  )
}

export function FeatureGrid({ items, cols = 3 }: { items: Array<{ title: string; body: string }>; cols?: 2 | 3 }) {
  return (
    <div data-reveal="stagger" className={`grid gap-x-10 gap-y-12 ${cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map((it, i) => (
        <div key={it.title} className="border-t border-white/15 pt-6">
          <span className="font-mono text-xs text-slate-500">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{it.title}</h3>
          <p className="mt-3 text-base leading-relaxed text-slate-400 sm:text-[17px]">{it.body}</p>
        </div>
      ))}
    </div>
  )
}

export function FaqList({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return (
    <>
      <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {faqs.map((f) => (
          <details key={f.q} className="group py-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
              <h3 className="text-lg font-medium tracking-[-0.02em] sm:text-xl">{f.q}</h3>
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-brand-300 transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
    </>
  )
}

export function CtaBand({
  title = 'Talk to *our team*',
  body = 'Whether you need a material, a machine or a manufacturing partner, we’ll help you find the right silicone for the job.',
  secondary = { href: '/products', label: 'Explore products' },
}: {
  title?: string
  body?: string
  /** The second button: somewhere useful to go next from this page. */
  secondary?: { href: string; label: string }
}) {
  return (
    <section className="relative bg-ink-950 py-28 sm:py-40">
      <div className="hairline absolute inset-x-0 top-0" />
      <div data-reveal className="container-page mx-auto max-w-3xl text-center">
        <h2 className="display-lg">{rich(title)}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="group btn-primary px-6 py-3 text-base">
            Get in touch <Arrow />
          </Link>
          <Link href={secondary.href} className="btn-ghost-dark px-6 py-3 text-base">
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${className}`} aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArrowLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-1.5 font-medium text-brand-300 transition-colors hover:text-brand-200 ${className}`}>
      {children}
      <Arrow />
    </Link>
  )
}

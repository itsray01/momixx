import Link from 'next/link'
import type { ReactNode } from 'react'
import { absoluteUrl } from '@/lib/site'
import { JsonLd } from './JsonLd'

export type Crumb = { href: string; label: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ href: '/', label: 'Home' }, ...items]
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-slate-300">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-white">
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
          itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </>
  )
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
  aside,
}: {
  eyebrow?: string
  title: string
  intro?: ReactNode
  crumbs?: Crumb[]
  children?: ReactNode
  aside?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <GridBackdrop />
      <div className="container-page relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {crumbs && <Breadcrumbs items={crumbs} />}
          {eyebrow && <p className="eyebrow mt-6 text-brand-300">{eyebrow}</p>}
          <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">{title}</h1>
          {intro && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{intro}</div>}
          {children}
        </div>
        {aside && <div className="hidden lg:block">{aside}</div>}
      </div>
    </section>
  )
}

export function GridBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse at 70% 40%, black 20%, transparent 75%)',
      }}
    />
  )
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  tone = 'white',
  className = '',
}: {
  id?: string
  eyebrow?: string
  title?: string
  intro?: ReactNode
  children?: ReactNode
  tone?: 'white' | 'muted' | 'dark'
  className?: string
}) {
  const toneClass = tone === 'muted' ? 'bg-slate-50' : tone === 'dark' ? 'bg-ink-900 text-slate-300' : 'bg-white'
  return (
    <section id={id} className={`${toneClass} py-16 sm:py-24 ${className}`}>
      <div className="container-page">
        {(eyebrow || title || intro) && (
          <div className="mb-10 max-w-3xl sm:mb-14">
            {eyebrow && <p className={`eyebrow ${tone === 'dark' ? 'text-brand-300' : ''}`}>{eyebrow}</p>}
            {title && <h2 className={`mt-3 text-3xl font-extrabold sm:text-4xl ${tone === 'dark' ? 'text-white' : ''}`}>{title}</h2>}
            {intro && <div className={`mt-4 text-lg leading-relaxed ${tone === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{intro}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

const lgCols = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' } as const

export function StatTiles({
  stats,
  tone = 'light',
  cols,
}: {
  stats: Array<{ value: string; label: string }>
  tone?: 'light' | 'dark'
  cols?: keyof typeof lgCols
}) {
  const n = cols ?? (Math.min(Math.max(stats.length, 1), 4) as keyof typeof lgCols)
  return (
    <dl className={`grid ${n === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-px overflow-hidden rounded-2xl ring-1 ${tone === 'dark' ? 'bg-white/10 ring-white/10' : 'bg-slate-200 ring-slate-200'} sm:grid-cols-2 ${lgCols[n]}`}>
      {stats.map((s) => (
        <div key={s.label} className={`flex flex-col-reverse gap-1 p-6 ${tone === 'dark' ? 'bg-ink-900' : 'bg-white'}`}>
          <dt className={`text-sm ${tone === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</dt>
          <dd className={`font-display text-3xl font-extrabold tracking-tight ${tone === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function FeatureGrid({ items, cols = 3 }: { items: Array<{ title: string; body: string }>; cols?: 2 | 3 }) {
  return (
    <div className={`grid gap-6 ${cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map((it, i) => (
        <div key={it.title} className="card p-6">
          <span className="font-display text-sm font-bold text-brand-600">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="mt-3 text-lg font-bold">{it.title}</h3>
          <p className="mt-2 leading-relaxed text-slate-600">{it.body}</p>
        </div>
      ))}
    </div>
  )
}

export function FaqList({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return (
    <>
      <div className="divide-y divide-slate-200 border-y border-slate-200">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-semibold text-slate-900">
              <h3 className="text-lg font-semibold">{f.q}</h3>
              <span aria-hidden="true" className="mt-1 text-brand-600 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
    </>
  )
}

export function CtaBand({
  title = 'Talk to our team',
  body = 'Whether you need a material, a machine or a manufacturing partner, we’ll help you find the right silicone solution.',
}: {
  title?: string
  body?: string
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-12 text-white sm:px-12">
          <GridBackdrop />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold text-white">{title}</h2>
              <p className="mt-3 text-slate-300">{body}</p>
            </div>
            <Link href="/contact" className="btn-primary px-6 py-3 text-base">
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ArrowLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-800 ${className}`}>
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  )
}

import Link from 'next/link'
import type { ReactNode } from 'react'
import { CableColourPicker } from '@/components/CableColourPicker'
import { HeroCallouts } from '@/components/HeroCallouts'
import { HeroSpotlight } from '@/components/HeroSpotlight'
import { ExtruderSection } from '@/components/ExtruderSection'
import { Fn, Footnotes } from '@/components/Footnotes'
import { Intro } from '@/components/Intro'
import { Scene3D } from '@/components/three/Scene3D'
import { Arrow, ArrowLink, BigStats, CtaBand, GridBackdrop, Section, rich } from '@/components/ui'
import { CertMarks } from '@/components/CertMarks'
import { applications } from '@/content/applications'
import { carbonHeadline, circular, hero, loop, pillars, platform, social } from '@/content/home'
import { companyStats, firstLineFootnote } from '@/content/company'
import { products } from '@/content/products'
import { certificationClaim } from '@/content/sustainability'
import { pageMetadata, showPending, site } from '@/lib/site'

export const metadata = {
  ...pageMetadata({
    title: 'MoMixx | Green silicone: certified recycled silicone',
    description:
      'MoMixx makes green silicone: GRS and ISCC PLUS certified recycled silicone that performs like new, plus flame-retardant and PFAS-free grades and cable machines.',
    path: '/',
  }),
  title: { absolute: 'MoMixx | Green silicone: certified recycled silicone' },
}

// Number of material grades across the range, e.g. M3, M4… (derived, so it stays right as grades change).
const gradeCount = products.flatMap((p) => p.models ?? []).length


// Footnotes carry the qualifiers, Apple-style, so the claims above them stay short.
// Numbered in the order they first appear on the page.
const notes = [firstLineFootnote, certificationClaim.footnote]

// The opening statement: the first sentence in white, the rest in grey.
const statement = {
  lead: 'Silicone is the quiet material inside modern technology.',
  rest: 'It withstands heat that softens common plastics, bends again and again without cracking, keeps water out, and is widely used in medicine. We develop it, recycle it and produce it at scale.',
}

// The company figures, with "to our knowledge" moved into footnote 1.
const stats = companyStats.map((s) =>
  s.label.endsWith(', to our knowledge')
    ? {
        ...s,
        label: (
          <>
            {s.label.replace(', to our knowledge', '')}
            <Fn n={1} />
          </>
        ),
      }
    : s,
)

// The three businesses, one large panel each.
const businesses: Array<{ href: string; model: string; kicker: string; title: string; body: ReactNode; cta: string }> = [
  {
    href: '/products#materials',
    model: 'samples',
    kicker: 'Silicone materials',
    title: 'Silicone engineered for each application',
    body: `${gradeCount} grades for cables, electric vehicles, medical devices and other applications, including flame-retardant, PFAS-free and recycled options.`,
    cta: 'Explore materials',
  },
  {
    href: '/products/machines#vertical-extruder',
    model: 'extruder-vertical',
    kicker: 'Machines',
    title: 'Production machinery of our own design',
    body: (
      <>
        Our patented vertical extrusion line coats wire with silicone at up to 100 metres a minute, the first of its kind.
        <Fn n={1} plain />
      </>
    ),
    cta: 'View the extrusion line',
  },
  {
    href: '/products/manufacturing',
    model: 'medical',
    kicker: 'Manufacturing',
    title: 'Finished components at scale',
    body: 'From formulation to finished component, including medical and precision parts manufactured under an ISO 13485 quality management system.',
    cta: 'Manufacturing services',
  },
]

// Pillars still awaiting HQ's evidence appear only on previews.
const shownPillars = pillars.filter((p) => showPending || !p.pending)

/** Marks content still waiting for HQ's evidence. Previews only. */
function PendingTag({ label = 'Awaiting confirmation' }: { label?: string }) {
  return <span className="inline-flex w-fit rounded-full border border-gold-400/45 bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-700">{label}</span>
}

export default function HomePage() {
  return (
    <>
      <Intro />
      {/* ── Hero: pinned on desktop; scrolling turns the cable towards you ── */}
      <div>
        <section data-hero className="grain relative flex flex-col overflow-hidden lg:block lg:h-[100svh] lg:min-h-[560px]">
          <HeroSpotlight />
          <GridBackdrop />
          <div data-decor="" className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_110%,rgb(251_251_249)_30%,transparent)]" aria-hidden="true" />

          {/* The cable: its own right-hand column on desktop, so it never runs under the text. It starts below the
              site header, so the conductors stay in view at every step of the scroll. */}
          <div data-hero-stage className="relative order-2 lg:absolute lg:top-10 lg:right-0 lg:bottom-0 lg:w-1/2">
            <div data-hero-sticky className="lg:absolute lg:inset-0">
              <Scene3D className="mx-auto aspect-[4/3] w-full max-w-[560px] lg:aspect-auto lg:h-full lg:max-w-none" />
              <CableColourPicker className="relative z-20 mt-4 mb-12 lg:absolute lg:inset-x-0 lg:bottom-10 lg:my-0" />
            </div>
          </div>

          {/* The text column spans the hero but lets the pointer through to the cable; only its content takes clicks. */}
          <div data-hero-copy className="pointer-events-none container-page relative z-10 order-1 flex flex-col justify-center pt-32 pb-8 lg:h-full lg:pt-24 lg:pb-24 [@media(max-height:46rem)]:lg:pt-20 [@media(max-height:46rem)]:lg:pb-12">
            <div data-hero-fade className="pointer-events-auto max-w-3xl lg:max-w-[min(46vw,44rem)]">
              <p className="eyebrow">Green silicone</p>
              {/* One sentence per line from tablets up, a notch smaller than the old two-part headline so each fits. */}
              <h1 className="display-hero mt-7 lg:text-[clamp(3rem,min(5.3vw,9.6svh),5.4rem)] [@media(max-height:46rem)]:mt-5">
                {hero.headline.lines.map((l) => (
                  <span key={l} className="sm:block sm:whitespace-nowrap">
                    {l}{' '}
                  </span>
                ))}
                <em className="accent-serif sm:block sm:whitespace-nowrap">{hero.headline.accent}</em>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl [@media(max-height:46rem)]:mt-5 [@media(max-height:46rem)]:sm:text-lg">
                {hero.intro}
              </p>
              <div className="mt-10 flex flex-wrap gap-3 [@media(max-height:46rem)]:mt-7">
                <Link href="/products" className="group btn-primary px-6 py-3 text-base">
                  Explore our solutions <Arrow />
                </Link>
                <Link href="/recycled-silicone" className="btn-ghost-dark px-6 py-3 text-base">
                  Our circular platform
                </Link>
              </div>
            </div>
          </div>

          <HeroCallouts />

          <div data-scroll-hint aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-xs tracking-[0.3em] text-zinc-500 uppercase transition-opacity duration-300 lg:flex">
            Scroll
            <span className="h-10 w-px bg-gradient-to-b from-gold-400 to-transparent" />
          </div>
        </section>
      </div>

      {/* ── Lower carbon: the comparison, straight under the hero (awaiting HQ's assessment details) ── */}
      {showPending && carbonHeadline.pending && (
        <Section id="lower-carbon" eyebrow="Measurable carbon reduction" title={'A smaller footprint. *A\u00a0measurable difference.*'} className="scroll-mt-28">
          <PendingTag />
          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
            <p className="max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
              Our recycled silicone is a lower-carbon alternative to new silicone, helping customers reduce the material footprint of their products.
            </p>
            <figure className="card p-7 sm:p-10">
              <figcaption className="text-sm font-medium text-white">Carbon footprint ({carbonHeadline.unit})</figcaption>
              <div className="mt-8 space-y-6">
                {carbonHeadline.rows.map((r) => (
                  <div key={r.label}>
                    <div className="flex items-baseline justify-between gap-4 text-sm">
                      <span className={r.ours ? 'font-medium text-white' : 'text-zinc-400'}>{r.label}</span>
                      <span className={`tabular-nums ${r.ours ? 'font-semibold text-white' : 'text-zinc-300'}`}>{r.text}</span>
                    </div>
                    <div
                      data-grow
                      className="mt-3 h-7 rounded-r-[4px]"
                      style={{ width: `${(r.bar / 5.4) * 100}%`, background: r.ours ? '#168447' : '#9a9e9a' }}
                      role="img"
                      aria-label={`${r.label}: ${r.text} ${carbonHeadline.unit}`}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs leading-relaxed text-zinc-500">{carbonHeadline.note}</p>
            </figure>
          </div>
        </Section>
      )}

      {/* ── Key figures ── */}
      <section className="glass-field bg-ink-950 py-24 sm:py-32">
        <div className="container-page">
          <p data-reveal className="display-md max-w-5xl text-white">
            {statement.lead} <span className="text-brand-500">{statement.rest}</span>
          </p>
          <div className="mt-20 sm:mt-28">
            <BigStats stats={stats} />
          </div>
        </div>
      </section>

      {/* ── The four strengths, each with its evidence ── */}
      <Section
        id="why-momixx"
        tone="muted"
        eyebrow="Why MoMixx"
        title="Four strengths, *working together*"
        intro="Recycling, performance, process-level visibility and customer access. Each is backed by evidence you can check; together they make our green silicone platform."
        className="scroll-mt-28"
      >
        <ul data-reveal="stagger" className={`grid gap-5 md:grid-cols-2 ${shownPillars.length === 3 ? 'lg:grid-cols-3' : ''}`}>
          {shownPillars.map((p) => (
            <li key={p.id} id={p.id} className="card flex flex-col p-7 sm:p-9">
              {p.pending && <PendingTag />}
              <h3 className={`text-2xl font-semibold tracking-[-0.03em] ${p.pending ? 'mt-5' : ''}`}>{p.title}</h3>
              {p.id === 'recycling' && (
                <p className="mt-4 text-lg leading-snug font-medium tracking-[-0.01em] text-white">
                  {certificationClaim.statement}
                  <Fn n={2} />
                </p>
              )}
              {p.body && <p className="mt-4 leading-relaxed text-zinc-400">{p.body}</p>}
              {showPending && p.pendingBody && (
                <div className="mt-5 rounded-2xl border border-gold-400/35 bg-gold-100/50 p-4">
                  <PendingTag />
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">{p.pendingBody}</p>
                </div>
              )}
              {p.id === 'recycling' && <CertMarks className="mt-8" />}
              <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-8">
                {p.links.map((l) => (
                  <ArrowLink key={l.href} href={l.href}>
                    {l.label}
                  </ArrowLink>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Circular manufacturing: waste back into production ── */}
      <Section id="circular" eyebrow="Circular manufacturing" title="From silicone waste to *new possibilities*" className="scroll-mt-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-20">
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
              {circular.body} {showPending && circular.pendingVision}
            </p>
            {showPending && (
              <div className="mt-4">
                <PendingTag label="Net zero wording awaiting approval" />
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact?topic=Recycling%20partnership" className="group btn-primary px-6 py-3 text-base">
                Discuss a recycling partnership <Arrow />
              </Link>
              <Link href="/recycled-silicone" className="btn-ghost-dark px-6 py-3 text-base">
                How we recycle
              </Link>
            </div>
          </div>
          <ol data-reveal="stagger" aria-label="The circular loop" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {loop.map((step, i) => {
              const Icon = step.icon
              return (
                <li key={step.title} className="card flex items-center gap-4 p-5">
                  <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gold-400/35 bg-gold-100/60 text-gold-700">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-xs font-medium text-gold-600 tabular-nums">Step {i + 1}</span>
                    <span className="block font-semibold tracking-[-0.02em] text-white">{step.title}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </Section>

      {/* ── The platform: green silicone across the markets ── */}
      <Section tone="muted" eyebrow="A platform for customer solutions" title="Lower-carbon materials. *Wider applications.*" intro={platform.intro}>
        <ul data-reveal="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {applications.map((a) => (
            <li key={a.slug}>
              <Link href={`/applications/${a.slug}`} className="group card lift flex h-full items-center justify-between gap-4 p-5">
                <span className="font-semibold tracking-[-0.02em] text-white">{a.name}</span>
                <Arrow />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Three businesses ── */}
      <Section title="Materials, machines and *manufacturing.*" intro="Three complementary businesses: we develop the silicone, build the machinery that processes it, and manufacture finished components.">
        <ul data-reveal="stagger" className="grid gap-5 lg:grid-cols-3">
          {businesses.map((b) => (
            <li key={b.href}>
              <Link href={b.href} className="group card lift flex h-full flex-col">
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <p className="text-sm font-medium text-zinc-400">{b.kicker}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{b.title}</h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-zinc-400 sm:text-[1.0625rem]">{b.body}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                    {b.cta} <Arrow />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-12 max-w-3xl text-lg leading-relaxed text-zinc-300">
          Our silicone is used in phones, electric vehicles, medical devices, AI data centres, robots and semiconductor manufacturing equipment.{' '}
          <ArrowLink href="/applications">View applications</ArrowLink>
        </p>
      </Section>

      {/* ── MoMixx Extruder: interactive 3D ── */}
      <ExtruderSection links />

      {/* ── Social responsibility (awaiting real examples from HQ) ── */}
      {showPending && social.pending && (
        <Section eyebrow="Social responsibility" title="Responsibility begins with *our people*">
          <PendingTag />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">{social.body}</p>
          <ArrowLink href="/culture" className="mt-8">
            Culture and careers
          </ArrowLink>
        </Section>
      )}

      <CtaBand
        title="Build your next solution on a *greener foundation*"
        body="Whether you need an advanced silicone material, an application-specific solution or a recycling partnership, let’s explore what we can achieve together."
      />
      <Footnotes notes={notes} />
    </>
  )
}

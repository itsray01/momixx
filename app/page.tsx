import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { CableColourPicker } from '@/components/CableColourPicker'
import { ExtruderSection } from '@/components/ExtruderSection'
import { Fn, Footnotes } from '@/components/Footnotes'
import { Intro } from '@/components/Intro'
import { JourneyScroll, RecycleSteps } from '@/components/infographics'
import { Scene3D } from '@/components/three/Scene3D'
import { Arrow, ArrowLink, CtaBand, GridBackdrop, Section, StatTiles, rich } from '@/components/ui'
import { companyStats, firstLineFootnote } from '@/content/company'
import { products } from '@/content/products'
import { certificationClaim } from '@/content/sustainability'
import { pageMetadata, site } from '@/lib/site'

export const metadata = {
  ...pageMetadata({
    title: 'MoMixx | High-performance & recycled silicone',
    description: site.description,
    path: '/',
  }),
  title: { absolute: 'MoMixx | High-performance & recycled silicone' },
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
    title: 'Silicone, made for the job',
    body: `${gradeCount} grades for cables, electric vehicles, medical devices and more, including flame-retardant, PFAS-free and recycled options.`,
    cta: 'Explore materials',
  },
  {
    href: '/products/vertical-extruder',
    model: 'extruder-vertical',
    kicker: 'Machines',
    title: 'The machines that shape it',
    body: (
      <>
        Our patented vertical extrusion line coats wire with silicone at up to 100 metres a minute, the first of its kind.
        <Fn n={1} plain />
      </>
    ),
    cta: 'See the line',
  },
  {
    href: '/products#services',
    model: 'medical',
    kicker: 'Manufacturing',
    title: 'Finished parts, in volume',
    body: 'From the recipe to the finished part, including medical and precision parts made under an ISO 13485 quality system.',
    cta: 'Our services',
  },
]

// Call-outs that appear around the cable as the hero scrolls (desktop only).
const heroLabels = [
  { title: 'MoMixx silicone jacket', sub: 'Flame-retardant, for UL VW-1 cables', pos: 'top-[46%] right-[8%]' },
  { title: '10,000 twisting cycles', sub: 'In MoMixx testing', pos: 'bottom-[22%] left-[6%]' },
  { title: 'Up to 250 °C', sub: 'MoMixx MM grades, in our testing', pos: 'top-[12%] right-[14%]' },
]

export default function HomePage() {
  return (
    <>
      <Intro />
      {/* ── Hero: pinned on desktop; scrolling turns the cable towards you ── */}
      <div>
        <section data-hero className="grain relative flex flex-col overflow-hidden lg:block lg:h-[100svh] lg:min-h-[720px]">
          <GridBackdrop />
          <div data-decor="" className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_110%,rgb(5_7_10)_30%,transparent)]" aria-hidden="true" />

          {/* The cable: its own right-hand column on desktop, so it never runs under the text */}
          <div className="relative order-2 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <Scene3D className="mx-auto aspect-[4/3] w-full max-w-[560px] lg:aspect-auto lg:h-full lg:max-w-none" />
            <CableColourPicker className="relative z-20 mt-4 mb-12 lg:absolute lg:inset-x-0 lg:bottom-10 lg:my-0" />
            {heroLabels.map((l) => (
              <div key={l.title} data-hero-label aria-hidden="true" className={`glass absolute hidden rounded-2xl px-4 py-3 lg:block motion-reduce:lg:hidden ${l.pos}`}>
                <p className="text-sm font-medium text-white">{l.title}</p>
                <p className="text-xs text-slate-400">{l.sub}</p>
              </div>
            ))}
          </div>

          {/* The text column spans the hero but lets the pointer through to the cable; only its content takes clicks. */}
          <div className="pointer-events-none container-page relative z-10 order-1 flex flex-col justify-center pt-32 pb-8 lg:h-full lg:pt-24 lg:pb-24">
            <div data-hero-fade className="pointer-events-auto max-w-3xl lg:max-w-[min(44vw,38rem)]">
              <p className="eyebrow">A tech-driven silicone company</p>
              <h1 className="display-xl mt-7">{rich('Silicone, engineered for *what’s next.*', { serif: true })}</h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
                We develop, recycle and process high-performance silicone for the things the world now runs on: phone cables, electric vehicles, medical
                devices, AI data centres and robots.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/products" className="group btn-primary px-6 py-3 text-base">
                  Explore products <Arrow />
                </Link>
                <Link href="/silicone" className="btn-ghost-dark px-6 py-3 text-base">
                  What is silicone?
                </Link>
              </div>
            </div>
          </div>

          <div data-hero-fade aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] tracking-[0.3em] text-slate-500 uppercase lg:flex">
            Scroll
            <span className="h-10 w-px bg-gradient-to-b from-slate-500 to-transparent" />
          </div>
        </section>
      </div>

      {/* ── Statement and key figures ── */}
      <section className="bg-ink-950 py-28 sm:py-40">
        <div className="container-page">
          <p data-reveal className="display-md max-w-5xl text-white">
            {statement.lead} <span className="text-brand-500">{statement.rest}</span>
          </p>
          <div className="mt-20">
            <StatTiles stats={stats} />
          </div>
        </div>
      </section>

      {/* ── Three businesses ── */}
      <Section tone="muted" title="Materials, machines and *manufacturing.*" intro="Three businesses that strengthen each other: we create the silicone, build the machines that shape it, and make finished parts.">
        <ul data-reveal="stagger" className="grid gap-5 lg:grid-cols-3">
          {businesses.map((b) => (
            <li key={b.href}>
              <Link href={b.href} className="group card flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={`/renders/${b.model}.webp`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-7 pb-8 sm:px-8">
                  <p className="text-sm font-medium text-slate-400">{b.kicker}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{b.title}</h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-slate-400 sm:text-[17px]">{b.body}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                    {b.cta} <Arrow />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-12 max-w-3xl text-lg leading-relaxed text-slate-300">
          Our silicone goes into phones, electric vehicles, medical devices, AI data centres, robots and chip-making machines.{' '}
          <ArrowLink href="/applications">Where it goes</ArrowLink>
        </p>
      </Section>

      {/* ── Sand to silicone ── */}
      <JourneyScroll
        eyebrow="From sand to silicone"
        title="Where *silicone* comes from"
        intro="Silicone starts as ordinary sand. MoMixx works at three points along the way: we make silicone for specific jobs, build the machines that shape it, and recycle it at the end of its life."
      />

      {/* ── Sustainability ── */}
      <Section title="Silicone that *comes back.*">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-2xl leading-snug font-semibold tracking-[-0.02em] text-white sm:text-3xl">
              {certificationClaim.statement}
              <Fn n={2} />
            </p>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              Most silicone waste ends up in landfill. We break it down into its basic building blocks and rebuild it into new silicone that performs like
              new. Certified chain-of-custody records cover our recycled content from collected waste to finished silicone.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink href="/sustainability">Our sustainability</ArrowLink>
              <ArrowLink href="/recycled-silicone">The recycling process</ArrowLink>
            </div>
          </div>
          <RecycleSteps />
        </div>
      </Section>

      {/* ── MoMixx Extruder: interactive 3D ── */}
      <ExtruderSection links />

      <CtaBand />
      <Footnotes notes={notes} />
    </>
  )
}

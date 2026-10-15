import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { CableColourPicker } from '@/components/CableColourPicker'
import { HeroCallouts } from '@/components/HeroCallouts'
import { HeroSpotlight } from '@/components/HeroSpotlight'
import { ExtruderSection } from '@/components/ExtruderSection'
import { Fn, Footnotes } from '@/components/Footnotes'
import { Intro } from '@/components/Intro'
import { JourneyScroll, RecycleSteps } from '@/components/infographics'
import { Scene3D } from '@/components/three/Scene3D'
import { Arrow, ArrowLink, BigStats, CtaBand, GridBackdrop, Section, rich } from '@/components/ui'
import { CertMarks } from '@/components/CertMarks'
import { companyStats, firstLineFootnote } from '@/content/company'
import { products } from '@/content/products'
import { certificationClaim } from '@/content/sustainability'
import { pageMetadata, site } from '@/lib/site'

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
              <p className="eyebrow">A technology-driven silicone company</p>
              <h1 className="display-hero mt-7 [@media(max-height:46rem)]:mt-5">
                Silicone, engineered for <em className="accent-serif sm:whitespace-nowrap">a cleaner future.</em>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl [@media(max-height:46rem)]:mt-5 [@media(max-height:46rem)]:sm:text-lg">
                We develop, process and recycle high-performance silicone for the technologies the world depends on: phone cables, electric
                vehicles, medical devices, AI data centres and robots. Our niche is green silicone: certified recycled silicone that performs like new.
              </p>
              <div className="mt-10 flex flex-wrap gap-3 [@media(max-height:46rem)]:mt-7">
                <Link href="/products" className="group btn-primary px-6 py-3 text-base">
                  Explore products <Arrow />
                </Link>
                <Link href="/silicone" className="btn-ghost-dark px-6 py-3 text-base">
                  What is silicone?
                </Link>
              </div>
            </div>
          </div>

          <HeroCallouts />

          <div data-scroll-hint aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.6875rem] tracking-[0.3em] text-zinc-500 uppercase transition-opacity duration-300 lg:flex">
            Scroll
            <span className="h-10 w-px bg-gradient-to-b from-gold-400 to-transparent" />
          </div>
        </section>
      </div>

      {/* ── Statement and key figures ── */}
      <section className="glass-field bg-ink-950 py-28 sm:py-40">
        <div className="container-page">
          <p data-reveal className="display-md max-w-5xl text-white">
            {statement.lead} <span className="text-brand-500">{statement.rest}</span>
          </p>
          <div className="mt-24 sm:mt-32">
            <BigStats stats={stats} />
          </div>
        </div>
      </section>

      {/* ── Green silicone: the niche, straight after the figures ── */}
      <Section id="green-silicone" eyebrow="Green silicone" title="Green silicone, *certified.*" className="scroll-mt-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-2xl leading-snug font-semibold tracking-[-0.02em] text-white sm:text-3xl">
              {certificationClaim.statement}
              <Fn n={2} />
            </p>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              Green silicone is silicone made without making more waste: certified recycled silicone that performs like new, so a cable, a seal or a
              case can carry recycled content without giving anything up. Most silicone waste is sent to landfill. We break it down to its basic
              building blocks and rebuild it into new silicone. Certified chain-of-custody records cover our recycled content from collected waste to
              finished silicone, and any MoMixx silicone can be supplied with recycled content on request.
            </p>
            <CertMarks className="mt-10" />
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink href="/sustainability">Our certificates</ArrowLink>
              <ArrowLink href="/recycled-silicone">Our recycling process</ArrowLink>
              <ArrowLink href="/insights/what-is-green-silicone">What green silicone means</ArrowLink>
            </div>
          </div>
          <RecycleSteps />
        </div>
      </Section>

      {/* ── Three businesses ── */}
      <Section tone="muted" title="Materials, machines and *manufacturing.*" intro="Three complementary businesses: we develop the silicone, build the machinery that processes it, and manufacture finished components.">
        <ul data-reveal="stagger" className="grid gap-5 lg:grid-cols-3">
          {businesses.map((b) => (
            <li key={b.href}>
              {/* Tablets: picture beside the words, one card per row; phones and desktops: picture on top. */}
              <Link href={b.href} className="group card flex h-full flex-col overflow-hidden md:max-lg:flex-row md:max-lg:items-center">
                <div className="relative aspect-[4/3] md:max-lg:w-2/5 md:max-lg:shrink-0">
                  <Image
                    src={`/renders/${b.model}.webp`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="motion-media object-contain p-4"
                  />
                </div>
                <div className="flex flex-1 flex-col px-7 pb-8 sm:px-8 md:max-lg:py-8 md:max-lg:pl-2">
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

      {/* ── Sand to silicone ── */}
      <JourneyScroll
        eyebrow="From sand to silicone"
        title="From sand, and back again"
        intro="Silicone begins as sand. MoMixx operates at three points in that journey: we develop silicone for specific applications, build the machinery that processes it, and recycle it at the end of its service life."
      />

      {/* ── MoMixx Extruder: interactive 3D ── */}
      <ExtruderSection links />

      <CtaBand />
      <Footnotes notes={notes} />
    </>
  )
}

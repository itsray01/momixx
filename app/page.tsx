import Link from 'next/link'
import { ArticleCard } from '@/components/ArticleCard'
import { MarketCard } from '@/components/charts'
import { JourneyScroll, RecycleSteps } from '@/components/infographics'
import { Render } from '@/components/Render'
import { Scene3D } from '@/components/three/Scene3D'
import { Arrow, ArrowLink, CtaBand, Glow, GridBackdrop, Marquee, Section, SectionHeading, StatTiles, rich } from '@/components/ui'
import { applications } from '@/content/applications'
import { certifications } from '@/content/company'
import { getMarket, marketDisclaimer } from '@/content/markets'
import { certificationClaim } from '@/content/sustainability'
import { getArticles } from '@/lib/articles'
import { pageMetadata, site } from '@/lib/site'

export const metadata = {
  ...pageMetadata({
    title: 'Momixx | High-performance & recycled silicone',
    description: site.description,
    path: '/',
  }),
  title: { absolute: 'Momixx | High-performance & recycled silicone' },
}

const featuredMarkets = ['silicone', 'ev-cables', 'humanoid-robots'].map((id) => getMarket(id)!)

const statement =
  'Silicone is the quiet material inside modern technology. It survives heat that melts plastic, bends again and again without cracking, keeps water out, and is gentle enough for medicine. We make it better, cleaner and at scale.'

const heroLabels = [
  { title: 'Momixx silicone jacket', sub: 'Fire-retardant · UL VW-1', pos: 'top-[18%] right-[4%]' },
  { title: '10,000 twist cycles', sub: '2× a high-grade TPE cable', pos: 'top-[30%] left-[8%]' },
  { title: '−60 °C to 250 °C', sub: 'Stays flexible, won’t melt', pos: 'bottom-[16%] right-[8%]' },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero: pinned on desktop; scrolling turns the cable towards you ── */}
      <section data-hero className="grain relative flex flex-col overflow-hidden lg:block lg:h-[100svh] lg:min-h-[720px]">
        <GridBackdrop />
        <Glow className="top-[10%] right-[-8%]" size={1100} />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_110%,rgb(5_7_10)_30%,transparent)]" aria-hidden="true" />

        <div className="relative order-2 lg:absolute lg:inset-0">
          <Scene3D
            variant="hero"
            className="mx-auto aspect-square w-full max-w-[560px] lg:aspect-auto lg:h-full lg:max-w-none"
            fallback={
              <div className="flex h-full w-full items-center lg:justify-end lg:pr-[6%]">
                <Render name="cable" priority className="h-auto w-full object-contain lg:w-[58%]" sizes="(min-width: 1024px) 58vw, 100vw" />
              </div>
            }
          />
        </div>

        <div className="container-page relative z-10 order-1 flex flex-col justify-center pt-32 pb-8 lg:h-full lg:pt-24 lg:pb-24">
          <div data-hero-fade className="max-w-3xl">
            <p className="eyebrow">A tech-driven silicone company</p>
            <h1 className="display-xl mt-7">{rich('Silicone, engineered for *what’s next.*')}</h1>
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

        {heroLabels.map((l) => (
          <div key={l.title} data-hero-label aria-hidden="true" className={`glass absolute hidden rounded-2xl px-4 py-3 lg:block ${l.pos}`}>
            <p className="text-sm font-medium text-white">{l.title}</p>
            <p className="text-xs text-slate-400">{l.sub}</p>
          </div>
        ))}

        <div data-hero-fade aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] tracking-[0.3em] text-slate-500 uppercase lg:flex">
          Scroll
          <span className="h-10 w-px bg-gradient-to-b from-slate-500 to-transparent" />
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="border-y border-white/[0.06] bg-ink-950 py-6">
        <Marquee
          items={[
            'USB-C cables',
            'Electric vehicles',
            'Medical devices',
            'AI data centres',
            'Humanoid robots',
            'Semiconductors',
            'Recycled silicone',
            ...certifications.map((c) => c.short),
          ].map((t) => (
            <span key={t} className="text-lg font-medium tracking-[-0.01em] text-slate-400">
              {t}
            </span>
          ))}
        />
      </div>

      {/* ── Statement ── */}
      <section className="bg-ink-950 py-28 sm:py-40">
        <div className="container-page">
          <p className="eyebrow">Why silicone</p>
          <p data-words className="display-md mt-8 max-w-5xl text-white">
            {statement.split(' ').map((w, i) => (
              <span key={i} data-word>
                {w}{' '}
              </span>
            ))}
          </p>
          <div className="mt-16">
            <StatTiles
              stats={[
                { value: '2018', label: 'founded in Singapore and Malaysia' },
                { value: '20+', label: 'patents granted or pending' },
                { value: 'World first', label: 'vertical silicone data-cable extrusion line' },
                { value: '4', label: 'international certifications' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── What we do: bento ── */}
      <Section tone="muted" eyebrow="What we do" title="Materials, machines and *manufacturing*" intro="Three businesses that reinforce each other: we formulate the silicone, build the machines that process it, and manufacture finished parts.">
        <div data-reveal="stagger" className="grid gap-5 lg:grid-cols-6">
          <BentoTile
            href="/products#materials"
            className="lg:col-span-4 lg:row-span-2"
            model="samples"
            kicker="Silicone materials"
            title="Compounds tuned for the job"
            body="Fire-retardant, PFAS-free, waterproof, self-bonding and colour-matched to within dE94 0.5."
            big
          />
          <BentoTile href="/products/vertical-extruder" className="lg:col-span-2" model="extruder-vertical" kicker="Machines" title="A world-first extrusion line" stat="100 m/min" />
          <BentoTile href="/recycled-silicone" className="lg:col-span-2" model="recycle" kicker="Recycling" title="Certified recycled silicone" stat="GRS · ISCC PLUS · SCS" />
          <BentoTile href="/products/medical-precision-components" className="lg:col-span-3" model="medical" kicker="Medical & precision" title="ISO 13485 manufacturing" stat="Since 2026" />
          <BentoTile href="/products/odm-oem" className="lg:col-span-3" model="oem" kicker="ODM / OEM" title="From formulation to finished part" stat="Volume production in Asia" />
        </div>
      </Section>

      {/* ── Sand to silicone ── */}
      <section className="bg-ink-950 pt-24 sm:pt-32">
        <div className="container-page">
          <SectionHeading eyebrow="From sand to silicone" title="Where *silicone* comes from" intro="Silicone starts as ordinary sand. Momixx works at step four, turning silicone into compounds engineered for a specific job." />
        </div>
        <div className="pb-24 sm:pb-32 lg:pb-0">
          <JourneyScroll />
        </div>
      </section>

      {/* ── Applications ── */}
      <Section tone="muted" eyebrow="Where silicone goes" title="Inside the industries *shaping the future*" intro={<>From the cable in your pocket to the robots on tomorrow’s factory floor. <ArrowLink href="/applications">All applications</ArrowLink></>}>
        <ul data-reveal="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((a) => (
            <li key={a.slug}>
              <Link href={`/applications/${a.slug}`} data-tilt className="group card lift flex h-full flex-col overflow-hidden">
                <div className="relative px-8 pt-6">
                  <div aria-hidden="true" className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(55% 60% at 50% 55%, rgb(20 159 148 / 0.22), transparent)' }} />
                  <Render name={a.illustration} className="relative mx-auto max-h-52 w-auto transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
                <div className="flex flex-1 flex-col p-7 pt-3">
                  <span className="text-xs font-medium text-brand-300">{a.maturity}</span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{a.name}</h3>
                  <p className="mt-2 flex-1 text-slate-400">{a.tagline}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                    Learn more <Arrow />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Recycling ── */}
      <Section eyebrow="Sustainability" title="Silicone that *comes back*">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-square">
            <Glow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={620} />
            <Scene3D variant="recycle" className="h-full" fallback={<Render name="recycle" className="h-full w-full object-contain" />} />
          </div>
          <div>
            <p className="inline-flex items-start gap-3 rounded-2xl border border-brand-400/30 bg-brand-400/10 px-4 py-3 text-sm text-brand-100">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300 shadow-[0_0_8px_var(--color-brand-300)]" />
              {certificationClaim.headline}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              Most silicone waste ends up in landfill. We chemically break it down and rebuild it into new silicone with the same performance, certified and
              traceable batch by batch.
            </p>
            <div className="mt-8">
              <RecycleSteps compact />
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink href="/sustainability">Our sustainability</ArrowLink>
              <ArrowLink href="/recycled-silicone">The recycling process</ArrowLink>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Markets ── */}
      <Section tone="muted" eyebrow="Growing markets" title="Under some of the biggest *growth stories*" intro={<>Independent estimates for some of the markets our materials serve. <ArrowLink href="/markets">All markets and sources</ArrowLink></>}>
        <div data-reveal="stagger" className="grid gap-5 md:grid-cols-3">
          {featuredMarkets.map((m) => (
            <MarketCard key={m.id} market={m} compact />
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate-500">{marketDisclaimer}</p>
      </Section>

      {/* ── Innovation ── */}
      <Section eyebrow="Innovation" title="20+ patents, including a *world first*">
        <div className="card grain relative grid items-center gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-2">
          <Glow className="top-1/2 right-[-10%] -translate-y-1/2" size={700} />
          <div className="relative space-y-5 text-lg leading-relaxed text-slate-300">
            <p>
              We invented the first vertical extrusion machine for high-speed silicone data cables. It coats cable at up to 100 metres a minute, fully
              automated from mixing to inspection, and is supplied to customers including a Fortune Global 500 company.
            </p>
            <p className="text-slate-400">Our patents cover machines, manufacturing processes and material recipes.</p>
            <div className="flex flex-wrap gap-3 pt-3">
              <Link href="/products/vertical-extruder" className="group btn-primary">
                The vertical extruder <Arrow />
              </Link>
              <Link href="/innovation" className="btn-ghost-dark">
                Research & innovation
              </Link>
            </div>
            <div className="pt-6">
              <StatTiles
                cols={2}
                stats={[
                  { value: '100 m/min', label: 'vertical line speed' },
                  { value: '30%', label: 'less energy: our curing oven' },
                  { value: '20×', label: 'lower VOCs: our dip coating' },
                  { value: 'dE94 ≤ 0.5', label: 'colour-match precision' },
                ]}
              />
            </div>
          </div>
          <div className="relative h-[420px] lg:h-[600px]">
            <Scene3D variant="extrusion" className="h-full" fallback={<Render name="extruder-vertical" className="h-full w-full object-contain" />} />
          </div>
        </div>
      </Section>

      {/* ── Latest insights ── */}
      {getArticles().length > 0 && (
        <Section tone="muted" eyebrow="Insights" title="Silicone, *explained*" intro={<>Plain-English articles on silicone, recycling and where it is used. <ArrowLink href="/insights">All insights</ArrowLink></>}>
          <ul data-reveal="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {getArticles()
              .slice(0, 3)
              .map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
          </ul>
        </Section>
      )}

      <CtaBand />
    </>
  )
}

function BentoTile({
  href,
  className = '',
  model,
  kicker,
  title,
  body,
  stat,
  big = false,
}: {
  href: string
  className?: string
  model: Parameters<typeof Render>[0]['name']
  kicker: string
  title: string
  body?: string
  stat?: string
  big?: boolean
}) {
  return (
    <Link href={href} data-tilt className={`group card lift relative flex min-h-[320px] flex-col overflow-hidden p-7 sm:p-8 ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(60% 60% at 70% 40%, rgb(20 159 148 / 0.2), transparent)' }} />
      <div className={`relative flex flex-1 items-center justify-center ${big ? 'py-6' : ''}`}>
        <Render name={model} className={`w-auto transition-transform duration-700 group-hover:scale-[1.05] ${big ? 'max-h-[380px]' : 'max-h-44'}`} sizes={big ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, 100vw'} />
      </div>
      <div className="relative flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-brand-300 uppercase">{kicker}</p>
          <h3 className={`mt-2 font-semibold tracking-[-0.03em] ${big ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>{title}</h3>
          {body && <p className="mt-3 max-w-md text-slate-400">{body}</p>}
          {stat && <p className="mt-2 text-sm text-slate-400">{stat}</p>}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors group-hover:border-brand-300 group-hover:bg-brand-300 group-hover:text-ink-950">
          <Arrow />
        </span>
      </div>
    </Link>
  )
}

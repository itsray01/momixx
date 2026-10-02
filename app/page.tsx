import Link from 'next/link'
import { HeroVisual } from '@/components/HeroVisual'
import { Scene3D } from '@/components/three/Scene3D'
import { Illustration } from '@/components/Illustration'
import { RecycleCycle } from '@/components/infographics'
import { MarketCard } from '@/components/charts'
import { ArrowLink, CtaBand, Glow, GridBackdrop, Section, StatTiles } from '@/components/ui'
import { applications } from '@/content/applications'
import { certifications, companyStats } from '@/content/company'
import { getMarket } from '@/content/markets'
import { categoryIntros, categoryLabels, productsByCategory, type ProductCategory } from '@/content/products'
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

function HeroLabels() {
  const chip = 'glass absolute rounded-xl px-3.5 py-2.5 text-left'
  return (
    <>
      <div className={`${chip} top-[8%] right-[2%]`}>
        <p className="text-sm font-semibold text-white">Momixx silicone jacket</p>
        <p className="text-xs text-slate-400">Fire-retardant · UL VW-1</p>
      </div>
      <div className={`${chip} top-[30%] left-[2%] hidden sm:block`}>
        <p className="text-sm font-semibold text-white">10,000 twist cycles</p>
        <p className="text-xs text-slate-400">2× high-grade TPE</p>
      </div>
      <div className={`${chip} right-[4%] bottom-[4%]`}>
        <p className="text-sm font-semibold text-white">−60 °C to 250 °C</p>
        <p className="text-xs text-slate-400">Stays flexible, won’t melt</p>
      </div>
    </>
  )
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden bg-ink-950 text-white">
        <GridBackdrop />
        <Glow className="top-[40%] right-[12%] -translate-y-1/2 scale-125" />
        <div className="container-page relative grid items-center gap-8 pt-14 pb-16 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pb-24">
          <div>
            <p className="eyebrow text-brand-300">Silicone materials · Recycling · Machines</p>
            <h1 className="mt-5 text-5xl leading-[1.05] font-extrabold text-white sm:text-6xl lg:text-7xl">
              Silicone, engineered for <span className="text-brand-300">what’s next.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              We develop, recycle and process high-performance silicone for the things the world now runs on: phone and laptop cables, electric
              vehicles, medical devices, AI data centres and robots.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary px-6 py-3 text-base">
                Explore products
              </Link>
              <Link href="/silicone" className="btn-ghost-dark px-6 py-3 text-base">
                What is silicone?
              </Link>
            </div>
          </div>
          <Scene3D
            variant="cable"
            className="mx-auto aspect-[560/520] w-full max-w-[600px]"
            fallback={<HeroVisual className="h-full w-full" />}
            overlay={<HeroLabels />}
          />
        </div>
        <div className="relative border-t border-white/10">
          <ul className="container-page flex flex-wrap items-center gap-x-8 gap-y-3 py-5 text-sm text-slate-400">
            <li className="font-semibold text-slate-200">Certified</li>
            {certifications.map((c) => (
              <li key={c.id}>{c.short}</li>
            ))}
            <li className="ml-auto hidden md:block">Singapore · Penang · Dongguan</li>
          </ul>
        </div>
      </section>

      {/* ── Proof ── */}
      <Section>
        <StatTiles stats={companyStats} />
      </Section>

      {/* ── Silicone everywhere ── */}
      <Section
        tone="muted"
        eyebrow="Where silicone goes"
        title="The quiet material inside modern technology"
        intro={
          <>
            Silicone survives heat that melts plastic, bends again and again without cracking, keeps water out, and is gentle enough for medical
            use. That makes it essential in the fastest-growing parts of the economy.{' '}
            <ArrowLink href="/silicone">Silicone explained</ArrowLink>
          </>
        }
      >
        <ul data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((a) => (
            <li key={a.slug}>
              <Link href={`/applications/${a.slug}`} data-tilt className="group card lift flex h-full flex-col overflow-hidden">
                <div className="bg-brand-50/60 px-6 pt-6">
                  <Illustration name={a.illustration} className="h-32 w-full text-slate-800 transition-transform group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold text-brand-700">{a.maturity}</span>
                  <h3 className="mt-1.5 text-xl font-bold">{a.name}</h3>
                  <p className="mt-2 flex-1 text-slate-600">{a.tagline}</p>
                  <span className="mt-4 text-sm font-semibold text-brand-700">
                    Learn more <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── What we do ── */}
      <Section eyebrow="What we do" title="Materials, machines and manufacturing" intro="Three businesses that reinforce each other: we formulate the silicone, build the machines that process it, and manufacture finished parts.">
        <div data-reveal="stagger" className="grid gap-6 lg:grid-cols-3">
          {(['materials', 'equipment', 'services'] as ProductCategory[]).map((cat) => {
            const items = productsByCategory(cat)
            return (
              <div key={cat} className="card lift flex flex-col p-6 sm:p-8">
                <h3 className="text-xl font-bold">{categoryLabels[cat]}</h3>
                <p className="mt-2 text-slate-600">{categoryIntros[cat]}</p>
                <ul className="mt-6 flex-1 space-y-2 border-t border-slate-100 pt-5 text-sm">
                  {items.slice(0, 6).map((p) => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} className="flex justify-between gap-4 text-slate-700 hover:text-brand-700">
                        <span className="font-medium">{p.name}</span>
                        <span aria-hidden="true" className="text-slate-300">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <ArrowLink href={`/products#${cat}`} className="mt-6 text-sm">
                  All {categoryLabels[cat].toLowerCase()}
                </ArrowLink>
              </div>
            )
          })}
        </div>
      </Section>

      {/* ── Recycling ── */}
      <Section
        tone="muted"
        eyebrow="Recycled silicone"
        title="Silicone that comes back"
        intro={
          <>
            Most silicone waste ends up in landfill. We chemically break it down and rebuild it into new silicone with the same performance,
            certified and traceable batch by batch. <ArrowLink href="/recycled-silicone">See the process and certificates</ArrowLink>
          </>
        }
      >
        <RecycleCycle />
      </Section>

      {/* ── Markets ── */}
      <Section
        eyebrow="Growing markets"
        title="Silicone sits under some of the biggest growth stories"
        intro={
          <>
            Independent estimates for some of the markets our materials serve. <ArrowLink href="/markets">All markets and sources</ArrowLink>
          </>
        }
      >
        <div data-reveal="stagger" className="grid gap-6 md:grid-cols-3">
          {featuredMarkets.map((m) => (
            <MarketCard key={m.id} market={m} compact />
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-400">Third-party estimates, not Momixx forecasts. See the markets page for scope and full sources.</p>
      </Section>

      {/* ── Innovation ── */}
      <Section tone="dark" eyebrow="Innovation" title="20+ patents, including a world first">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-lg leading-relaxed">
            <p>
              We invented the first vertical extrusion machine for high-speed silicone data cables. It coats cable at up to 100 metres a minute,
              fully automated from mixing to inspection, and is supplied to customers including a Fortune Global 500 company.
            </p>
            <p className="text-slate-400">Our patents cover machines, manufacturing processes and material recipes.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/products/vertical-extruder" className="btn-primary">
                The vertical extruder
              </Link>
              <Link href="/innovation" className="btn-ghost-dark">
                Research & innovation
              </Link>
            </div>
            <div className="pt-6">
              <StatTiles
                tone="dark"
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
          <div className="relative hidden h-[560px] lg:block">
            <Glow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Scene3D variant="extrusion" className="h-full" fallback={<Illustration name="extruder-vertical" className="h-full w-full text-slate-300" />} />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}

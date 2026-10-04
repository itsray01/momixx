import { getImageProps } from 'next/image'
import Link from 'next/link'
import { ArticleCard } from '@/components/ArticleCard'
import { MarketCard } from '@/components/charts'
import { ExtruderSection } from '@/components/ExtruderSection'
import { JourneyScroll, RecycleSteps } from '@/components/infographics'
import { Scene3D } from '@/components/three/Scene3D'
import { Arrow, ArrowLink, CtaBand, GridBackdrop, Marquee, Section, StatTiles, rich } from '@/components/ui'
import { applications } from '@/content/applications'
import { companyStats, formalCertifications, recyclingCertifications } from '@/content/company'
import { products } from '@/content/products'
import { getMarket, marketDisclaimer } from '@/content/markets'
import { certificationClaim } from '@/content/sustainability'
import { getArticles } from '@/lib/articles'
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

const featuredMarkets = ['silicone', 'ev-cables', 'usb-cables'].map((id) => getMarket(id)!)

const statement =
  'Silicone is the quiet material inside modern technology. It withstands heat that softens common plastics, bends again and again without cracking, keeps water out, and is widely used in medicine. We develop it, recycle it and produce it at scale.'

// Call-outs that appear around the cable as the hero scrolls (desktop only).
const heroLabels = [
  { title: 'MoMixx silicone jacket', sub: 'Flame-retardant, for UL VW-1 cables', pos: 'top-[46%] right-[8%]' },
  { title: '10,000 twisting cycles', sub: 'In MoMixx testing', pos: 'bottom-[22%] left-[6%]' },
  { title: 'Up to 250 °C', sub: 'MoMixx MM grades, in our testing', pos: 'top-[12%] right-[14%]' },
]

/** The hero still: the same view as the live 3D on desktop, a compact cable on phones. */
function HeroStill() {
  const common = { alt: '', sizes: '(min-width: 1024px) 50vw, min(100vw, 560px)' }
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: '/renders/cable-hero.webp', width: 960, height: 1200 })
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: '/renders/data-cable.webp', width: 1200, height: 900, loading: 'eager', fetchPriority: 'high' })
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop} sizes="50vw" />
      <source srcSet={mobile} sizes="min(100vw, 560px)" />
      <img {...rest} alt="" draggable={false} className="h-full w-full object-contain select-none lg:object-cover" />
    </picture>
  )
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero: pinned on desktop; scrolling turns the cable towards you ── */}
      <div>
        <section data-hero className="grain relative flex flex-col overflow-hidden lg:block lg:h-[100svh] lg:min-h-[720px]">
          <GridBackdrop />
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_110%,rgb(5_7_10)_30%,transparent)]" aria-hidden="true" />

          {/* The cable: its own right-hand column on desktop, so it never runs under the text */}
          <div className="relative order-2 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <Scene3D className="mx-auto aspect-[4/3] w-full max-w-[560px] lg:aspect-auto lg:h-full lg:max-w-none" fallback={<HeroStill />} />
            {heroLabels.map((l) => (
              <div key={l.title} data-hero-label aria-hidden="true" className={`glass absolute hidden rounded-2xl px-4 py-3 lg:block motion-reduce:lg:hidden ${l.pos}`}>
                <p className="text-sm font-medium text-white">{l.title}</p>
                <p className="text-xs text-slate-400">{l.sub}</p>
              </div>
            ))}
          </div>

          <div className="container-page relative z-10 order-1 flex flex-col justify-center pt-32 pb-8 lg:h-full lg:pt-24 lg:pb-24">
            <div data-hero-fade className="max-w-3xl lg:max-w-[min(44vw,38rem)]">
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

          <div data-hero-fade aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] tracking-[0.3em] text-slate-500 uppercase lg:flex">
            Scroll
            <span className="h-10 w-px bg-gradient-to-b from-slate-500 to-transparent" />
          </div>
        </section>
      </div>

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
            ...formalCertifications.map((c) => c.short),
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
              stats={companyStats}
            />
          </div>
        </div>
      </section>

      {/* ── What we do: bento ── */}
      <Section tone="muted" eyebrow="What we do" title="Materials, machines and *manufacturing*" intro="Three businesses that help each other: we create the silicone, build the machines that shape it, and make finished parts.">
        <div data-reveal="stagger" className="grid gap-5 lg:grid-cols-6">
          <BentoTile
            href="/products#materials"
            className="lg:col-span-4 lg:row-span-2"
            kicker="Silicone materials"
            title="Silicone made for the job"
            body="A range of silicones, each made for a specific job, from phone cables to electric cars and medical devices."
            tags={['Flame-retardant', 'Waterproof', 'Free of “forever chemicals”', 'Self-bonding to plastic', 'Any colour', 'Recycled option']}
            stat={`${gradeCount} grades`}
            big
          />
          <BentoTile href="/products/vertical-extruder" className="lg:col-span-2" kicker="Machines" title="To our knowledge, a world-first cable line" stat="100 m a minute" />
          <BentoTile href="/recycled-silicone" className="lg:col-span-2" kicker="Recycling" title="Recycled silicone, independently certified" stat={`${recyclingCertifications.length} certifications`} />
          <BentoTile href="/products/medical-precision-components" className="lg:col-span-3" kicker="Medical & precision" title="Medical and precision parts, made under ISO 13485" stat="ISO 13485" />
          <BentoTile href="/products/odm-oem" className="lg:col-span-3" kicker="Contract manufacturing" title="From the recipe to the finished part" stat="Made in volume in Asia" />
        </div>
      </Section>

      {/* ── Sand to silicone ── */}
      <JourneyScroll
        eyebrow="From sand to silicone"
        title="Where *silicone* comes from"
        intro="Silicone starts as ordinary sand. MoMixx works at three points along the way: we make silicone for specific jobs, build the machines that shape it, and recycle it at the end of its life."
      />

      {/* ── Applications ── */}
      <Section tone="muted" eyebrow="Where silicone goes" title="Inside the industries *shaping the future*" intro={<>From the cable in your pocket to the robots on tomorrow’s factory floor. <ArrowLink href="/applications">All applications</ArrowLink></>}>
        <ul data-reveal="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((a) => (
            <li key={a.slug}>
              <Link href={`/applications/${a.slug}`} data-tilt className="group card lift flex h-full flex-col overflow-hidden">
                <div className="flex flex-1 flex-col p-7">
                  <span className="text-xs font-medium text-slate-400">{a.maturity}</span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{a.name}</h3>
                  <p className="mt-2 flex-1 text-slate-400">{a.tagline}</p>
                  <span className="mt-8 inline-flex items-center gap-1.5 border-t border-white/[0.06] pt-5 text-sm font-medium text-white">
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
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="inline-flex items-start gap-3 rounded-2xl border border-brand-400/30 bg-brand-400/10 px-4 py-3 text-sm text-brand-100">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
              {certificationClaim.headline}
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

      {/* ── Markets ── */}
      <Section tone="muted" eyebrow="Markets" title="The industries *we supply*" intro={<>Independent estimates for industries our materials are sold into. They are not forecasts of MoMixx’s business. <ArrowLink href="/markets">All markets and sources</ArrowLink></>}>
        <div data-reveal="stagger" className="grid gap-5 md:grid-cols-3">
          {featuredMarkets.map((m) => (
            <MarketCard key={m.id} market={m} compact />
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate-500">{marketDisclaimer}</p>
      </Section>

      {/* ── MoMixx Extruder: interactive 3D ── */}
      <ExtruderSection links />

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
  kicker,
  title,
  body,
  tags,
  stat,
  big = false,
}: {
  href: string
  className?: string
  kicker: string
  title: string
  body?: string
  tags?: string[]
  stat?: string
  big?: boolean
}) {
  return (
    <Link href={href} data-tilt className={`group card lift relative flex min-h-[240px] flex-col overflow-hidden p-7 sm:p-8 ${className}`}>
      <p className="text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">{kicker}</p>
      {tags && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-slate-300">
              {t}
            </li>
          ))}
        </ul>
      )}
      {stat && <p className={`mt-auto pt-10 font-semibold tracking-[-0.04em] text-white ${big ? 'display-lg' : 'text-3xl sm:text-4xl'}`}>{stat}</p>}
      <div className={`relative flex items-end justify-between gap-6 ${stat ? 'mt-6' : 'mt-auto pt-10'}`}>
        <div>
          <h3 className={`font-semibold tracking-[-0.03em] ${big ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>{title}</h3>
          {body && <p className="mt-3 max-w-md text-slate-400">{body}</p>}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors group-hover:border-brand-300 group-hover:bg-brand-300 group-hover:text-ink-950">
          <Arrow />
        </span>
      </div>
    </Link>
  )
}

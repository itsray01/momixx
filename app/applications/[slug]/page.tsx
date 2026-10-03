import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CableAnatomy } from '@/components/CableAnatomy'
import { MarketCard } from '@/components/charts'
import { TabNav } from '@/components/TabNav'
import { TemperatureRange } from '@/components/TemperatureRange'
import { ArrowLink, CtaBand, FaqList, FeatureGrid, PageHeader, Section } from '@/components/ui'
import { applications, getApplication } from '@/content/applications'
import { getMarket, marketDisclaimer } from '@/content/markets'
import { getProduct } from '@/content/products'
import { pageMetadata } from '@/lib/site'
import { applicationTabs } from '../tabs'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return applications.map((a) => ({ slug: a.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getApplication(slug)
  if (!a) return {}
  return pageMetadata({ title: `Silicone for ${a.name}`, description: `${a.tagline} ${a.intro}`, path: `/applications/${a.slug}`, ownImage: true })
}

export default async function ApplicationPage({ params }: Props) {
  const { slug } = await params
  const a = getApplication(slug)
  if (!a) notFound()

  const relatedProducts = a.products.map(getProduct).filter((p) => p !== undefined)
  const relatedMarkets = a.markets.map(getMarket).filter((m) => m !== undefined)

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/applications', label: 'Applications' },
          { href: `/applications/${a.slug}`, label: a.name },
        ]}
        eyebrow="Application"
        title={a.name}
        intro={a.tagline}
      >
        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3.5 py-1.5 text-xs font-medium text-brand-200">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-300" aria-hidden="true" />
          {a.maturity}
        </p>
      </PageHeader>
      <TabNav tabs={applicationTabs} label="Applications">

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow">The big picture</p>
              <p className="mt-6 text-2xl leading-snug tracking-[-0.02em] text-slate-100 sm:text-[1.7rem]">{a.intro}</p>
              <p className="mt-6 text-sm text-slate-500">
                <span className="font-semibold text-slate-200">Where we are:</span> {a.maturityNote}
              </p>
            </div>
            <div className="card p-7">
              <h2 className="text-base font-semibold">Examples</h2>
              <ul className="mt-4 space-y-2.5 text-slate-300">
                {a.examples.map((e) => (
                  <li key={e} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section tone="muted" eyebrow="Why silicone" title="Why this industry needs *silicone*">
          <FeatureGrid items={a.whySilicone} />
        </Section>

        {a.slug === 'consumer-electronics' && (
          <Section eyebrow="Inside the cable" title="Anatomy of a *silicone cable*" intro="A charging cable has five layers. MoMixx makes the material for the outer one: the soft, flame-retardant silicone jacket you hold.">
            <CableAnatomy />
          </Section>
        )}
        {a.slug === 'electric-vehicles' && (
          <Section eyebrow="Heat and cold" title="A wider *temperature range*" intro="Cables near batteries, motors and chargers run hot, and cars start in freezing weather. Silicone handles both.">
            <TemperatureRange />
          </Section>
        )}

        <Section eyebrow="Market size" title="Industry *context*" intro="Independent estimates for this industry. They are not MoMixx’s addressable market or a forecast of its business.">
          <div data-reveal="stagger" className={`grid gap-6 ${relatedMarkets.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
            {relatedMarkets.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate-400">{marketDisclaimer}</p>
          <ArrowLink href="/markets" className="mt-4 text-sm">
            Compare all markets
          </ArrowLink>
        </Section>

        <Section tone="muted" eyebrow="How MoMixx helps" title="What MoMixx *supplies*">
          <FeatureGrid items={a.ourRole} />
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold">Related products</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {relatedProducts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className="inline-flex rounded-full border border-white/15 bg-ink-900 px-4 py-2 text-sm font-medium text-slate-100 hover:border-brand-500 hover:text-brand-300">
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section eyebrow="Questions" title="Frequently asked *questions*">
          <FaqList faqs={a.faqs} />
        </Section>

      </TabNav>
      <CtaBand title={`Working in *${a.name}?*`} body="Talk to our engineers about materials, testing and supply." />
    </>
  )
}

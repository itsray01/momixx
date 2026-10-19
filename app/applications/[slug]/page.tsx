import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Illustration } from '@/components/Illustration'
import { MarketCard } from '@/components/charts'
import { TabNav } from '@/components/TabNav'
import { TemperatureRange } from '@/components/TemperatureRange'
import { ArrowLink, CtaBand, FaqList, FeatureGrid, PageHeader, Section } from '@/components/ui'
import { applications, getApplication } from '@/content/applications'
import { getMarket, marketDisclaimer } from '@/content/markets'
import { getProduct, productHref } from '@/content/products'
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
          { href: '/applications', label: 'Markets' },
          { href: `/applications/${a.slug}`, label: a.name },
        ]}
        eyebrow="Market"
        title={a.name}
        intro={a.tagline}
      >
        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3.5 py-1.5 text-xs font-medium text-brand-200">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-300" aria-hidden="true" />
          {a.maturity}
        </p>
      </PageHeader>
      <TabNav tabs={applicationTabs} label="Markets">

        <Section>
          <div className={`grid gap-12 lg:grid-cols-[1.4fr_1fr] ${a.picture ? 'lg:items-start' : ''}`}>
            <div>
              {a.picture && <Illustration picture={a.picture} priority className="mb-10 max-w-xl" />}
              <p className="eyebrow">The big picture</p>
              <p className="mt-6 text-2xl leading-snug tracking-[-0.02em] text-zinc-100 sm:text-[1.7rem]">{a.intro}</p>
              <p className="mt-6 text-sm text-zinc-500">
                <span className="font-semibold text-zinc-200">Where we are:</span> {a.maturityNote}
              </p>
            </div>
            <div className="card p-7">
              <h2 className="text-base font-semibold">Examples</h2>
              <ul className="mt-4 space-y-2.5 text-zinc-300">
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

        {a.focus.length > 0 && (
          <Section id="focus" tone="muted" eyebrow="Focus areas" title="What we *focus on*" className="scroll-mt-32">
            <ul data-reveal="stagger" className={`grid gap-x-10 gap-y-12 ${a.focus.length === 1 ? 'max-w-2xl' : a.focus.length % 3 === 0 || a.focus.length === 5 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
              {a.focus.map((f) => {
                const items = (f.products ?? []).map(getProduct).filter((p) => p !== undefined)
                return (
                  <li key={f.id} id={f.id} className="scroll-mt-32 border-t border-white/15 pt-6">
                    <h3 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{f.title}</h3>
                    {f.holding && (
                      <span className="mt-3 inline-flex rounded-full border border-zinc-700 bg-zinc-950 px-2.5 py-0.5 text-xs font-medium text-zinc-400">Details to follow</span>
                    )}
                    <p className="mt-3 text-base leading-relaxed text-zinc-400 sm:text-[1.0625rem]">{f.body}</p>
                    {(items.length > 0 || f.links) && (
                      <div className="mt-4 flex flex-col items-start gap-2 text-sm">
                        {items.map((p) => (
                          <ArrowLink key={p.slug} href={productHref(p.slug)}>
                            {p.name}
                          </ArrowLink>
                        ))}
                        {f.links?.map((l) => (
                          <ArrowLink key={l.href} href={l.href}>
                            {l.label}
                          </ArrowLink>
                        ))}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </Section>
        )}

        <Section tone={a.focus.length > 0 ? 'white' : 'muted'} eyebrow="Why silicone" title="Why this industry needs *silicone*">
          <FeatureGrid items={a.whySilicone} />
        </Section>

        {a.slug === 'electric-vehicles' && (
          <Section eyebrow="Heat and cold" title="A wider *temperature range*" intro="Cables near batteries, motors and chargers run hot, and cars start in freezing weather. Silicone handles both.">
            <TemperatureRange />
          </Section>
        )}

        {relatedMarkets.length > 0 && (
        <Section eyebrow="Market size" title="Industry *context*" intro="Independent estimates for this industry. They are not MoMixx’s addressable market or a forecast of its business.">
          <div data-reveal="stagger" className={`grid gap-6 ${relatedMarkets.length > 1 ? 'md:grid-cols-2' : 'max-w-xl'}`}>
            {relatedMarkets.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
          <p className="mt-6 max-w-xl text-xs leading-relaxed text-zinc-400">{marketDisclaimer}</p>
          <ArrowLink href="/applications#markets" className="mt-4 text-sm">
            Compare all markets
          </ArrowLink>
        </Section>
        )}

        <Section tone="muted" eyebrow="Our offering" title="What MoMixx *supplies*">
          <FeatureGrid items={a.ourRole} />
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold">Related products</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {relatedProducts.map((p) => (
                  <li key={p.slug}>
                    <Link href={productHref(p.slug)} className="inline-flex rounded-full border border-white/15 bg-ink-900 px-4 py-2 text-sm font-medium text-zinc-100 transition-[scale] duration-200 ease-soft hover:border-brand-500 hover:text-brand-300 motion-safe:active:scale-[0.97]">
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
      <CtaBand title={`Silicone for *${a.name}*`} body="Speak with our engineers about materials, testing and supply." />
    </>
  )
}

import Link from 'next/link'
import { GrowthChart, MarketCard } from '@/components/charts'
import { collectionPage, JsonLd } from '@/components/JsonLd'
import { LinkCard } from '@/components/LinkCard'
import { TabNav } from '@/components/TabNav'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { applications, type Maturity } from '@/content/applications'
import { formatUsd, marketDisclaimer, markets, recyclingFacts } from '@/content/markets'
import { pageMetadata } from '@/lib/site'
import { applicationTabs } from './tabs'

export const metadata = pageMetadata({
  title: 'Markets for MoMixx silicone',
  description:
    'How MoMixx silicone serves digital communication, AI data centres, robotics, medical devices, automotive, food-grade products, fashion and semiconductor equipment, with independent market-size estimates and sources.',
  path: '/applications',
})

const maturityOrder: Maturity[] = ['In mass production', 'Certified & scaling', 'Emerging opportunity']
const maturityText: Record<Maturity, string> = {
  'In mass production': 'Markets where customers already buy from us in volume.',
  'Certified & scaling': 'Products available, with production at an early stage.',
  'Emerging opportunity': 'New markets for MoMixx where our existing materials may fit; not yet established businesses.',
}
export default function ApplicationsPage() {
  const addressable = markets.filter((m) => m.kind === 'addressable')
  const context = markets.filter((m) => m.kind === 'context')
  const appsFor = (id: string) => applications.filter((a) => a.markets.includes(id))
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/applications', label: 'Markets' }]}
        eyebrow="Markets"
        title="One material, *many futures*"
        intro="Silicone’s combination of heat resistance, flexibility and safety places it at the heart of several of the world’s fastest-growing industries. The markets MoMixx supplies today, and those it is entering."
      />
      <TabNav tabs={applicationTabs} label="Markets">
        <Section>
          <div className="space-y-14">
            {maturityOrder.map((m) => {
              const items = applications.filter((a) => a.maturity === m)
              if (!items.length) return null
              return (
                <div key={m} className="grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em]">{m}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{maturityText[m]}</p>
                  </div>
                  {/* The same columns in every group, so the cards (and their renders) are one size throughout. */}
                  <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((a) => (
                      <li key={a.slug} className={items.length === 1 ? 'md:col-span-2 lg:col-span-3' : ''}>
                        <LinkCard href={`/applications/${a.slug}`} title={a.name} body={a.tagline} note={a.maturityNote} wide={items.length === 1} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Markets (formerly their own page): independent sizes and sources for the industries above. */}
        <Section
          id="markets"
          tone="muted"
          eyebrow="Market size"
          title="The growth behind *silicone*"
          intro="Electrification, AI, healthcare and robotics all require materials that withstand heat, movement and contact with the human body. Independent research firms’ projections of how large those markets are expected to become."
          className="scroll-mt-32"
        >
          <GrowthChart markets={addressable} />
          <p className="mt-4 text-xs text-zinc-400">Humanoid robots are not shown: the source gives a market size for 2035, not a growth rate.</p>

          <h3 className="eyebrow mt-16 mb-8 sm:mt-20">Market sizes and sources</h3>
          <div data-reveal="stagger" data-last-spans className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addressable.map((m) => (
              <div key={m.id} className="flex flex-col gap-2">
                <MarketCard market={m} />
                {appsFor(m.id).length > 0 && (
                  <p className="px-1 text-xs text-zinc-500">
                    Related:{' '}
                    {appsFor(m.id).map((a, i) => (
                      <span key={a.slug}>
                        {i > 0 && ', '}
                        <Link href={`/applications/${a.slug}`} className="text-brand-300 hover:underline">
                          {a.name}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>

          <h3 className="eyebrow mt-16 mb-8 sm:mt-20">Related industries</h3>
          <div data-last-spans className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {context.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
            <article className="card flex flex-col p-6">
              <h3 className="text-lg font-semibold">Recycled silicone</h3>
              <p className="mt-1 text-sm text-zinc-500">An early-stage market with no reliable published size yet.</p>
              <p className="mt-5 text-sm leading-relaxed text-zinc-400">{recyclingFacts.summary}</p>
              <p className="mt-auto pt-5 text-xs text-zinc-400">
                Source:{' '}
                <a href={recyclingFacts.source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  {recyclingFacts.source.publisher}
                </a>
                , {recyclingFacts.source.date}
              </p>
            </article>
          </div>

          {/* The full table folds away; the cards above carry the same figures. */}
          <details className="group card mt-16 sm:mt-20">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-semibold [&::-webkit-details-marker]:hidden">
              All figures in one table
              <span aria-hidden="true" className="text-zinc-400 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="overflow-x-auto border-t border-white/10">
              <table className="w-full min-w-[720px] text-left text-sm">
                <caption className="sr-only">Market size estimates and sources</caption>
                <thead className="border-b border-white/10 bg-white/[0.03] text-xs tracking-wide text-zinc-500 uppercase">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Market</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Current</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Forecast</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Growth a year</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] tabular-nums">
                  {markets.map((m) => (
                    <tr key={m.id}>
                      <th scope="row" className="px-5 py-3 font-semibold text-white">{m.name}</th>
                      <td className="px-5 py-3 text-right">{m.current ? `${formatUsd(m.current.usdBn)} (${m.current.year})` : '—'}</td>
                      <td className="px-5 py-3 text-right">{`${formatUsd(m.forecast.usdBn)} (${m.forecast.year})`}</td>
                      <td className="px-5 py-3 text-right">{m.cagr ? `${m.cagr.pct}% (${m.cagr.period})` : '—'}</td>
                      <td className="px-5 py-3">
                        <a href={m.source.url} target="_blank" rel="noopener noreferrer" className="text-brand-300 hover:underline">
                          {m.source.publisher}
                        </a>
                        <span className="text-zinc-400">, {m.source.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p className="mt-6 max-w-xl text-xs leading-relaxed text-zinc-500">{marketDisclaimer}</p>
        </Section>
      </TabNav>
      <CtaBand title="Materials for *new industries*" body="Describe the conditions your product must withstand, and our team will recommend a material or develop one." secondary={{ href: '/silicone', label: 'What is silicone?' }} />
      <JsonLd data={collectionPage('Silicone applications', '/applications', applications.map((a) => ({ name: a.name, path: `/applications/${a.slug}` })))} />
    </>
  )
}

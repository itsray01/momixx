import Link from 'next/link'
import { GrowthChart, MarketCard } from '@/components/charts'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { applications } from '@/content/applications'
import { formatUsd, marketDisclaimer, markets, recyclingFacts } from '@/content/markets'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Markets: the growth behind silicone',
  description:
    'Independent market-size estimates for silicone, liquid silicone rubber, automotive and EV silicone, data centre cables, consumer charging cables, medical silicone and humanoid robots, with sources.',
  path: '/markets',
})

export default function MarketsPage() {
  const addressable = markets.filter((m) => m.kind === 'addressable')
  const context = markets.filter((m) => m.kind === 'context')
  const appsFor = (id: string) => applications.filter((a) => a.markets.includes(id))

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/markets', label: 'Markets' }]}
        eyebrow="Markets"
        title="The growth behind silicone"
        intro="Electrification, AI, healthcare and robotics all need materials that handle heat, movement and the human body. Here is how large those markets are expected to become, according to independent research firms."
      />

      <Section eyebrow="At a glance" title="Expected growth">
        <GrowthChart markets={addressable} />
        <p className="mt-4 text-xs text-slate-400">Humanoid robots are not shown: the source gives a 2035 total addressable market, not a growth rate.</p>
      </Section>

      <Section tone="muted" eyebrow="Market by market" title="Market sizes and sources">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {addressable.map((m) => (
            <div key={m.id} className="flex flex-col gap-2">
              <MarketCard market={m} />
              {appsFor(m.id).length > 0 && (
                <p className="px-1 text-xs text-slate-500">
                  Related:{' '}
                  {appsFor(m.id).map((a, i) => (
                    <span key={a.slug}>
                      {i > 0 && ', '}
                      <Link href={`/applications/${a.slug}`} className="text-brand-700 hover:underline">
                        {a.name}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Context" title="Related industries">
        <div className="grid gap-6 md:grid-cols-2">
          {context.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
          <article className="card flex flex-col p-6">
            <h3 className="text-lg font-bold">Recycled silicone</h3>
            <p className="mt-1 text-sm text-slate-500">An early-stage market with no reliable published size yet.</p>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">{recyclingFacts.summary}</p>
            <p className="mt-auto pt-5 text-xs text-slate-400">
              Source:{' '}
              <a href={recyclingFacts.source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {recyclingFacts.source.publisher}
              </a>
              , {recyclingFacts.source.date}
            </p>
          </article>
        </div>
      </Section>

      <Section tone="muted" eyebrow="Data" title="All figures in one table">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Market size estimates and sources</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Market</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Current</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Forecast</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">CAGR</th>
                <th scope="col" className="px-5 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums">
              {markets.map((m) => (
                <tr key={m.id}>
                  <th scope="row" className="px-5 py-3 font-semibold text-slate-900">{m.name}</th>
                  <td className="px-5 py-3 text-right">{m.current ? `${formatUsd(m.current.usdBn)} (${m.current.year})` : '—'}</td>
                  <td className="px-5 py-3 text-right">{`${formatUsd(m.forecast.usdBn)} (${m.forecast.year})`}</td>
                  <td className="px-5 py-3 text-right">{m.cagr ? `${m.cagr.pct}% (${m.cagr.period})` : '—'}</td>
                  <td className="px-5 py-3">
                    <a href={m.source.url} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">
                      {m.source.publisher}
                    </a>
                    <span className="text-slate-400">, {m.source.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-slate-500">{marketDisclaimer}</p>
      </Section>

      <CtaBand />
    </>
  )
}

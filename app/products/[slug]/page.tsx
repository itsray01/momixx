import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompareBars, MarketCard } from '@/components/charts'
import { Illustration } from '@/components/Illustration'
import { JsonLd } from '@/components/JsonLd'
import { TabNav } from '@/components/TabNav'
import { Scene3D } from '@/components/three/Scene3D'
import { sceneFor } from '@/components/three/sceneFor'
import { ArrowLink, CtaBand, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { getApplication } from '@/content/applications'
import { getMarket } from '@/content/markets'
import { categoryLabels, getProduct, products } from '@/content/products'
import { absoluteUrl, pageMetadata, site } from '@/lib/site'
import { productTabs } from '../tabs'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p) return {}
  return pageMetadata({ title: p.name, description: `${p.tagline} ${p.summary}`.slice(0, 300), path: `/products/${p.slug}` })
}

const typeHelp: Record<string, string> = {
  LSR: 'Liquid silicone rubber: pourable, for precise injection-moulded parts',
  HCR: 'High-consistency rubber: dough-like solid, for extrusion and compression moulding',
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p) notFound()

  const idx = products.indexOf(p)
  const prev = products[idx - 1]
  const next = products[idx + 1]
  const apps = (p.applications ?? []).map(getApplication).filter((a) => a !== undefined)
  const market = apps.flatMap((a) => a.markets).map(getMarket).find((m) => m !== undefined)
  const modelTypes = [...new Set((p.models ?? []).map((m) => m.type))]

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/products', label: 'Products' },
          { href: `/products/${p.slug}`, label: p.name },
        ]}
        eyebrow={categoryLabels[p.category]}
        title={p.name}
        intro={p.tagline}
        aside={
          p.image ? (
            <Image src={p.image} alt={p.name} width={640} height={480} className="rounded-2xl object-cover" priority />
          ) : (
            <Scene3D
              variant={sceneFor(p.illustration)}
              className="h-full"
              fallback={
                <div className="flex h-full items-center rounded-3xl bg-white/[0.04] p-8 ring-1 ring-white/10">
                  <Illustration name={p.illustration ?? 'compound'} className="w-full text-slate-200" />
                </div>
              }
            />
          )
        }
      />
      <TabNav tabs={productTabs} label="Products" />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow">Overview</p>
            <p className="mt-4 text-xl leading-relaxed text-slate-700">{p.summary}</p>
            {p.recycledOption && (
              <p className="mt-6 rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
                <strong>Also available with recycled content.</strong> <Link href="/recycled-silicone" className="underline underline-offset-2">How our recycled silicone works</Link>
              </p>
            )}
          </div>
          <div className="space-y-6">
            {p.stats && <StatTiles stats={p.stats} cols={1} />}
            {p.uses && (
              <div className="card p-6">
                <h2 className="text-base font-bold">Used in</h2>
                <ul className="mt-3 space-y-2 text-slate-600">
                  {p.uses.map((u) => (
                    <li key={u} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Section>

      {p.benefits && (
        <Section tone="muted" eyebrow="Why it matters" title={`What ${p.name} does better`}>
          <FeatureGrid items={p.benefits} />
        </Section>
      )}

      {p.comparison && (
        <Section eyebrow="Performance" title="How it compares">
          <CompareBars comparison={p.comparison} />
        </Section>
      )}

      {(p.models || p.specs) && (
        <Section tone={p.comparison ? 'muted' : 'white'} eyebrow="Technical details" title={p.models ? 'Grades in this series' : 'Specifications'}>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {p.models && (
              <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">Grade</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Key properties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {p.models.map((m) => (
                      <tr key={m.model}>
                        <th scope="row" className="px-5 py-3 font-display font-bold text-slate-900">{m.model}</th>
                        <td className="px-5 py-3">
                          <abbr title={typeHelp[m.type]} className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 no-underline">
                            {m.type}
                          </abbr>
                        </td>
                        <td className="px-5 py-3 text-slate-700">{m.properties}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {p.specs && (
              <dl className="card grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 lg:col-span-2 lg:grid-cols-4">
                {p.specs.map((s) => (
                  <div key={s.label} className="p-5">
                    <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{s.label}</dt>
                    <dd className="mt-1 font-display text-lg font-bold text-slate-900">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {p.models && (
              <div className="space-y-4 text-sm text-slate-600">
                {p.processing && (
                  <p>
                    <span className="font-semibold text-slate-900">Processing:</span> {p.processing}
                  </p>
                )}
                {modelTypes.map((t) =>
                  typeHelp[t] ? (
                    <p key={t}>
                      <span className="font-semibold text-slate-900">{t}</span>: {typeHelp[t].split(': ')[1]}.
                    </p>
                  ) : null,
                )}
                <p>Datasheets available on request.</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {apps.length > 0 && (
        <Section eyebrow="Applications" title="Where it’s used">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <ul data-reveal="stagger" className="grid content-start gap-4 sm:grid-cols-2">
              {apps.map((a) => (
                <li key={a.slug}>
                  <Link href={`/applications/${a.slug}`} data-tilt className="group card lift flex h-full items-start gap-4 p-5">
                    <Illustration name={a.illustration} className="h-14 w-20 shrink-0 text-slate-800" />
                    <div>
                      <h3 className="font-bold group-hover:text-brand-700">{a.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">{a.tagline}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {market && <MarketCard market={market} compact />}
          </div>
        </Section>
      )}

      <nav aria-label="More products" className="border-t border-slate-200 bg-white">
        <div className="container-page flex items-center justify-between gap-4 py-6 text-sm">
          {prev ? (
            <Link href={`/products/${prev.slug}`} className="font-semibold text-brand-700 hover:text-brand-800">
              <span aria-hidden="true">← </span>
              {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? <ArrowLink href={`/products/${next.slug}`}>{next.name}</ArrowLink> : <ArrowLink href="/products">All products</ArrowLink>}
        </div>
      </nav>

      <CtaBand title={`Interested in ${p.name}?`} body="Request a datasheet, samples or a technical consultation with our team." />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': p.category === 'services' ? 'Service' : 'Product',
          name: p.name,
          description: p.summary,
          url: absoluteUrl(`/products/${p.slug}`),
          category: categoryLabels[p.category],
          ...(p.category === 'services'
            ? { provider: { '@id': absoluteUrl('/#organization') }, areaServed: 'Worldwide' }
            : {
                brand: { '@type': 'Brand', name: site.name },
                manufacturer: { '@id': absoluteUrl('/#organization') },
                ...(p.specs || p.stats
                  ? {
                      additionalProperty: [...(p.specs ?? []).map((s) => ({ name: s.label, value: s.value })), ...(p.stats ?? []).map((s) => ({ name: s.label, value: s.value }))].map(
                        (x) => ({ '@type': 'PropertyValue', ...x }),
                      ),
                    }
                  : {}),
              }),
        }}
      />
    </>
  )
}

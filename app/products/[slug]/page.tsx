import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompareBars, MarketCard } from '@/components/charts'
import { CableAnatomy } from '@/components/CableAnatomy'
import { ExtruderSection } from '@/components/ExtruderSection'
import { JsonLd } from '@/components/JsonLd'
import { TemperatureRange } from '@/components/TemperatureRange'
import { TabNav } from '@/components/TabNav'
import { Arrow, ArrowLink, CtaBand, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { getApplication } from '@/content/applications'
import { getMarket } from '@/content/markets'
import { categoryLabels, getProduct, products, productSeoTitles } from '@/content/products'
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
  return pageMetadata({ title: productSeoTitles[p.slug] ?? p.name, description: `${p.tagline} ${p.summary}`, path: `/products/${p.slug}`, ownImage: true })
}

const types: Record<string, { name: string; help: string }> = {
  LSR: { name: 'Liquid', help: 'a thick, pumpable liquid, for precise moulded parts' },
  HCR: { name: 'Solid', help: 'firm like dough, for cables and pressed parts' },
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
      />
      <TabNav tabs={productTabs} label="Products">

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="eyebrow">Overview</p>
              <p className="mt-6 text-2xl leading-snug tracking-[-0.02em] text-slate-100 sm:text-[1.7rem]">{p.summary}</p>
              {p.photo && (
                <figure className="card relative mt-10 overflow-hidden">
                  <Image src={p.photo.src} alt={p.photo.alt} width={p.photo.width} height={p.photo.height} sizes="(min-width: 1024px) 30vw, 80vw" className="relative ml-auto h-56 w-auto object-contain mix-blend-lighten [mask-image:linear-gradient(to_right,transparent,black_40%)] sm:h-64" />
                  <figcaption className="absolute bottom-4 left-5 text-xs text-slate-400">{p.photo.caption}</figcaption>
                </figure>
              )}
              {p.recycledOption && (
                <p className="mt-8 rounded-2xl border border-brand-400/25 bg-brand-400/10 p-5 text-sm text-brand-100">
                  <strong>Also available with recycled content.</strong> <Link href="/recycled-silicone" className="underline underline-offset-2">How our recycled silicone works</Link>
                </p>
              )}
            </div>
            <div className="space-y-6">
              {p.stats && <StatTiles stats={p.stats} cols={1} />}
              {p.uses && (
                <div className="card p-7">
                  <h2 className="text-base font-semibold">Used in</h2>
                  <ul className="mt-4 space-y-2.5 text-slate-300">
                    {p.uses.map((u) => (
                      <li key={u} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
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
          <Section tone="muted" eyebrow="Why it matters" title="Key *benefits*">
            <FeatureGrid items={p.benefits} />
          </Section>
        )}

        {p.comparison && (
          <Section eyebrow="Performance" title="How it *compares*">
            <CompareBars comparison={p.comparison} />
          </Section>
        )}

        {p.slug === 'vertical-extruder' && <ExtruderSection tone="muted" />}
        {p.slug === 'momixx-mm' && (
          <Section tone="muted" eyebrow="Inside the cable" title="Where MM silicone *sits*" intro="A charging cable has five layers. MM silicone is the outer one: the part you hold, and the first protection against heat and fire.">
            <CableAnatomy />
          </Section>
        )}
        {p.slug === 'momixx-move' && (
          <Section tone="muted" eyebrow="Heat and cold" title="Tested from *−60 °C to 250 °C*" intro="MV silicone in MoMixx testing, compared with catalogue ratings for common cable materials.">
            <TemperatureRange />
          </Section>
        )}

        {(p.models || (p.specs && p.slug !== 'vertical-extruder')) && (
          <Section tone={p.comparison ? 'muted' : 'white'} eyebrow="The details" title={p.models ? 'Versions in this *range*' : 'Key *numbers*'}>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              {p.models && (
                <div className="card overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-xs tracking-[0.14em] text-slate-500 uppercase">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-medium">Version</th>
                        <th scope="col" className="px-6 py-4 font-medium">Form</th>
                        <th scope="col" className="px-6 py-4 font-medium">What it’s good at</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {p.models.map((m) => (
                        <tr key={m.model}>
                          <th scope="row" className="px-6 py-4 font-mono font-medium text-white">{m.model}</th>
                          <td className="px-6 py-4">
                            <span title={`${m.type}: ${types[m.type]?.help ?? ''}`} className="rounded-full border border-brand-400/30 bg-brand-400/10 px-2.5 py-0.5 text-xs font-medium text-brand-200">
                              {types[m.type]?.name ?? m.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-200">{m.properties}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {p.specs && (
                <dl className="card grid gap-px overflow-hidden bg-white/[0.06] sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
                  {p.specs.map((s) => (
                    <div key={s.label} className="bg-ink-900 p-6">
                      <dt className="text-xs tracking-[0.14em] text-slate-500 uppercase">{s.label}</dt>
                      <dd className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {p.models && (
                <div className="space-y-4 text-sm text-slate-400">
                  {p.processing && (
                    <p>
                      <span className="font-semibold text-white">How it’s used:</span> {p.processing}
                    </p>
                  )}
                  {modelTypes.map((t) =>
                    types[t] ? (
                      <p key={t}>
                        <span className="font-semibold text-white">{types[t].name}</span> ({t}): {types[t].help}.
                      </p>
                    ) : null,
                  )}
                  <p>Full technical datasheets are available on request.</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {apps.length > 0 && (
          <Section eyebrow="Applications" title="Where it’s *used*">
            <div className={`grid gap-6 ${market ? 'lg:grid-cols-2' : ''}`}>
              <ul data-reveal="stagger" className={`grid content-start gap-4 ${market ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                {apps.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/applications/${a.slug}`} className="group card lift flex h-full items-center justify-between gap-6 overflow-hidden p-6">
                      <div>
                        <h3 className="font-semibold tracking-[-0.02em]">{a.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">{a.tagline}</p>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors group-hover:border-brand-300 group-hover:bg-brand-300 group-hover:text-ink-950">
                        <Arrow />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {market && <MarketCard market={market} compact />}
            </div>
          </Section>
        )}

        <nav aria-label="More products" className="border-t border-white/[0.06] bg-ink-950">
          <div className="container-page flex items-center justify-between gap-4 py-6 text-sm">
            {prev ? (
              <Link href={`/products/${prev.slug}`} className="font-semibold text-brand-300 hover:text-brand-200">
                <span aria-hidden="true">← </span>
                {prev.name}
              </Link>
            ) : (
              <span />
            )}
            {next ? <ArrowLink href={`/products/${next.slug}`}>{next.name}</ArrowLink> : <ArrowLink href="/products">All products</ArrowLink>}
          </div>
        </nav>

      </TabNav>
      <CtaBand title={`Interested in *${p.name}?*`} body="Request a datasheet, samples or a technical consultation with our team." />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': p.category === 'services' ? 'Service' : 'Product',
          name: p.name,
          description: p.summary,
          url: absoluteUrl(`/products/${p.slug}`),
          image: absoluteUrl(p.image ?? `/renders/${p.illustration}.webp`),
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

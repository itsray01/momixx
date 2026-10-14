import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompareBars, MarketCard } from '@/components/charts'
import { CableAnatomy } from '@/components/CableAnatomy'
import { StepFlow } from '@/components/infographics'
import { JsonLd } from '@/components/JsonLd'
import { Render } from '@/components/Render'
import { SpinVideo } from '@/components/SpinVideo'
import { TemperatureRange } from '@/components/TemperatureRange'
import { TabNav } from '@/components/TabNav'
import { Arrow, ArrowLink, CtaBand, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { getApplication } from '@/content/applications'
import { getMarket } from '@/content/markets'
import { categoryLabels, getProduct, ownPageProducts, productSeoTitles } from '@/content/products'
import { absoluteUrl, pageMetadata, site } from '@/lib/site'
import { productNav } from '../tabs'

type Props = { params: Promise<{ slug: string }> }

// Machines and manufacturing services share a page per category (app/products/machines and /manufacturing).
export function generateStaticParams() {
  return ownPageProducts.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p || !ownPageProducts.includes(p)) return {}
  return pageMetadata({ title: productSeoTitles[p.slug] ?? p.name, description: `${p.tagline} ${p.summary}`, path: `/products/${p.slug}`, ownImage: true })
}

const types: Record<string, { name: string; help: string }> = {
  LSR: { name: 'Liquid', help: 'a thick, pumpable liquid, for precise moulded parts' },
  HCR: { name: 'Solid', help: 'firm like dough, for cables and pressed parts' },
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p || !ownPageProducts.includes(p)) notFound()

  // Previous and next among the pages of their own; after the last material comes the machines page.
  const idx = ownPageProducts.indexOf(p)
  const prev = ownPageProducts[idx - 1]
  const next = ownPageProducts[idx + 1]
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
      <TabNav {...productNav({ slug: p.slug })} label="Products">

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              {/* The 3D picture sits here, under the words-only header; a real photo, where there is one, follows it. */}
              {p.illustration && (
                <div className="mb-10 max-w-xl">
                  {p.video ? (
                    <div className="card aspect-[4/3] overflow-hidden">
                      <SpinVideo name={p.video} label={`Rotating 3D illustration of the ${p.name}`} />
                    </div>
                  ) : (
                    <Render name={p.illustration} variant={p.illustrationVariant} alt={`3D illustration of the ${p.name}`} sizes="(min-width: 1024px) 36rem, 100vw" />
                  )}
                </div>
              )}
              {/* A photograph in a frame: the shot is on a dark ground, so it sits in the card as a picture rather than bleeding into it. */}
              {p.photo && (
                <figure className="card relative mb-10 max-w-xl overflow-hidden">
                  <Image src={p.photo.src} alt={p.photo.alt} width={p.photo.width} height={p.photo.height} sizes="(min-width: 1024px) 36rem, 100vw" className="h-56 w-full object-cover sm:h-72" />
                  <figcaption className="absolute bottom-4 left-5 text-xs text-ink-900/80">{p.photo.caption}</figcaption>
                </figure>
              )}
              <p className="eyebrow">Overview</p>
              <p className="mt-6 text-2xl leading-snug tracking-[-0.02em] text-zinc-100 sm:text-[1.7rem]">{p.summary}</p>
              {p.recycledOption && (
                <p className="mt-8 rounded-2xl border border-brand-400/25 bg-brand-400/10 p-5 text-sm text-brand-100">
                  <strong>Also available with recycled content.</strong> <Link href="/recycled-silicone" className="underline underline-offset-2">How our recycled silicone works</Link>
                </p>
              )}
            </div>
            <div className="space-y-6">
              {p.stats && <StatTiles stats={p.stats} cols={1} />}
              {apps.length > 0 ? (
                <div className="card p-7">
                  <h2 className="text-base font-semibold">Used in</h2>
                  <ul className={`mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 ${apps.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
                    {apps.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/applications/${a.slug}`}
                          className="group motion-card flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-colors hover:border-white/20 focus-visible:border-white/20"
                        >
                          <span className="block aspect-[4/3] overflow-hidden">
                            <Render name={a.illustration} sizes="(min-width: 1024px) 12rem, (min-width: 640px) 30vw, 45vw" className="motion-media" />
                          </span>
                          <span className="px-3 pb-3 text-[0.8125rem] font-medium text-zinc-200 group-hover:text-white sm:text-sm">{a.tabLabel}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {p.uses && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {p.uses.map((u) => (
                        <li key={u} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                          {u}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : p.uses && (
                <div className="card p-7">
                  <h2 className="text-base font-semibold">Used in</h2>
                  <ul className="mt-4 space-y-2.5 text-zinc-300">
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

        {p.steps && (
          <Section tone="muted" eyebrow="How it works" title="How it *works*">
            <StepFlow steps={p.steps} />
          </Section>
        )}

        {p.benefits && (
          <Section tone={p.steps ? 'white' : 'muted'} eyebrow="Why it matters" title="Key *benefits*">
            <FeatureGrid items={p.benefits} />
          </Section>
        )}

        {p.comparison && (
          <Section eyebrow="Performance" title="How it *compares*">
            <CompareBars comparison={p.comparison} />
          </Section>
        )}

        {p.slug === 'momixx-mm' && (
          <Section tone="muted" eyebrow="Inside the cable" title="Where MM silicone *sits*" intro="A charging cable has five layers. MM silicone forms the outermost: the protective jacket, and the first line of defence against heat and fire.">
            <CableAnatomy productLink={false} />
          </Section>
        )}
        {p.slug === 'momixx-move' && (
          <Section tone="muted" eyebrow="Heat and cold" title="Tested from *−60 °C to 250 °C*" intro="MV silicone in MoMixx testing, compared with catalogue ratings for common cable materials.">
            <TemperatureRange />
          </Section>
        )}

        {(p.models || p.specs) && (
          <Section tone={p.comparison ? 'muted' : 'white'} eyebrow="The details" title={p.models ? 'Versions in this *range*' : 'Key *numbers*'}>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              {p.models && (
                <div className="card overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-xs tracking-[0.14em] text-zinc-400 uppercase">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-medium">Version</th>
                        <th scope="col" className="px-6 py-4 font-medium">Form</th>
                        <th scope="col" className="px-6 py-4 font-medium">Strengths</th>
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
                          <td className="px-6 py-4 text-zinc-200">{m.properties}</td>
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
                      <dt className="text-xs tracking-[0.14em] text-zinc-400 uppercase">{s.label}</dt>
                      <dd className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {p.models && (
                <div className="space-y-4 text-sm text-zinc-400">
                  {p.processing && (
                    <p>
                      <span className="font-semibold text-white">How it is used:</span> {p.processing}
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
          <Section eyebrow="Applications" title="Where it is *used*">
            <div className={`grid gap-6 ${market ? 'lg:grid-cols-2' : ''}`}>
              <ul data-reveal="stagger" className={`grid content-start gap-4 ${market ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                {apps.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/applications/${a.slug}`} className="group card lift flex h-full items-center justify-between gap-6 overflow-hidden p-6">
                      <div>
                        <h3 className="font-semibold tracking-[-0.02em]">{a.name}</h3>
                        <p className="mt-1 text-sm text-zinc-400">{a.tagline}</p>
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
            {next ? <ArrowLink href={`/products/${next.slug}`}>{next.name}</ArrowLink> : <ArrowLink href="/products/machines">Our machines</ArrowLink>}
          </div>
        </nav>

      </TabNav>
      <CtaBand title={`Enquire about *${p.name}*`} body="Request a datasheet or a technical consultation with our team." />

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

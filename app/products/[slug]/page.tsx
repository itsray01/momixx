import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompareBars, MarketCard } from '@/components/charts'
import { Render } from '@/components/Render'
import { CableAnatomy } from '@/components/CableAnatomy'
import { ExtruderSection } from '@/components/ExtruderSection'
import { JsonLd } from '@/components/JsonLd'
import { TemperatureRange } from '@/components/TemperatureRange'
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
        mobileVisual={<Render name={p.illustration ?? 'compound'} priority className="mx-auto max-w-sm" sizes="100vw" />}
        aside={
          p.image ? (
            <Image src={p.image} alt={p.name} width={640} height={480} className="rounded-2xl object-cover" priority />
          ) : (
            <Scene3D
              variant={sceneFor(p.illustration)}
              className="h-full"
              fallback={<Render name={p.illustration ?? 'compound'} priority className="h-full w-full object-contain" />}
            />
          )
        }
      />
      <TabNav tabs={productTabs} label="Products" />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow">Overview</p>
            <p className="mt-6 text-2xl leading-snug tracking-[-0.02em] text-slate-100 sm:text-[1.7rem]">{p.summary}</p>
            {p.photo && (
              <figure className="card relative mt-10 overflow-hidden">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_50%,rgb(20_159_148/0.16),transparent)]" />
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
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300 shadow-[0_0_8px_var(--color-brand-300)]" />
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
        <Section tone="muted" eyebrow="Why it matters" title={`What it does *better*`}>
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
        <Section tone="muted" eyebrow="Inside the cable" title="Where MM silicone *goes*" intro="A charging cable is five layers. MM silicone is the outer jacket: the part you hold, and the first line of defence against heat and fire.">
          <CableAnatomy />
        </Section>
      )}
      {p.slug === 'momixx-move' && (
        <Section tone="muted" eyebrow="Heat and cold" title="Rated from *−60 °C to 250 °C*" intro="How MV silicone compares with common cable materials.">
          <TemperatureRange />
        </Section>
      )}

      {(p.models || (p.specs && p.slug !== 'vertical-extruder')) && (
        <Section tone={p.comparison ? 'muted' : 'white'} eyebrow="Technical details" title={p.models ? 'Grades in this *series*' : '*Specifications*'}>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {p.models && (
              <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-white/10 text-xs tracking-[0.14em] text-slate-500 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-medium">Grade</th>
                      <th scope="col" className="px-6 py-4 font-medium">Type</th>
                      <th scope="col" className="px-6 py-4 font-medium">Key properties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {p.models.map((m) => (
                      <tr key={m.model}>
                        <th scope="row" className="px-6 py-4 font-mono font-medium text-white">{m.model}</th>
                        <td className="px-6 py-4">
                          <abbr title={typeHelp[m.type]} className="rounded-full border border-brand-400/30 bg-brand-400/10 px-2.5 py-0.5 text-xs font-medium text-brand-200 no-underline">
                            {m.type}
                          </abbr>
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
                    <span className="font-semibold text-white">Processing:</span> {p.processing}
                  </p>
                )}
                {modelTypes.map((t) =>
                  typeHelp[t] ? (
                    <p key={t}>
                      <span className="font-semibold text-white">{t}</span>: {typeHelp[t].split(': ')[1]}.
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
        <Section eyebrow="Applications" title="Where it’s *used*">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <ul data-reveal="stagger" className="grid content-start gap-4 sm:grid-cols-2">
              {apps.map((a) => (
                <li key={a.slug}>
                  <Link href={`/applications/${a.slug}`} data-tilt className="group card lift flex h-full items-center gap-4 overflow-hidden p-5">
                    <div className="relative w-24 shrink-0">
                      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(closest-side, rgb(20 159 148 / 0.25), transparent)' }} />
                      <Render name={a.illustration} className="relative" sizes="96px" />
                    </div>
                    <div>
                      <h3 className="font-semibold tracking-[-0.02em]">{a.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{a.tagline}</p>
                    </div>
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

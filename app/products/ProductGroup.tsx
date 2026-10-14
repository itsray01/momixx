import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { CompareBars } from '@/components/charts'
import { ExtruderSection } from '@/components/ExtruderSection'
import { StepFlow } from '@/components/infographics'
import { collectionPage, JsonLd } from '@/components/JsonLd'
import { Render } from '@/components/Render'
import { SpinVideo } from '@/components/SpinVideo'
import { TabNav } from '@/components/TabNav'
import { CtaBand, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { getApplication } from '@/content/applications'
import { categoryLabels, groupPages, productHref, productsByCategory, type Product, type ProductCategory } from '@/content/products'
import { absoluteUrl, site } from '@/lib/site'
import { productNav } from './tabs'

/**
 * One page for a whole product category (machines, or manufacturing services):
 * a section per product, with the tab bar jumping between them.
 */
export function ProductGroup({ category, eyebrow, title, intro, cta }: { category: ProductCategory; eyebrow: string; title: string; intro: string; cta: { title: string; body: string } }) {
  const group = groupPages[category]
  if (!group) throw new Error(`No shared page for ${category}`)
  const items = productsByCategory(category)
  let n = 0
  const tone = () => (n++ % 2 ? 'muted' : 'white')

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/products', label: 'Products' },
          { href: group.path, label: group.label },
        ]}
        eyebrow={eyebrow}
        title={title}
        intro={intro}
      />
      <TabNav {...productNav({ category })} label="Products">
        {items.map((p) => (
          <Fragment key={p.slug}>
            <ProductSection p={p} tone={tone()} />
            {/* The interactive line, part by part, straight after the vertical line's own section. */}
            {p.slug === 'vertical-extruder' && <ExtruderSection tone={tone()} />}
          </Fragment>
        ))}
      </TabNav>
      <CtaBand title={cta.title} body={cta.body} />
      <JsonLd data={[collectionPage(`MoMixx ${group.label.toLowerCase()}`, group.path, items.map((p) => ({ name: p.name, path: productHref(p.slug) }))), ...items.map(productJsonLd)]} />
    </>
  )
}

function ProductSection({ p, tone }: { p: Product; tone: 'white' | 'muted' }) {
  const apps = (p.applications ?? []).map(getApplication).filter((a) => a !== undefined)
  // The vertical line's picture and numbers are on its interactive model, just below.
  const explored = p.slug === 'vertical-extruder'
  const specs = explored ? undefined : p.specs

  return (
    <Section id={p.slug} tone={tone} eyebrow={p.tabLabel ?? p.name} title={p.name} intro={p.tagline} className="scroll-mt-32">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          {p.illustration && !explored && (
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
          {p.photo && (
            <figure className="card relative mb-10 max-w-xl overflow-hidden">
              <Image src={p.photo.src} alt={p.photo.alt} width={p.photo.width} height={p.photo.height} sizes="(min-width: 1024px) 36rem, 100vw" className="h-56 w-full object-cover sm:h-72" />
              <figcaption className="absolute bottom-4 left-5 text-xs text-ink-900/80">{p.photo.caption}</figcaption>
            </figure>
          )}
          <p className="text-xl leading-snug tracking-[-0.02em] text-zinc-100 sm:text-2xl">{p.summary}</p>
        </div>
        <div className="space-y-6">
          {p.stats && <StatTiles stats={p.stats} cols={1} />}
          {specs && (
            <dl className="card grid gap-px overflow-hidden bg-white/[0.06] sm:grid-cols-2">
              {specs.map((s) => (
                <div key={s.label} className="bg-ink-900 p-6">
                  <dt className="text-xs tracking-[0.14em] text-zinc-400 uppercase">{s.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {(apps.length > 0 || p.uses) && (
            <div className="card p-7">
              <h3 className="text-base font-semibold">Used in</h3>
              {apps.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {apps.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/applications/${a.slug}`} className="block rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white transition-colors hover:border-white/40">
                        {a.tabLabel} <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {p.uses && (
                <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
                  {p.uses.map((u) => (
                    <li key={u} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
                      {u}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {p.steps && (
        <div className="mt-16 sm:mt-20">
          <h3 className="eyebrow mb-8">How it works</h3>
          <StepFlow steps={p.steps} />
        </div>
      )}
      {p.benefits && (
        <div className="mt-16 sm:mt-20">
          <h3 className="eyebrow mb-8">Key benefits</h3>
          <FeatureGrid items={p.benefits} />
        </div>
      )}
      {p.comparison && (
        <div className="mt-16 sm:mt-20">
          <CompareBars comparison={p.comparison} />
        </div>
      )}
    </Section>
  )
}

function productJsonLd(p: Product) {
  const service = p.category === 'services'
  const props = [...(p.specs ?? []), ...(p.stats ?? []).map((s) => ({ label: s.label, value: s.value }))]
  return {
    '@context': 'https://schema.org',
    '@type': service ? 'Service' : 'Product',
    name: p.name,
    description: p.summary,
    url: absoluteUrl(productHref(p.slug)),
    image: absoluteUrl(p.image ?? `/renders/${p.illustration}.webp`),
    category: categoryLabels[p.category],
    ...(service
      ? { provider: { '@id': absoluteUrl('/#organization') }, areaServed: 'Worldwide' }
      : {
          brand: { '@type': 'Brand', name: site.name },
          manufacturer: { '@id': absoluteUrl('/#organization') },
          ...(props.length ? { additionalProperty: props.map((x) => ({ '@type': 'PropertyValue', name: x.label, value: x.value })) } : {}),
        }),
  }
}

import { collectionPage, JsonLd } from '@/components/JsonLd'
import { LinkCard } from '@/components/LinkCard'
import { TabNav } from '@/components/TabNav'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { productHref, products, productsByCategory } from '@/content/products'
import { productGroups } from '@/content/topics'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Silicone materials, coatings, components and automation',
  description:
    'Recycled, flame-retardant, high-strength, magnetic, conductive and PFAS-free silicone; silicone coatings, yarn and leather; precision components; patented extrusion machines; and carbon footprint reports.',
  path: '/products',
})

export default function ProductsPage() {
  // Every material grade family, listed under the site-map groups so nothing is lost.
  const grades = productsByCategory('materials').filter((p) => p.slug !== 'recycled-silicone')
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/products', label: 'Products' }]}
        eyebrow="Products"
        title="Materials, components and *automation*"
        intro="Silicone materials engineered for specific applications, coatings and textiles, finished components, and the machines that make them."
        facts={productGroups.map((g) => ({ value: String(g.links.length), label: g.title.toLowerCase() }))}
      />
      <TabNav
        tabs={[{ href: '/products', label: 'Overview' }, ...productGroups.map((g) => ({ href: `/products#${g.id}`, label: g.title })), { href: '/products#grades', label: 'All grades' }]}
        label="Products"
      >
        {productGroups.map((g, i) => (
          <Section key={g.id} id={g.id} tone={i % 2 ? 'muted' : 'white'} eyebrow={g.title} title={g.title} intro={g.intro} className="scroll-mt-32">
            <ul data-reveal="stagger" className={`grid gap-5 sm:grid-cols-2 ${g.links.length > 4 || g.links.length === 3 ? 'lg:grid-cols-3' : ''}`}>
              {g.links.map((l, j, all) => (
                <li key={l.href} className={all.length % 2 && j === all.length - 1 ? 'sm:max-lg:col-span-2' : ''}>
                  <LinkCard href={l.href} title={l.label} body={l.desc} />
                </li>
              ))}
            </ul>
          </Section>
        ))}
        <Section id="grades" tone={productGroups.length % 2 ? 'muted' : 'white'} eyebrow="All grades" title="Every material *family*" intro="Each family of silicone grades in our range, and our clear PCTG plastic." className="scroll-mt-32">
          <ul data-reveal="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {grades.map((p) => (
              <li key={p.slug}>
                <LinkCard
                  href={productHref(p.slug)}
                  title={p.name}
                  body={p.tagline}
                  footer={
                    p.stats?.[0] && (
                      <>
                        <span className="font-medium text-white">{p.stats[0].value}</span> {p.stats[0].label}
                      </>
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </Section>
      </TabNav>
      <CtaBand title="Custom *development*" body="Most of our work is developed to order. Describe your requirements and our research team will formulate a material to meet them." />
      <JsonLd data={collectionPage('MoMixx products', '/products', products.map((p) => ({ name: p.name, path: productHref(p.slug) })))} />
    </>
  )
}

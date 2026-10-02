import { Render } from '@/components/Render'
import { RenderCard } from '@/components/RenderCard'
import { TabNav } from '@/components/TabNav'
import { Scene3D } from '@/components/three/Scene3D'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { categoryIntros, categoryLabels, productsByCategory, type ProductCategory } from '@/content/products'
import { pageMetadata } from '@/lib/site'
import { productTabs } from './tabs'

export const metadata = pageMetadata({
  title: 'Products: silicone materials, machines and manufacturing',
  description:
    'Fire-retardant, PFAS-free, waterproof, self-bonding and recycled silicone compounds; patented silicone cable extrusion machines; and ODM, OEM and medical component manufacturing.',
  path: '/products',
})

const order: ProductCategory[] = ['materials', 'equipment', 'services']

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/products', label: 'Products' }]}
        eyebrow="Products & services"
        title="Everything *we make*"
        intro="Silicone materials tuned for a job, the machines that process them, and the manufacturing services that turn them into finished parts. Choose a tab to see each product in detail."
        aside={<Scene3D variant="samples" className="h-full" fallback={<Render name="samples" priority className="h-full w-full object-contain" />} />}
      />
      <TabNav tabs={productTabs} label="Products" />
      {order.map((cat, i) => (
        <Section key={cat} id={cat} tone={i % 2 ? 'muted' : 'white'} eyebrow={categoryLabels[cat]} title={categoryLabels[cat]} intro={categoryIntros[cat]} className="scroll-mt-32">
          <ul data-reveal="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productsByCategory(cat).map((p) => (
              <li key={p.slug}>
                <RenderCard
                  href={`/products/${p.slug}`}
                  model={p.illustration ?? 'compound'}
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
      ))}
      <CtaBand title="Looking for something *not listed?*" body="Most of our work is custom. Tell us what you need and our R&D team will formulate it." />
    </>
  )
}

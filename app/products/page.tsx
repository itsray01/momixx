import Link from 'next/link'
import { Illustration } from '@/components/Illustration'
import { TabNav } from '@/components/TabNav'
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
        title="Everything we make"
        intro="Silicone materials tuned for a job, the machines that process them, and the manufacturing services that turn them into finished parts. Choose a tab to see each product in detail."
      />
      <TabNav tabs={productTabs} label="Products" />
      {order.map((cat, i) => (
        <Section key={cat} id={cat} tone={i % 2 ? 'muted' : 'white'} eyebrow={categoryLabels[cat]} title={categoryLabels[cat]} intro={categoryIntros[cat]} className="scroll-mt-32">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productsByCategory(cat).map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} className="group card flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="bg-brand-50/60 px-6 pt-5">
                    <Illustration name={p.illustration ?? 'compound'} className="h-28 w-full text-slate-800" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold group-hover:text-brand-700">{p.name}</h3>
                    <p className="mt-1.5 flex-1 text-slate-600">{p.tagline}</p>
                    {p.stats?.[0] && (
                      <p className="mt-4 text-sm">
                        <span className="font-display font-extrabold text-slate-900">{p.stats[0].value}</span>{' '}
                        <span className="text-slate-500">{p.stats[0].label}</span>
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}
      <CtaBand title="Looking for something not listed?" body="Most of our work is custom. Tell us what you need and our R&D team will formulate it." />
    </>
  )
}

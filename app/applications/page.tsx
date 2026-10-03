import { collectionPage, JsonLd } from '@/components/JsonLd'
import { LinkCard } from '@/components/LinkCard'
import { TabNav } from '@/components/TabNav'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { applications, type Maturity } from '@/content/applications'
import { pageMetadata } from '@/lib/site'
import { applicationTabs } from './tabs'

export const metadata = pageMetadata({
  title: 'Applications: where Momixx silicone is used',
  description:
    'How Momixx silicone serves phone and laptop cables, electric vehicles, medical devices, AI data centres, robotics and humanoids, and semiconductor equipment.',
  path: '/applications',
})

const maturityOrder: Maturity[] = ['In mass production', 'Certified & scaling', 'Emerging opportunity']
const maturityText: Record<Maturity, string> = {
  'In mass production': 'Markets where customers already buy from us in volume.',
  'Certified & scaling': 'Products available, with production at an early stage.',
  'Emerging opportunity': 'New markets for Momixx where our existing materials may fit; not yet established businesses.',
}
const columns: Record<number, string> = { 1: '', 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 lg:grid-cols-3' }

export default function ApplicationsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/applications', label: 'Applications' }]}
        eyebrow="Applications"
        title="One material, *many futures*"
        intro="Silicone’s mix of heat resistance, flexibility and safety puts it at the heart of several of the world’s fastest-growing industries. Here is where Momixx supplies today, and which markets are still new for us."
      />
      <TabNav tabs={applicationTabs} label="Applications">
        <Section>
          <div className="space-y-14">
            {maturityOrder.map((m) => {
              const items = applications.filter((a) => a.maturity === m)
              if (!items.length) return null
              return (
                <div key={m} className="grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em]">{m}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{maturityText[m]}</p>
                  </div>
                  <ul data-reveal="stagger" className={`grid gap-5 ${columns[Math.min(items.length, 3)]}`}>
                    {items.map((a) => (
                      <li key={a.slug}>
                        <LinkCard href={`/applications/${a.slug}`} title={a.name} body={a.tagline} footer={<span className="text-xs">{a.maturityNote}</span>} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </Section>
      </TabNav>
      <CtaBand title="Working in a *new industry?*" body="Tell us what your product has to withstand, and we’ll recommend a material or develop one." secondary={{ href: '/silicone', label: 'What is silicone?' }} />
      <JsonLd data={collectionPage('Silicone applications', '/applications', applications.map((a) => ({ name: a.name, path: `/applications/${a.slug}` })))} />
    </>
  )
}

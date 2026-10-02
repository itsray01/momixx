import { collectionPage, JsonLd } from '@/components/JsonLd'
import { Render } from '@/components/Render'
import { RenderCard } from '@/components/RenderCard'
import { TabNav } from '@/components/TabNav'
import { Scene3D } from '@/components/three/Scene3D'
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
  'In mass production': 'Established revenue markets with qualified customers.',
  'Certified & scaling': 'Certifications and capacity in place; growing volumes.',
  'Emerging opportunity': 'Where our existing materials fit fast-growing new demand.',
}

export default function ApplicationsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/applications', label: 'Applications' }]}
        eyebrow="Applications"
        title="One material, *many futures*"
        intro="Silicone’s mix of heat resistance, flexibility and safety puts it at the heart of several of the world’s fastest-growing industries. Here is where Momixx fits today, and where we are heading."
        aside={<Scene3D variant="cable" className="h-full" fallback={<Render name="cable" priority className="h-full w-full object-contain" />} />}
      />
      <TabNav tabs={applicationTabs} label="Applications" />
      <Section>
        <div className="space-y-14">
          {maturityOrder.map((m) => {
            const items = applications.filter((a) => a.maturity === m)
            if (!items.length) return null
            return (
              <div key={m}>
                <div className="flex flex-col gap-1 border-b border-white/10 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="display-md">{m}</h2>
                  <p className="text-sm text-slate-500">{maturityText[m]}</p>
                </div>
                <ul data-reveal="stagger" className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((a) => (
                    <li key={a.slug}>
                      <RenderCard href={`/applications/${a.slug}`} model={a.illustration} title={a.name} body={a.tagline} footer={<span className="text-xs">{a.maturityNote}</span>} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Section>
      <CtaBand />
      <JsonLd data={collectionPage('Silicone applications', '/applications', applications.map((a) => ({ name: a.name, path: `/applications/${a.slug}` })))} />
    </>
  )
}

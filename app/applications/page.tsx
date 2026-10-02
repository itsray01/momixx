import Link from 'next/link'
import { Illustration } from '@/components/Illustration'
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
        title="One material, many futures"
        intro="Silicone’s mix of heat resistance, flexibility and safety puts it at the heart of several of the world’s fastest-growing industries. Here is where Momixx fits today, and where we are heading."
      />
      <TabNav tabs={applicationTabs} label="Applications" />
      <Section>
        <div className="space-y-14">
          {maturityOrder.map((m) => {
            const items = applications.filter((a) => a.maturity === m)
            if (!items.length) return null
            return (
              <div key={m}>
                <div className="flex flex-col gap-1 border-b border-slate-200 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="text-2xl font-extrabold">{m}</h2>
                  <p className="text-sm text-slate-500">{maturityText[m]}</p>
                </div>
                <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/applications/${a.slug}`} className="group card flex h-full flex-col overflow-hidden hover:shadow-lg">
                        <div className="bg-brand-50/60 px-6 pt-5">
                          <Illustration name={a.illustration} className="h-28 w-full text-slate-800" />
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <h3 className="text-xl font-bold group-hover:text-brand-700">{a.name}</h3>
                          <p className="mt-2 flex-1 text-slate-600">{a.tagline}</p>
                          <p className="mt-4 text-xs text-slate-500">{a.maturityNote}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Section>
      <CtaBand />
    </>
  )
}

import Link from 'next/link'
import { SiloxaneChain, SiliconeJourney, SiliconVsSilicone } from '@/components/infographics'
import { Illustration } from '@/components/Illustration'
import { Scene3D } from '@/components/three/Scene3D'
import { CtaBand, FaqList, PageHeader, Section } from '@/components/ui'
import { applications } from '@/content/applications'
import { siliconeFaqs } from '@/content/faqs'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'What is silicone? A plain-English guide',
  description:
    'What silicone is, how it differs from silicon, why it is used in cables, electric vehicles, medical devices, AI data centres and robots, and how it can be recycled.',
  path: '/silicone',
})

const properties = [
  { title: 'Handles heat and cold', body: 'Stays flexible across a wide temperature range, typically about −40 °C to 150–200 °C, and further in specialised grades.' },
  { title: 'Bends without breaking', body: 'Low hardness and high stretch mean it survives repeated twisting and flexing.' },
  { title: 'Keeps water out', body: 'Naturally water-repellent, so it makes excellent seals and gaskets.' },
  { title: 'Body-safe', body: 'Medical grades are biocompatible and can be sterilised again and again.' },
  { title: 'Ages slowly', body: 'Resists sunlight, ozone and heat ageing far better than most plastics and rubbers.' },
  { title: 'Can be made fire-safe', body: 'With the right additives it stops burning when the flame is removed.' },
]

export default function SiliconePage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/silicone', label: 'Silicone' }]}
        eyebrow="Silicone 101"
        title="What is silicone, and why does it matter?"
        intro="Silicone is a flexible, heat-resistant material built on a backbone of silicon and oxygen. You can’t see most of it, but it is inside your phone cable, your car, hospital equipment and the data centres that run AI."
        aside={<Scene3D variant="molecule" className="h-full" fallback={<SiloxaneChain className="h-full w-full" />} />}
      />

      <Section eyebrow="Not the same thing" title="Silicon vs silicone" intro="The names are one letter apart, but the materials are very different. Silicon is the raw element; silicone is the versatile material made from it.">
        <SiliconVsSilicone />
      </Section>

      <Section tone="muted" eyebrow="From sand to product" title="How silicone is made" intro="Silicone starts as ordinary sand. Momixx works at step four: we turn silicone into compounds engineered for a specific job.">
        <SiliconeJourney />
      </Section>

      <Section eyebrow="Why engineers choose it" title="Six properties that make silicone essential">
        <div data-reveal="stagger" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <div key={p.title} className="border-l-2 border-brand-400 pl-5">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-1.5 leading-relaxed text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted" eyebrow="Where you’ll find it" title="Silicone in the industries shaping the future">
        <div data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((a) => (
            <Link key={a.slug} href={`/applications/${a.slug}`} data-tilt className="group card lift flex items-start gap-4 p-5">
              <Illustration name={a.illustration} className="h-16 w-24 shrink-0 text-slate-800" />
              <div>
                <h3 className="font-bold group-hover:text-brand-700">{a.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{a.examples.slice(0, 3).join(' · ')}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Questions" title="Silicone FAQs">
        <FaqList faqs={siliconeFaqs} />
      </Section>

      <CtaBand title="Need silicone for a specific job?" body="Tell us what your product has to survive: heat, flexing, fire, water or the human body. We’ll recommend a grade or develop one." />
    </>
  )
}

import Link from 'next/link'
import { CableAnatomy } from '@/components/CableAnatomy'
import { JourneyScroll, SiliconVsSilicone } from '@/components/infographics'
import { TemperatureRange } from '@/components/TemperatureRange'
import { Arrow, CtaBand, FaqList, PageHeader, Section } from '@/components/ui'
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
  { title: 'Handles heat and cold', body: 'Stays flexible from about −40 °C to 150–200 °C, and further in special types.' },
  { title: 'Bends without breaking', body: 'It is soft and stretchy, so it survives being twisted and bent again and again.' },
  { title: 'Keeps water out', body: 'Water runs off it, so it makes excellent seals.' },
  { title: 'Medical-grade', body: 'Medical-grade silicone is well tolerated by the body and can be sterilised again and again.' },
  { title: 'Lasts for years', body: 'Sunlight, weather and heat wear it down far more slowly than most plastics and rubbers.' },
  { title: 'Can be made flame-retardant', body: 'With the right additives, it stops burning once the flame is taken away.' },
]

export default function SiliconePage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/silicone', label: 'Silicone' }]}
        eyebrow="Silicone 101"
        title="What is silicone, and why does it *matter?*"
        intro="Silicone is a flexible, heat-proof material made mostly from silicon and oxygen. You rarely notice it, but it is inside your phone cable, your car, hospital equipment and the data centres that run AI."
      />

      <Section eyebrow="Not the same thing" title="Silicon vs *silicone*" intro="The names are one letter apart, but the materials are very different. Silicon is the raw element; silicone is the versatile material made from it.">
        <SiliconVsSilicone />
      </Section>

      <JourneyScroll
        tone="muted"
        eyebrow="From sand to product"
        title="How silicone is *made*"
        intro="Silicone starts as quartz sand. MoMixx compounds it for specific jobs (step four), builds the machines that shape it (step five) and rebuilds scrap into recycled silicone (step seven)."
      />

      <Section eyebrow="Why people choose it" title="Six reasons silicone is *everywhere*">
        <div data-reveal="stagger" className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p, i) => (
            <div key={p.title} className="bg-ink-950 p-8">
              <span className="font-mono text-xs text-zinc-500">0{i + 1}</span>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-zinc-400">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted" eyebrow="Heat and cold" title="Works where plastics *give up*" intro="Silicone stays flexible in deep cold and keeps its shape in heat that softens common cable plastics.">
        <TemperatureRange />
      </Section>

      <Section eyebrow="Inside the cable" title="Anatomy of a *silicone cable*" intro="A typical charging cable has five layers. The silicone on the outside is the part you touch, and it protects everything inside.">
        <CableAnatomy />
      </Section>

      <Section tone="muted" eyebrow="Where you’ll find it" title="Where silicone is *used*">
        <div data-reveal="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((a) => (
            <Link key={a.slug} href={`/applications/${a.slug}`} className="group card lift flex items-center gap-5 overflow-hidden p-6">
              <div className="min-w-0">
                <h3 className="font-semibold tracking-[-0.02em]">{a.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{a.examples.slice(0, 3).join(' · ')}</p>
              </div>
              <Arrow className="ml-auto shrink-0 text-zinc-500 group-hover:text-brand-300" />
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Questions" title="Silicone *FAQs*">
        <FaqList faqs={siliconeFaqs} />
      </Section>

      <CtaBand title="Need silicone for a *specific job?*" body="Tell us what your product has to survive: heat, flexing, fire, water or the human body. We’ll recommend a grade or develop one." />
    </>
  )
}

import { CertCard } from '@/components/CertCard'
import { RecycleOrbit } from '@/components/infographics'
import { Render } from '@/components/Render'
import { Scene3D } from '@/components/three/Scene3D'
import { ArrowLink, CtaBand, FaqList, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { certifications } from '@/content/company'
import { recyclingFacts } from '@/content/markets'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Recycled silicone: our process and certifications',
  description:
    'How Momixx chemically recycles silicone waste into new, high-performance silicone, certified under GRS, ISCC PLUS and SCS Global Services, with traceability for every batch.',
  path: '/recycled-silicone',
})

// Answer-first FAQs (also marked up as FAQPage) for search and AI answer engines.
const recycledFaqs = [
  {
    q: 'What is recycled silicone?',
    a: 'Recycled silicone is silicone made from silicone waste, such as factory offcuts (post-industrial) and used products (post-consumer), instead of only virgin raw materials. Momixx uses chemical recycling: the waste is broken down into cyclic siloxanes, purified, and rebuilt into new silicone.',
  },
  {
    q: 'Is recycled silicone as good as virgin silicone?',
    a: 'It depends on how it is recycled. Grinding silicone into powder and reusing it as filler lowers strength, which researchers describe as downcycling. Chemical recycling rebuilds silicone from its molecular building blocks, so it can perform like virgin material. Momixx uses the chemical route.',
  },
  {
    q: 'What certifications does Momixx recycled silicone have?',
    a: 'Momixx recycled silicone is certified under the Global Recycled Standard (GRS), ISCC PLUS and SCS Global Services recycled content certification. To our knowledge, Momixx is the only silicone company certified under both GRS and ISCC PLUS.',
  },
  {
    q: 'What silicone waste can be recycled?',
    a: 'Both post-industrial scrap, such as offcuts and rejects from moulding and extrusion, and post-consumer silicone products. Contact us to discuss the type and volume of scrap you have.',
  },
  {
    q: 'Which Momixx grades are available with recycled content?',
    a: 'Recycled content is available across Momixx grades on request, including recycled-content cable silicone. Tell us your specification and recycled-content target.',
  },
]

const efficiency = [
  { value: '30%', label: 'less electricity in our curing ovens' },
  { value: '20×', label: 'lower VOC emissions with dip coating vs spray' },
  { value: '~4%', label: 'material waste per bucket avoided by our LSR mixer' },
]

export default function RecycledSiliconePage() {
  const recyclingCerts = certifications.filter((c) => c.group === 'recycling')
  const qualityCerts = certifications.filter((c) => c.group === 'quality')
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/recycled-silicone', label: 'Recycled Silicone' }]}
        eyebrow="Sustainability"
        title="Recycled silicone, *certified and traceable*"
        intro="Recycled silicone is new silicone made from silicone waste, such as factory offcuts and used products, instead of only virgin raw materials. We recycle chemically: breaking waste back into its molecular building blocks, then rebuilding silicone that performs like the original."
        aside={
          <Scene3D
            variant="recycle"
            className="h-full"
            fallback={<Render name="recycle" priority className="h-full w-full object-contain" />}
          />
        }
      />

      <Section eyebrow="The problem" title="Very little silicone is *recycled today*">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-lg leading-relaxed text-slate-200">
            <p>{recyclingFacts.summary}</p>
            <p>{recyclingFacts.landfill.text}</p>
            <p>
              Most silicone makers still use only virgin raw materials, while brands are increasingly looking for recycled materials they can trust.
            </p>
          </div>
          <figure className="card p-7 sm:p-10">
            <figcaption className="text-sm font-semibold text-white">Silicone made vs chemically recycled, 2024 (estimated)</figcaption>
            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Produced worldwide</span>
                  <span className="font-semibold text-white">{recyclingFacts.producedTonnes}</span>
                </div>
                <div data-grow className="mt-3 h-7 w-full rounded-r-[4px] bg-[#5a6474]" role="img" aria-label={`Produced: ${recyclingFacts.producedTonnes}`} />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Chemically recycled</span>
                  <span className="font-semibold text-white">{recyclingFacts.recycledTonnes}</span>
                </div>
                <div data-grow className="mt-3 h-7 w-[1.4%] min-w-[5px] rounded-r-[4px] bg-[#1caa9e] shadow-[0_0_14px_#1caa9e]" role="img" aria-label={`Recycled: ${recyclingFacts.recycledTonnes}`} />
              </div>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              Bars to scale. Source:{' '}
              <a href={recyclingFacts.source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {recyclingFacts.source.publisher}
              </a>
              , {recyclingFacts.source.date}.
            </p>
          </figure>
        </div>
      </Section>

      <Section tone="muted" eyebrow="Our process" title="How we recycle silicone, *step by step*" intro="Unlike shredding silicone into filler, chemical recycling takes it back to its molecular building blocks, so the new silicone performs like virgin material.">
        <RecycleOrbit />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="card p-7">
            <h3 className="font-semibold">Post-industrial recycled (PIR)</h3>
            <p className="mt-2 text-slate-400">Offcuts and rejects collected from factories before the silicone ever reaches a consumer.</p>
          </div>
          <div className="card p-7">
            <h3 className="font-semibold">Post-consumer recycled (PCR)</h3>
            <p className="mt-2 text-slate-400">Silicone products that have been used and thrown away, given a second life.</p>
          </div>
        </div>
      </Section>

      <Section id="certificates" eyebrow="Proof" title="*Certifications*" intro="Independent bodies audit our recycling process and supply chain, so customers and their customers can trust every recycled-content claim.">
        <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {recyclingCerts.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
        </ul>
        <h3 className="mt-14 text-xl font-semibold">Quality</h3>
        <ul data-reveal="stagger" className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {qualityCerts.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
        </ul>
      </Section>

      <Section tone="muted" eyebrow="Beyond recycling" title="Cleaner manufacturing, *by design*" intro="Our machines are designed to cut energy, emissions and waste in every production run.">
        <StatTiles stats={efficiency} />
        <div className="mt-10">
          <FeatureGrid
            items={[
              { title: 'Solar power', body: 'Solar generation at our facilities supports our carbon-reduction work.' },
              { title: 'End-of-life take-back', body: 'We are introducing end-of-life treatment for silicone goods to keep them out of landfill.' },
              { title: 'PFAS-free alternatives', body: 'High-density silicone replaces fluorinated rubbers that contain “forever chemicals”.' },
            ]}
          />
        </div>
      </Section>

      <Section eyebrow="Questions" title="Recycled silicone *FAQs*">
        <FaqList faqs={recycledFaqs} />
        <div className="mt-10 flex flex-wrap gap-6">
          <ArrowLink href="/insights/silicone-recycling-explained">Silicone recycling explained</ArrowLink>
          <ArrowLink href="/insights/grs-vs-iscc-plus-vs-scs">GRS vs ISCC PLUS vs SCS</ArrowLink>
          <ArrowLink href="/insights/silicone-carbon-footprint">Silicone’s carbon footprint</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Have silicone waste, or a *recycled-content target?*" body="We work with manufacturers on both sides: collecting silicone scrap and supplying certified recycled silicone." />
    </>
  )
}

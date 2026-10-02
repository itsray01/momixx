import { CertCard } from '@/components/CertCard'
import { RecycleFlow } from '@/components/infographics'
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
    a: 'Recycled silicone is new silicone made from silicone waste, such as factory scraps and used products, instead of only fresh raw materials. Momixx recycles chemically: the waste is broken down into its basic building blocks, cleaned, and rebuilt into new silicone.',
  },
  {
    q: 'Is recycled silicone as good as new silicone?',
    a: 'It depends on how it is recycled. Grinding silicone into powder and mixing it back in makes it weaker. Chemical recycling rebuilds silicone from its basic building blocks, so it can work just like new material. Momixx uses the chemical route.',
  },
  {
    q: 'What certifications does Momixx recycled silicone have?',
    a: 'Momixx recycled silicone is certified under the Global Recycled Standard (GRS), ISCC PLUS and SCS Global Services recycled content certification. To our knowledge, Momixx is the only silicone company certified under both GRS and ISCC PLUS.',
  },
  {
    q: 'What silicone waste can be recycled?',
    a: 'Both factory scrap, such as offcuts and rejected parts, and silicone products people have used and thrown away. Contact us to talk about the type and amount of scrap you have.',
  },
  {
    q: 'Which Momixx silicones come with recycled content?',
    a: 'Any Momixx silicone can be made with recycled content on request, including our cable silicone. Tell us what you need and how much recycled content you are aiming for.',
  },
]

const efficiency = [
  { value: '30%', label: 'less electricity in our ovens' },
  { value: '20×', label: 'fewer polluting fumes by dipping instead of spraying' },
  { value: '~4%', label: 'of each bucket of silicone saved by our mixer' },
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
        intro="Recycled silicone is new silicone made from silicone waste, such as factory scraps and used products. We break the waste back down into its basic building blocks, then rebuild it into silicone that works like new."
      />

      <Section eyebrow="The problem" title="Very little silicone is *recycled today*">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-lg leading-relaxed text-slate-200">
            <p>{recyclingFacts.summary}</p>
            <p>{recyclingFacts.landfill.text}</p>
            <p>
              Most silicone makers still use only fresh raw materials, while more and more brands want recycled materials they can trust.
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
                <div data-grow className="mt-3 h-7 w-[1.4%] min-w-[5px] rounded-r-[4px] bg-[#1caa9e]" role="img" aria-label={`Recycled: ${recyclingFacts.recycledTonnes}`} />
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

      <Section tone="muted" eyebrow="Our process" title="How we recycle silicone, *step by step*" intro="Shredding silicone only turns it into filler. We take it right back to its basic building blocks, so the new silicone works like new.">
        <RecycleFlow />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="card p-7">
            <h3 className="font-semibold">Factory scrap</h3>
            <p className="mt-2 text-slate-400">Offcuts and rejected parts collected from factories before the silicone ever reaches a shop.</p>
          </div>
          <div className="card p-7">
            <h3 className="font-semibold">Used products</h3>
            <p className="mt-2 text-slate-400">Silicone products that have been used and thrown away, given a second life.</p>
          </div>
        </div>
      </Section>

      <Section id="certificates" eyebrow="Proof" title="*Certifications*" intro="Independent bodies check our recycling and supply chain, so our customers, and theirs, can trust every claim about recycled content.">
        <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {recyclingCerts.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
        </ul>
        {qualityCerts.length > 0 && (
          <p className="mt-8 text-sm text-slate-400">
            Our Penang factory is also certified to ISO 13485, the quality standard for medical devices.{' '}
            <ArrowLink href="/sustainability">All certifications</ArrowLink>
          </p>
        )}
      </Section>

      <Section tone="muted" eyebrow="Beyond recycling" title="Cleaner manufacturing, *by design*" intro="Our machines are designed to use less energy and create less pollution and waste every time they run.">
        <StatTiles stats={efficiency} />
        <div className="mt-10">
          <FeatureGrid
            items={[
              { title: 'Solar power', body: 'Solar panels at our factories supply part of our electricity.' },
              { title: 'Taking products back', body: 'We are starting to take back old silicone products, to keep them out of landfill.' },
              { title: 'PFAS-free alternatives', body: 'Our dense silicone replaces rubbers that contain “forever chemicals”.' },
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

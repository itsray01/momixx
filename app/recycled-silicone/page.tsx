import { Leaf, Package, Sun } from 'lucide-react'
import Link from 'next/link'
import { CertCard } from '@/components/CertCard'
import { Render } from '@/components/Render'
import { RecycleFlow, recycleSteps } from '@/components/infographics'
import { ArrowLink, CtaBand, FaqList, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { getApplication } from '@/content/applications'
import { certifications, recyclingCertifications } from '@/content/company'
import { recyclingFacts } from '@/content/markets'
import { getProduct } from '@/content/products'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Recycled silicone: our process and certifications',
  description:
    'How MoMixx chemically recycles silicone waste into new, high-performance silicone, certified under GRS, RCS, ISCC PLUS and SCS Global Services, with traceability for every batch.',
  path: '/recycled-silicone',
})

// Answer-first FAQs (also marked up as FAQPage) for search and AI answer engines.
const recycledFaqs = [
  {
    q: 'What is recycled silicone?',
    a: 'Recycled silicone is new silicone made from silicone waste, such as factory scraps and used products, instead of only fresh raw materials. MoMixx recycles chemically: the waste is broken down into its basic building blocks, cleaned, and rebuilt into new silicone.',
  },
  {
    q: 'Is recycled silicone as good as new silicone?',
    a: 'It depends on how it is recycled. Grinding silicone into powder and mixing it back in makes it weaker. Chemical recycling rebuilds silicone from its basic building blocks, so it can work just like new material. MoMixx uses the chemical route.',
  },
  {
    q: 'What certifications does MoMixx recycled silicone have?',
    a: 'MoMixx recycled silicone is certified under the Global Recycled Standard (GRS), ISCC PLUS and SCS Global Services recycled content certification. To our knowledge, MoMixx is the only silicone company certified under both GRS and ISCC PLUS.',
  },
  {
    q: 'What silicone waste can be recycled?',
    a: 'Both factory scrap, such as offcuts and rejected parts, and silicone products people have used and thrown away. Contact us to talk about the type and amount of scrap you have.',
  },
  {
    q: 'Which MoMixx silicones come with recycled content?',
    a: 'Any MoMixx silicone can be made with recycled content on request, including our cable silicone. Tell us what you need and how much recycled content you are aiming for.',
  },
]

const efficiency = [
  { value: '30%', label: 'less electricity in our ovens' },
  { value: '20×', label: 'fewer polluting fumes by dipping instead of spraying' },
  { value: '~4%', label: 'of each bucket of silicone saved by our mixer' },
]

export default function RecycledSiliconePage() {
  const recyclingCerts = certifications.filter((c) => c.group === 'recycling')
  // The material as sold (formerly its own product page): its benefits and where it goes.
  const material = getProduct('recycled-silicone')
  const apps = (material?.applications ?? []).map(getApplication).filter((a) => a !== undefined)
  const qualityCerts = certifications.filter((c) => c.group === 'quality')
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/recycled-silicone', label: 'Recycled Silicone' }]}
        eyebrow="Sustainability"
        title="Recycled silicone, *certified and traceable*"
        intro="Recycled silicone is new silicone made from silicone waste, such as factory scraps and used products. We break the waste back down into its basic building blocks, then rebuild it into silicone that performs like new."
        facts={[
          { value: String(recyclingCertifications.length), label: 'recycled-content certifications' },
          { value: String(recycleSteps.length), label: 'steps from scrap to new silicone' },
        ]}
        visual={<Render name="recycle" alt="" priority sizes="(min-width: 1024px) 45vw, 100vw" />}
      />

      <Section eyebrow="The problem" title="Very little silicone is *recycled today*">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-lg leading-relaxed text-zinc-200">
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
                  <span className="text-zinc-400">Produced worldwide</span>
                  <span className="font-semibold text-white">{recyclingFacts.producedTonnes}</span>
                </div>
                <div data-grow className="mt-3 h-7 w-full rounded-r-[4px] bg-[#5a6474]" role="img" aria-label={`Produced: ${recyclingFacts.producedTonnes}`} />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Chemically recycled</span>
                  <span className="font-semibold text-white">{recyclingFacts.recycledTonnes}</span>
                </div>
                <div data-grow className="mt-3 h-7 w-[1.4%] min-w-[5px] rounded-r-[4px] bg-[#168447]" role="img" aria-label={`Recycled: ${recyclingFacts.recycledTonnes}`} />
              </div>
            </div>
            <p className="mt-6 text-xs text-zinc-400">
              Bars to scale. Source:{' '}
              <a href={recyclingFacts.source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {recyclingFacts.source.publisher}
              </a>
              , {recyclingFacts.source.date}.
            </p>
          </figure>
        </div>
      </Section>

      <Section tone="muted" eyebrow="Our process" title="How we recycle silicone, *step by step*" intro="Ground silicone is only a filler, and it weakens new material. We take it back to its basic building blocks, so the new silicone performs like new.">
        <RecycleFlow />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="card p-7">
            <h3 className="font-semibold">Factory scrap</h3>
            <p className="mt-2 text-zinc-400">Offcuts and rejected parts collected from factories before the silicone ever reaches a shop.</p>
          </div>
          <div className="card p-7">
            <h3 className="font-semibold">Used products</h3>
            <p className="mt-2 text-zinc-400">Silicone products that have been used and thrown away, given a second life.</p>
          </div>
        </div>
      </Section>

      {material?.benefits && (
        <Section id="material" eyebrow="The material" title="Recycled silicone that *performs like new*">
          <FeatureGrid items={material.benefits} />
          {(material.uses || apps.length > 0) && (
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <h3 className="text-sm font-semibold text-white">Used in</h3>
              <ul className="flex flex-wrap gap-2">
                {apps.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/applications/${a.slug}`} className="block rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white transition-colors hover:border-white/40">
                      {a.tabLabel} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
                {material.uses?.map((u) => (
                  <li key={u} className="rounded-full border border-white/10 px-3.5 py-1.5 text-sm text-zinc-300">
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      <Section id="certificates" tone="muted" eyebrow="Proof" title="*Certifications*" intro="Independent bodies audit our recycling and supply chain, so customers, and their customers, can rely on our recycled-content claims.">
        <ul data-reveal="stagger" className={`grid gap-5 md:grid-cols-2 ${recyclingCerts.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
          {recyclingCerts.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
        </ul>
        {qualityCerts.length > 0 && (
          <p className="mt-8 text-sm text-zinc-400">
            Our Batu Kawan factory’s quality system is also certified to ISO 13485, the standard for medical-device manufacturing.{' '}
            <ArrowLink href="/sustainability">All certifications</ArrowLink>
          </p>
        )}
      </Section>

      <Section eyebrow="Beyond recycling" title="Cleaner manufacturing, *by design*" intro="Our machines are designed to use less energy and create less pollution and waste.">
        <StatTiles stats={efficiency} />
        <div className="mt-10">
          <FeatureGrid
            items={[
              { icon: Sun, title: 'Solar power', body: 'Solar panels at our factories supply part of our electricity.' },
              { icon: Package, title: 'Silicone scrap collection', body: 'We collect silicone scrap and used products for recycling. Contact us with the type and volume of material available.' },
              { icon: Leaf, title: 'PFAS-free alternatives', body: 'Our high-density silicone replaces rubbers that contain “forever chemicals”.' },
            ]}
          />
        </div>
      </Section>

      <Section tone="muted" eyebrow="Questions" title="Recycled silicone *FAQs*">
        <FaqList faqs={recycledFaqs} />
        <div className="mt-10 flex flex-wrap gap-6">
          <ArrowLink href="/insights/silicone-recycling-explained">Silicone recycling explained</ArrowLink>
          <ArrowLink href="/insights/grs-vs-iscc-plus-vs-scs">GRS vs ISCC PLUS vs SCS</ArrowLink>
          <ArrowLink href="/insights/silicone-carbon-footprint">Silicone’s carbon footprint</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Silicone waste and *recycled content*" body="We work with manufacturers at both ends of the cycle: collecting silicone scrap and supplying certified recycled silicone." />
    </>
  )
}

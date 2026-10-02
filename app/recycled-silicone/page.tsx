import Image from 'next/image'
import { RecycleOrbit } from '@/components/infographics'
import { Render } from '@/components/Render'
import { Scene3D } from '@/components/three/Scene3D'
import { CtaBand, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { certifications } from '@/content/company'
import { recyclingFacts } from '@/content/markets'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Recycled silicone: our process and certifications',
  description:
    'How Momixx chemically recycles silicone waste into new, high-performance silicone, certified under GRS, ISCC PLUS and SCS Global Services, with traceability for every batch.',
  path: '/recycled-silicone',
})

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
        intro="Silicone lasts for decades, which also means it doesn’t break down in landfill. We turn silicone waste back into new silicone that performs like the original."
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

      <CtaBand title="Have silicone waste, or a *recycled-content target?*" body="We work with manufacturers on both sides: collecting silicone scrap and supplying certified recycled silicone." />
    </>
  )
}

function CertCard({ cert }: { cert: (typeof certifications)[number] }) {
  return (
    <li data-tilt className="card lift flex flex-col p-7">
      <div className="flex h-16 items-center">
        {cert.logo ? (
          <Image src={cert.logo} alt={`${cert.name} logo`} width={120} height={64} className="h-14 w-auto object-contain" />
        ) : (
          <span className="rounded-xl border border-brand-400/30 bg-brand-400/10 px-3.5 py-2 text-lg font-semibold tracking-[-0.02em] text-brand-100">{cert.short}</span>
        )}
      </div>
      <h4 className="mt-4 font-semibold text-white">{cert.name}</h4>
      <p className="mt-0.5 text-xs text-slate-500">
        {cert.issuer}
        {cert.year ? ` · since ${cert.year}` : ''}
      </p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{cert.plain}</p>
      {cert.file ? (
        <a href={cert.file} target="_blank" rel="noopener" className="mt-5 text-sm font-semibold text-brand-300 hover:text-brand-200">
          View certificate (PDF) <span aria-hidden="true">→</span>
        </a>
      ) : (
        <p className="mt-5 text-sm text-slate-500">Certificate available on request</p>
      )}
    </li>
  )
}

import Image from 'next/image'
import { CertCard } from '@/components/CertCard'
import { RecycleSteps } from '@/components/infographics'
import { ArrowLink, CtaBand, FeatureGrid, PageHeader, Section } from '@/components/ui'
import { certifications, recyclingCertifications } from '@/content/company'
import { recyclingFacts } from '@/content/markets'
import { carbonComparison, carbonLevers, carbonMetrics, certificationClaim, greenPhotos } from '@/content/sustainability'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Sustainability: certified recycled silicone',
  description:
    'MoMixx sustainability: GRS and ISCC PLUS certified recycled silicone, an independently checked carbon footprint calculation, energy-saving manufacturing and PFAS-free materials.',
  path: '/sustainability',
})

export default function SustainabilityPage() {
  const recycling = certifications.filter((c) => c.group === 'recycling')
  const featured = recycling.filter((c) => c.id === 'grs' || c.id === 'iscc-plus')
  const others = certifications.filter((c) => c.id !== 'grs' && c.id !== 'iscc-plus')
  const carbonCert = certifications.find((c) => c.id === 'carbon')
  const cmp = carbonComparison

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/sustainability', label: 'Sustainability' }]}
        eyebrow="Sustainability"
        title="Silicone with a *smaller footprint*"
        intro="Sustainability is built into how we make silicone: certified recycled material, a carbon footprint calculation checked by an independent third party, and machines designed to waste less."
        facts={[
          { value: String(recyclingCertifications.length), label: 'recycled-content certifications' },
          { value: '~30%', label: 'less electricity in our curing ovens' },
        ]}
      >
        <p className="mt-8 inline-flex max-w-xl items-start gap-3 rounded-2xl border border-brand-400/30 bg-brand-400/10 px-4 py-3 text-sm text-brand-100">
          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
          {certificationClaim.headline}
        </p>
      </PageHeader>

      {/* Certifications */}
      <Section eyebrow="Certified" title="Independently *checked*" intro="A recycling claim is only as good as the checks behind it. Two international schemes, GRS and ISCC PLUS, audit the chain of custody of our recycled content, from collected waste to finished silicone.">
        <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-2">
          {featured.map((c) => (
            <CertCard key={c.id} cert={c} featured />
          ))}
        </ul>
        <ul data-reveal="stagger" className="mt-5 grid gap-5 md:grid-cols-3">
          {others.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
        </ul>
      </Section>

      {/* Carbon footprint */}
      <Section id="carbon-footprint" tone="muted" eyebrow="Carbon footprint" title="Our carbon *footprint*">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div data-reveal className="lg:sticky lg:top-28">
            <p className="text-lg leading-relaxed text-slate-300">
              We calculate the greenhouse gases released in making our silicone, and an independent third party has checked the calculation. The
              validation statement, with its scope and method, is available on request.
            </p>
            <p className="mt-4 leading-relaxed text-slate-400">How we reduce our footprint:</p>
            {carbonCert?.file && (
              <a href={carbonCert.file} target="_blank" rel="noopener" className="mt-6 inline-block text-sm font-medium text-brand-300 hover:text-brand-200">
                View validation statement (PDF) <span aria-hidden="true">→</span>
              </a>
            )}
          </div>

          <div className="space-y-5">
            {carbonMetrics.length > 0 && (
              <dl data-reveal="stagger" className="card grid gap-px overflow-hidden bg-white/[0.06] sm:grid-cols-2">
                {carbonMetrics.map((m) => (
                  <div key={m.label} className="flex flex-col-reverse gap-2 bg-ink-900 p-7">
                    <dt className="text-sm text-slate-400">
                      {m.label}
                      {m.note && <span className="mt-1 block text-xs text-slate-500">{m.note}</span>}
                    </dt>
                    <dd className="font-display text-4xl font-semibold tracking-[-0.04em] text-white">
                      {m.value}
                      {m.unit && <span className="ml-1.5 text-base font-normal text-slate-400">{m.unit}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {cmp && (
              <figure data-reveal className="card p-7">
                <figcaption className="text-sm font-medium text-white">Recycled vs new silicone ({cmp.unit})</figcaption>
                <div className="mt-5 space-y-3">
                  {[
                    { label: 'MoMixx recycled', v: cmp.recycled, c: '#e4e4e7' },
                    { label: 'New silicone', v: cmp.virgin, c: '#5a6474' },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-3">
                      <span className="w-36 shrink-0 text-sm text-slate-300">{b.label}</span>
                      <div data-grow className="h-7 rounded-r-[4px]" style={{ width: `${(b.v / Math.max(cmp.recycled, cmp.virgin)) * 70}%`, background: b.c }} />
                      <span className="text-sm font-medium text-white tabular-nums">{b.v}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  {cmp.boundary}. Source: {cmp.source}.
                </p>
              </figure>
            )}
            <div data-reveal="stagger" className="grid gap-5 sm:grid-cols-2">
              {carbonLevers.map((l, i) => (
                <div key={l.title} data-tilt className="card lift p-6">
                  <span className="font-mono text-xs text-slate-500">0{i + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">{l.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{l.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Recycling */}
      <Section eyebrow="Circular silicone" title="From waste to *new silicone*">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-lg leading-relaxed text-slate-300">{recyclingFacts.summary}</p>
            <ArrowLink href="/recycled-silicone" className="mt-8">
              How our recycled silicone works
            </ArrowLink>
          </div>
          <RecycleSteps />
        </div>
      </Section>

      {/* Green initiatives photos: appears once photos are added in content/sustainability.ts */}
      {greenPhotos.length > 0 && (
        <Section tone="muted" eyebrow="On the ground" title="Our green *initiatives*">
          <ul data-reveal="stagger" className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
            {greenPhotos.map((p) => (
              <li key={p.src} className="card break-inside-avoid overflow-hidden">
                <Image src={p.src} alt={p.alt} width={p.width ?? 1200} height={p.height ?? 900} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
                {p.caption && <p className="p-5 text-sm text-slate-400">{p.caption}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section tone={greenPhotos.length > 0 ? 'white' : 'muted'} eyebrow="Beyond recycling" title="Safer *materials*">
        <FeatureGrid
          items={[
            { title: 'PFAS-free', body: 'Standard silicone rubber contains no fluorine, so it is not a PFAS (“forever chemical”). Our high-density silicone can replace fluorinated rubber (FKM) in many watch straps, seals and car parts.' },
            { title: 'Recycled option', body: 'Any MoMixx silicone can be supplied with recycled content on request.' },
            { title: 'Certified chain of custody', body: 'Certified chain-of-custody records cover our recycled content from collected waste to finished silicone.' },
          ]}
        />
      </Section>

      <CtaBand title="Questions about our *certificates?*" body="Ask for certificate copies, our carbon validation statement or details of our recycled content." />
    </>
  )
}

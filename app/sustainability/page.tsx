import Image from 'next/image'
import { CertCard } from '@/components/CertCard'
import { RecycleSteps } from '@/components/infographics'
import { Render } from '@/components/Render'
import { Scene3D } from '@/components/three/Scene3D'
import { ArrowLink, CtaBand, FeatureGrid, Glow, PageHeader, Section } from '@/components/ui'
import { certifications } from '@/content/company'
import { recyclingFacts } from '@/content/markets'
import { carbonComparison, carbonLevers, carbonMetrics, certificationClaim, greenPhotos } from '@/content/sustainability'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Sustainability: certified recycled silicone and a smaller carbon footprint',
  description:
    'Momixx sustainability: GRS and ISCC PLUS certified recycled silicone, independently validated carbon footprint, energy-saving manufacturing and PFAS-free materials.',
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
        intro="Sustainability is built into how we make silicone: certified recycled material, a validated carbon footprint, and machines designed to waste less."
        aside={<Scene3D variant="recycle" className="h-full" fallback={<Render name="recycle" priority className="h-full w-full object-contain" />} />}
        mobileVisual={<Render name="recycle" priority className="mx-auto max-w-sm" sizes="100vw" />}
      >
        <p className="mt-8 inline-flex max-w-xl items-start gap-3 rounded-2xl border border-brand-400/30 bg-brand-400/10 px-4 py-3 text-sm text-brand-100">
          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300 shadow-[0_0_8px_var(--color-brand-300)]" />
          {certificationClaim.headline}
        </p>
      </PageHeader>

      {/* Certifications */}
      <Section eyebrow="Certified" title="Independently *audited*" intro="Recycled-content claims are only as good as the audit behind them. Two international schemes track our recycled silicone from source to finished product.">
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
      <Section id="carbon-footprint" tone="muted" eyebrow="Carbon footprint" title="Measured and *independently validated*">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div data-reveal className="card grain relative overflow-hidden p-8 sm:p-10">
            <Glow className="-top-48 -right-48" size={520} />
            <p className="relative text-xs font-medium tracking-[0.16em] text-brand-300 uppercase">{carbonCert?.issuer ?? 'Third-party validation'}</p>
            <p className="display-md relative mt-4">
              Product carbon footprint <em className="accent">independently validated</em>
            </p>
            <p className="relative mt-5 leading-relaxed text-slate-400">
              We measure the greenhouse-gas emissions of our silicone and have the results checked by an independent third party. The figures guide
              where we cut next.
            </p>
            {carbonCert?.file && (
              <a href={carbonCert.file} target="_blank" rel="noopener" className="relative mt-6 inline-block text-sm font-medium text-brand-300 hover:text-brand-200">
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
                <figcaption className="text-sm font-medium text-white">Recycled vs virgin silicone ({cmp.unit})</figcaption>
                <div className="mt-5 space-y-3">
                  {[
                    { label: 'Momixx recycled', v: cmp.recycled, c: '#1caa9e' },
                    { label: 'Virgin silicone', v: cmp.virgin, c: '#5a6474' },
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
                  <span className="font-mono text-xs text-brand-300">0{i + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">{l.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{l.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Recycling */}
      <Section eyebrow="Circular silicone" title="Silicone that *comes back*">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(closest-side, rgb(20 159 148 / 0.22), transparent)' }} />
            <Render name="recycle" className="relative" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          <div>
            <p className="text-lg leading-relaxed text-slate-300">{recyclingFacts.summary}</p>
            <div className="mt-8">
              <RecycleSteps compact />
            </div>
            <ArrowLink href="/recycled-silicone" className="mt-8">
              How our recycled silicone works
            </ArrowLink>
          </div>
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
            { title: 'PFAS-free', body: 'Silicone contains no fluorine. Our high-density grades can replace FKM rubber in watch straps, seals and EV parts.' },
            { title: 'Longer-lasting products', body: 'Our silicone cables survived twice as many twists as a high-grade TPE cable in our testing: built to last.' },
            { title: 'Traceable supply chain', body: 'Chain-of-custody certification means every batch of recycled silicone can be traced to its source.' },
          ]}
        />
      </Section>

      <CtaBand title="Have silicone waste, or a *recycled-content target?*" body="We work with manufacturers on both sides: collecting silicone scrap and supplying certified recycled silicone." />
    </>
  )
}

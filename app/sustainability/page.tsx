import Image from 'next/image'
import { Render } from '@/components/Render'
import { CertRegister } from '@/components/CertRegister'
import { ArrowLink, CtaBand, PageHeader, Section } from '@/components/ui'
import { certifications, formalCertifications } from '@/content/company'
import { recyclingFacts } from '@/content/markets'
import { carbonComparison, carbonLevers, carbonMetrics, certificationClaim, greenPhotos } from '@/content/sustainability'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Sustainability: certified recycled silicone',
  description:
    'MoMixx sustainability: GRS and ISCC PLUS certified recycled silicone, an independently checked carbon footprint calculation, energy-saving manufacturing and PFAS-free materials.',
  path: '/sustainability',
})

/** Small counts read better as words at the start of a sentence. */
const inWords = (n: number) => ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][n] ?? String(n)

export default function SustainabilityPage() {
  const carbonCert = certifications.find((c) => c.id === 'carbon')
  const cmp = carbonComparison

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/sustainability', label: 'Sustainability' }]}
        eyebrow="Sustainability"
        title="Silicone with a *smaller footprint*"
        intro="Certified recycled material, a carbon footprint calculation checked by an independent third party, and machines designed to reduce waste. Every claim on this page is backed by a record that can be checked."
        background={{ src: '/images/sustainability-banner.jpg', alt: 'Aerial view of dense green forest beside a dark river' }}
      />

      {/* The register: the page's evidence, in one ledger. */}
      <Section id="certificates" eyebrow="Certified" className="scroll-mt-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <h2 data-reveal className="display-md max-w-xl text-white">
            {certificationClaim.headline}
          </h2>
          <div data-reveal className="max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl lg:pt-2">
            <p>
              Independent bodies audit our recycled content, the quality system at our Batu Kawan factory and our carbon footprint calculation.{' '}
              {inWords(formalCertifications.length)} international certifications in all, listed here with the scheme, the issuer and where each can be
              verified.
            </p>
            <p className="mt-5 text-base text-zinc-400">Certification can be checked in the public GRS and ISCC PLUS certificate databases.</p>
          </div>
        </div>
        <div className="mt-16 sm:mt-20">
          <CertRegister certs={certifications} />
        </div>
      </Section>

      {/* Carbon footprint */}
      <Section id="carbon-footprint" tone="muted" eyebrow="Carbon footprint" title="A calculation that has *been checked*">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20">
          <div data-reveal className="lg:sticky lg:top-28">
            <p className="text-lg leading-relaxed text-zinc-300">
              We calculate the greenhouse gases released in making our silicone, and an independent third party has checked the calculation. The
              validation statement, with its scope and method, is available on request.
            </p>
            {carbonCert?.file && (
              <a href={carbonCert.file} target="_blank" rel="noopener" className="mt-6 inline-block text-sm font-medium text-brand-300 hover:text-brand-200">
                View validation statement (PDF) <span aria-hidden="true">→</span>
              </a>
            )}
            {carbonMetrics.length > 0 && (
              <dl data-reveal="stagger" className="mt-10 grid gap-8 sm:grid-cols-2">
                {carbonMetrics.map((m) => (
                  <div key={m.label} className="flex flex-col-reverse gap-2 border-t border-gold-400/40 pt-5">
                    <dt className="text-sm text-zinc-400">
                      {m.label}
                      {m.note && <span className="mt-1 block text-xs text-zinc-500">{m.note}</span>}
                    </dt>
                    <dd className="accent-figure font-display text-4xl font-semibold tracking-[-0.04em]">
                      {m.value}
                      {m.unit && <span className="ml-1.5 text-base font-normal text-zinc-400">{m.unit}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {cmp && (
              <figure data-reveal className="mt-10">
                <figcaption className="text-sm font-medium text-white">Recycled vs new silicone ({cmp.unit})</figcaption>
                <div className="mt-5 space-y-3">
                  {[
                    { label: 'MoMixx recycled', v: cmp.recycled, c: '#168447' },
                    { label: 'New silicone', v: cmp.virgin, c: '#9a9e9a' },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-3">
                      <span className="w-36 shrink-0 text-sm text-zinc-300">{b.label}</span>
                      <div data-grow className={`h-7 rounded-r-[4px] ${b.c === '#168447' ? 'bar-glow' : ''}`} style={{ width: `${(b.v / Math.max(cmp.recycled, cmp.virgin)) * 70}%`, background: b.c }} />
                      <span className="text-sm font-medium text-white tabular-nums">{b.v}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-zinc-500">
                  {cmp.boundary}. Source: {cmp.source}.
                </p>
              </figure>
            )}
          </div>

          {/* How the footprint comes down: six levers already described elsewhere on the site, as rows. */}
          <ul data-reveal="stagger" className="grid gap-x-10 sm:grid-cols-2">
            {carbonLevers.map((l) => {
              const Icon = l.icon
              return (
                <li key={l.title} className="flex gap-5 border-t border-white/10 py-7">
                  <span aria-hidden="true" className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-gold-400/35 bg-gold-100/60 text-gold-700">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">{l.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{l.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </Section>

      {/* Circular silicone */}
      <Section eyebrow="Circular silicone" title="From waste to *new silicone*">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div data-reveal className="mx-auto w-full max-w-md lg:max-w-none">
            <Render name="recycle" alt="Recycled silicone granules, in a ring" sizes="(min-width: 1024px) 40vw, 28rem" />
          </div>
          <div data-reveal>
            <p className="text-lg leading-relaxed text-zinc-300 sm:text-xl">{recyclingFacts.summary}</p>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              We break silicone waste back down to its basic building blocks and rebuild it into silicone that performs like new. Any MoMixx silicone
              can be supplied with recycled content on request.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink href="/recycled-silicone">How our recycled silicone works</ArrowLink>
              <ArrowLink href="/insights/grs-vs-iscc-plus-vs-scs">GRS, ISCC PLUS and SCS explained</ArrowLink>
            </div>
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
                {p.caption && <p className="p-5 text-sm text-zinc-400">{p.caption}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand title="Certificates and *documentation*" body="Request certificate copies, our carbon validation statement or details of our recycled content." />
    </>
  )
}

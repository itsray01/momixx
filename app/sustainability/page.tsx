import Image from 'next/image'
import { CertRegister } from '@/components/CertRegister'
import { LinkCard } from '@/components/LinkCard'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { certifications, formalCertifications } from '@/content/company'
import { certificationClaim, greenPhotos } from '@/content/sustainability'
import { pageMetadata, site } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Green: recycled silicone, carbon footprint and certifications',
  description:
    'MoMixx and the environment: GRS and ISCC PLUS certified recycled silicone, an independently checked carbon footprint calculation, ISO 13485 and our factories.',
  path: '/sustainability',
})

/** Small counts read better as words at the start of a sentence. */
const inWords = (n: number) => ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][n] ?? String(n)

const { batuKawan, perai, dongguan } = site.plants

// The factories, with what is certified at each. Green initiatives per site are to follow.
const factories = [
  {
    id: 'batu-kawan',
    name: 'Batu Kawan, Penang, Malaysia',
    company: batuKawan.company,
    role: 'Research and manufacturing',
    certified: ['GRS', 'RCS', 'ISO 13485'],
  },
  { id: 'perai', name: 'Perai, Penang, Malaysia', company: perai.company, role: 'Manufacturing', certified: [] },
  { id: 'dongguan', name: 'Dongguan, Guangdong, China', company: dongguan.company, role: 'Manufacturing', certified: [] },
]

export default function SustainabilityPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/sustainability', label: 'Green' }]}
        eyebrow="Green"
        title="Silicone with a *smaller footprint*"
        intro="Certified recycled material, a carbon footprint calculation checked by an independent third party, and machines designed to reduce waste. Every claim on this page is backed by a record that can be checked."
        background={{ src: '/images/sustainability-banner.jpg', alt: 'Aerial view of dense green forest beside a dark river' }}
      />

      {/* The three parts of Green in the site map. */}
      <Section>
        <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-3">
          <li>
            <LinkCard href="/recycled-silicone" kicker="Recycle" title="Recycled silicone" body="How we started, how we turn silicone waste into new silicone, and how it is audited." />
          </li>
          <li>
            <LinkCard href="/carbon-footprint" kicker="Carbon footprint" title="Our carbon footprint" body="An independently checked calculation, and how we bring the figure down." />
          </li>
          <li>
            <LinkCard href="#certificates" kicker="Sustainability" title="Certifications and factories" body="GRS, RCS, ISCC PLUS, SCS and ISO 13485, and the factories they cover." />
          </li>
        </ul>
      </Section>

      {/* The register: the page's evidence, in one ledger. */}
      <Section id="certificates" tone="muted" eyebrow="Certified" className="scroll-mt-28">
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

      {/* Factories */}
      <Section id="factories" eyebrow="Factories" title="Where we *make it*" intro="Solar panels at our factories supply part of our electricity. Details of the green initiatives at each site will follow." className="scroll-mt-28">
        <ul data-reveal="stagger" className="grid gap-x-10 md:grid-cols-3">
          {factories.map((f) => (
            <li key={f.id} className="border-t border-white/15 py-7">
              <p className="text-sm font-medium text-gold-600">{f.role}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em]">{f.name}</h3>
              <p className="mt-1.5 text-sm text-zinc-400">{f.company}</p>
              {f.certified.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {f.certified.map((c) => (
                    <li key={c} className="rounded-full border border-gold-400/45 bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-700">
                      {c}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-sm text-zinc-500">Site details to follow.</p>
              )}
            </li>
          ))}
        </ul>

        {/* Green initiatives photos: appear once photos are added in content/sustainability.ts */}
        {greenPhotos.length > 0 && (
          <ul data-reveal="stagger" className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
            {greenPhotos.map((p) => (
              <li key={p.src} className="card break-inside-avoid overflow-hidden">
                <Image src={p.src} alt={p.alt} width={p.width ?? 1200} height={p.height ?? 900} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
                {p.caption && <p className="p-5 text-sm text-zinc-400">{p.caption}</p>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <CtaBand title="Certificates and *documentation*" body="Request certificate copies, our carbon validation statement or details of our recycled content." />
    </>
  )
}

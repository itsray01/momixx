import { ArrowLink, CtaBand, PageHeader, Section } from '@/components/ui'
import { pageMetadata, site } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Locations: Singapore headquarters and Penang, Malaysia',
  description:
    'Momixx is headquartered in Singapore, with R&D and manufacturing at Batu Kawan, Penang, Malaysia (ISO 13485 certified), and a second large-volume facility in Asia. We supply customers worldwide.',
  path: '/locations',
})

const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

// One entry per site. Add a photo, full address and headcount once confirmed.
const sites = [
  {
    id: 'singapore',
    role: 'Headquarters',
    name: 'Singapore',
    address: [site.address.street, `Singapore ${site.address.postalCode}`],
    map: `${site.address.street}, Singapore ${site.address.postalCode}`,
    summary: 'Our corporate headquarters, where Momixx was founded in 2018.',
    facts: [
      { label: 'Role', value: 'Corporate headquarters' },
      { label: 'Founded', value: '2018' },
      { label: 'Contact', value: site.email, href: `mailto:${site.email}` },
    ],
  },
  {
    id: 'penang',
    role: 'Research and manufacturing',
    name: 'Batu Kawan, Penang, Malaysia',
    address: ['Batu Kawan', 'Penang, Malaysia'],
    map: 'Batu Kawan, Penang, Malaysia',
    summary:
      'Our research centre and factory in Batu Kawan, in one of Asia’s leading regions for chips and electronics. It makes liquid silicone in large volumes for the region, and high-precision parts for medical and chip-making customers.',
    facts: [
      { label: 'Certified', value: 'ISO 13485 (medical devices), 2026' },
      { label: 'Production', value: 'Liquid silicone made in volume for South-East Asia' },
      { label: 'Medical', value: 'Making medical devices for other companies since 2025' },
      { label: 'Precision', value: 'Parts for medical devices and chip-making machines' },
    ],
  },
]

export default function LocationsPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/about', label: 'Company' },
          { href: '/locations', label: 'Locations' },
        ]}
        eyebrow="Global presence"
        title="Built in Asia, *for the world*"
        intro="Our headquarters is in Singapore. We research and make our products in Penang, Malaysia, and at a second large factory in Asia. Customers around the world use our materials, machines and parts."
      />

      <Section eyebrow="Our sites" title="Where we *are*">
        <ul className="grid gap-5 lg:grid-cols-2">
          {sites.map((s) => (
            <li key={s.id} id={s.id} className="card flex scroll-mt-28 flex-col p-8 sm:p-10">
              <p className="text-xs font-medium tracking-[0.16em] text-brand-300 uppercase">{s.role}</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{s.name}</h3>
              <address className="mt-3 text-sm leading-relaxed text-slate-400 not-italic">
                {s.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-6 leading-relaxed text-slate-300">{s.summary}</p>
              <dl className="mt-8 grid flex-1 content-start gap-x-6 gap-y-4 border-t border-white/[0.08] pt-6 sm:grid-cols-2">
                {s.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs text-slate-500">{f.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-white">
                      {'href' in f && f.href ? (
                        <a href={f.href} className="underline decoration-white/20 underline-offset-4 hover:decoration-brand-300">
                          {f.value}
                        </a>
                      ) : (
                        f.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <a href={mapsUrl(s.map)} target="_blank" rel="noopener noreferrer" className="mt-8 self-start text-sm font-medium text-brand-300 hover:text-brand-200">
                Open in Google Maps <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" eyebrow="Worldwide" title="Serving customers *worldwide*">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <p className="text-lg leading-relaxed text-slate-300">
            We build for international markets and international standards. Our silicone carries certifications recognised across global supply chains: GRS, ISCC PLUS, SCS Global Services and ISO 13485.
          </p>
          <div className="flex flex-wrap gap-6 lg:justify-end">
            <ArrowLink href="/applications">Where our materials go</ArrowLink>
            <ArrowLink href="/sustainability">Certifications</ArrowLink>
            <ArrowLink href="/contact">Contact us</ArrowLink>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}

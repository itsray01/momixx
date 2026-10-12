import { Cog, FlaskConical, Recycle } from 'lucide-react'
import { Timeline } from '@/components/infographics'
import { RegionMap } from '@/components/RegionMap'
import { ArrowLink, CtaBand, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { companyStats, milestones } from '@/content/company'
import { teamReady } from '@/content/team'
import { pageMetadata, plantLines, site } from '@/lib/site'

export const metadata = pageMetadata({
  title: `About us: silicone company founded in ${site.foundingYear}`,
  description:
    `Founded in ${site.foundingYear}, MoMixx is a Singapore-headquartered silicone company with manufacturing in Penang, Malaysia, pioneering recycled silicone and high-speed silicone cable extrusion.`,
  path: '/about',
})

const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

const { batuKawan, perai } = site.plants

// One entry per site. Add a photo and headcount once confirmed.
const sites = [
  {
    id: 'singapore',
    wide: true,
    role: 'Headquarters',
    name: 'Singapore',
    address: [site.address.street, `Singapore ${site.address.postalCode}`],
    map: `${site.address.street}, Singapore ${site.address.postalCode}`,
    summary: `Our corporate headquarters, where MoMixx was founded in ${site.foundingYear}.`,
    facts: [
      { label: 'Role', value: 'Corporate headquarters' },
      { label: 'Founded', value: String(site.foundingYear) },
      { label: 'Contact', value: site.email, href: `mailto:${site.email}` },
    ],
  },
  {
    id: 'batu-kawan',
    role: 'Research and manufacturing',
    name: 'Batu Kawan, Penang, Malaysia',
    address: plantLines(batuKawan),
    map: plantLines(batuKawan).join(', '),
    summary:
      'Our research centre and factory in Batu Kawan, in one of Asia’s leading regions for chips and electronics. It makes liquid silicone in large volumes for the region, and high-precision parts for medical and chip-making customers.',
    facts: [
      { label: 'Certified', value: 'ISO 13485 quality system (medical devices), 2026' },
      { label: 'Production', value: 'Liquid silicone made in volume for South-East Asia' },
      { label: 'Medical', value: 'Making silicone parts for medical-device makers since 2025' },
      { label: 'Precision', value: 'Parts for medical devices and chip-making machines' },
    ],
  },
  {
    id: 'perai',
    role: 'Manufacturing',
    name: 'Perai, Penang, Malaysia',
    address: plantLines(perai),
    map: plantLines(perai).join(', '),
    summary: `${perai.company} runs our manufacturing plant in Perai, Penang.`,
    facts: [
      { label: 'Company', value: perai.company },
      { label: 'Role', value: 'Manufacturing' },
    ],
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/about', label: 'About Us' }]}
        eyebrow="About us"
        title={`Precision silicone, *since ${site.foundingYear}*`}
        intro={`MoMixx was founded in Singapore and Malaysia in ${site.foundingYear} to solve hard problems in silicone, from making cables safer to giving silicone waste a second life.`}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-zinc-200">
            <p>
              We started by making flame-retardant silicone for smartphone charging cables. Within a year, it was qualified by a leading smartphone
              brand. Since then we have grown into three connected businesses: silicone materials, the machines that shape them, and making finished
              parts.
            </p>
            <p>
              We were early to recycled silicone. Our recycled content is certified under three international schemes (GRS, ISCC PLUS and SCS), and an
              independent third party has checked our product carbon footprint calculation.
            </p>
            <p>
              Our headquarters is in Singapore. We make our products at our factories in Batu Kawan and Perai, Penang, Malaysia, and at a second large
              factory in Asia. In 2026 the Batu Kawan factory’s quality system was certified to ISO 13485 for medical-device manufacturing, and it began making
              high-precision parts for the medical and semiconductor industries.
            </p>
          </div>
          <StatTiles stats={companyStats} cols={1} />
        </div>
      </Section>

      <Section tone="muted" eyebrow="What we do" title="Three capabilities, *one company*">
        <FeatureGrid
          items={[
            { icon: FlaskConical, title: 'Create and make silicone', body: 'Flame-retardant, waterproof, high-density and colour-matched silicone, and self-bonding silicone, in liquid and solid form.' },
            { icon: Recycle, title: 'Recycle silicone waste', body: 'Our own chemical process turns scrap silicone back into new silicone.' },
            { icon: Cog, title: 'Design and build machines', body: 'We make the hardware and software ourselves, from our patented vertical extrusion line to energy-saving ovens and camera-guided winders.' },
          ]}
        />
      </Section>

      <Section id="milestones" eyebrow="Our journey" title="*Milestones*">
        <Timeline years={milestones} />
      </Section>

      {/* Locations (formerly their own page). The site ids (#singapore, #batu-kawan, #perai) are linked from Contact and the structured data. */}
      <Section
        tone="muted"
        id="locations"
        eyebrow="Locations"
        title="Built in Asia, *for the world*"
        intro="Our headquarters is in Singapore. We research and make our products at our Batu Kawan and Perai plants in Penang, Malaysia, and at a second large factory in Asia. Customers around the world use our materials, machines and parts."
        className="scroll-mt-24"
      >
        <div className="card overflow-hidden p-3 sm:p-8">
          <RegionMap links={{ singapore: '#singapore', penang: '#batu-kawan' }} />
        </div>
        <ul className="mt-5 grid gap-5 lg:grid-cols-2">
          {sites.map((s) => (
            <li key={s.id} id={s.id} className={`card flex scroll-mt-28 flex-col p-8 sm:p-10 ${'wide' in s ? 'lg:col-span-2' : ''}`}>
              <p className="text-xs font-medium tracking-[0.16em] text-zinc-400 uppercase">{s.role}</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{s.name}</h3>
              <address className="mt-3 text-sm leading-relaxed text-zinc-400 not-italic">
                {s.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-6 leading-relaxed text-zinc-300">{s.summary}</p>
              <dl className={`mt-8 grid flex-1 content-start gap-x-6 gap-y-4 border-t border-white/[0.08] pt-6 sm:grid-cols-2 ${'wide' in s ? 'lg:grid-cols-3' : ''}`}>
                {s.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs text-zinc-500">{f.label}</dt>
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
        <p className="mt-12 max-w-3xl text-lg leading-relaxed text-zinc-300">
          We build for international markets and international standards. Our recycled silicone is certified under GRS, ISCC PLUS and SCS Global Services, and our Batu Kawan factory’s quality system is certified to ISO 13485.
        </p>
        <div className="mt-8 flex flex-wrap gap-6">
          {teamReady && <ArrowLink href="/team">Meet our management team</ArrowLink>}
          <ArrowLink href="/innovation">Research & innovation</ArrowLink>
          <ArrowLink href="/culture">Culture & careers</ArrowLink>
          <ArrowLink href="/sustainability">Certifications</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Partner with *MoMixx*" body="Whether you are sourcing silicone, a cable line or a manufacturing partner, our team can help." secondary={{ href: '/innovation', label: 'Research & innovation' }} />
    </>
  )
}

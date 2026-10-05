import { Render } from '@/components/Render'
import { ArrowLink, CtaBand, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { companyStats, milestones } from '@/content/company'
import { teamReady } from '@/content/team'
import { pageMetadata, site } from '@/lib/site'

export const metadata = pageMetadata({
  title: `About us: silicone company founded in ${site.foundingYear}`,
  description:
    `Founded in ${site.foundingYear}, MoMixx is a Singapore-headquartered silicone company with manufacturing in Penang, Malaysia, pioneering recycled silicone and high-speed silicone cable extrusion.`,
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/about', label: 'About Us' }]}
        eyebrow="About us"
        title={`Precision silicone, *since ${site.foundingYear}*`}
        intro={`MoMixx was founded in Singapore and Malaysia in ${site.foundingYear} to solve hard problems in silicone, from making cables safer to giving silicone waste a second life.`}
        visual={<Render name="extruder-line" alt="" priority sizes="(min-width: 1024px) 45vw, 100vw" />}
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
            { title: 'Create and make silicone', body: 'Flame-retardant, waterproof, high-density and colour-matched silicone, and self-bonding silicone, in liquid and solid form.' },
            { title: 'Recycle silicone waste', body: 'Our own chemical process turns scrap silicone back into new silicone.' },
            { title: 'Design and build machines', body: 'We make the hardware and software ourselves, from our patented vertical extrusion line to energy-saving ovens and camera-guided winders.' },
          ]}
        />
      </Section>

      <Section id="milestones" eyebrow="Our journey" title="*Milestones*">
        <ol data-reveal="stagger" className="relative">
          {milestones.map((m) => (
            <li key={m.year} className="grid items-start gap-3 border-t border-white/[0.08] py-8 sm:grid-cols-[12rem_1fr] sm:gap-10">
              <h3 className="display-md flex items-center gap-4 leading-none text-white">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-300" />
                {m.year}
              </h3>
              <ul className="space-y-2 text-lg text-zinc-300">
                {m.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted" id="locations" eyebrow="Locations" title="Our *sites*">
        <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {site.locations.map((l) => (
            <li key={l.name} className="card lift p-7">
              <p className="text-xs font-medium tracking-[0.16em] text-zinc-400 uppercase">{l.role}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{l.name}</h3>
              <p className="mt-2 text-sm text-zinc-400">{l.detail}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-6">
          <ArrowLink href="/locations">All locations</ArrowLink>
          {teamReady && <ArrowLink href="/team">Meet our management team</ArrowLink>}
          <ArrowLink href="/innovation">Research & innovation</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Partner with *MoMixx*" body="Whether you are sourcing silicone, a cable line or a manufacturing partner, our team can help." secondary={{ href: '/locations', label: 'Our locations' }} />
    </>
  )
}

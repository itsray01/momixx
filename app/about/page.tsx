import { Illustration } from '@/components/Illustration'
import { Scene3D } from '@/components/three/Scene3D'
import { ArrowLink, CtaBand, FeatureGrid, PageHeader, Section, StatTiles } from '@/components/ui'
import { companyStats, milestones } from '@/content/company'
import { pageMetadata, site } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'About Momixx',
  description:
    'Founded in 2018, Momixx is a Singapore-headquartered silicone company with plants in Penang, Malaysia and Guangdong, China, pioneering recycled silicone and high-speed silicone cable extrusion.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/about', label: 'About Us' }]}
        eyebrow="About us"
        title="Precision silicone, since 2018"
        intro="Momixx was founded in Singapore and Malaysia in 2018 to solve hard problems in silicone, from making cables safer to giving silicone waste a second life."
        aside={<Scene3D variant="samples" className="h-full" fallback={<Illustration name="compound" className="h-full w-full text-slate-300" />} />}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-slate-700">
            <p>
              We began by developing fire-retardant silicone for smartphone power cables, and within a year our material was qualified by one of the
              world’s leading smartphone brands. Since then we have grown into three connected businesses: silicone materials, the machines that
              process them, and finished-part manufacturing.
            </p>
            <p>
              We are a pioneer in recycled silicone. Our recycling systems and supply chain are certified to international standards including GRS, ISCC
              PLUS and SCS Global Services, and our product carbon footprint has been independently validated.
            </p>
            <p>
              Today we manufacture in Batu Kawan, Penang (Malaysia) and Dongguan, Guangdong (China), with our headquarters in Singapore. In 2026 our
              Penang plant was certified to ISO 13485 for medical devices and expanded into high-precision components for the medical and
              semiconductor industries.
            </p>
          </div>
          <StatTiles stats={companyStats} cols={1} />
        </div>
      </Section>

      <Section tone="muted" eyebrow="What we do" title="Three capabilities, one company">
        <FeatureGrid
          items={[
            { title: 'Develop & manufacture silicone compounds', body: 'Fire-retardant, high-density, self-bonding, waterproof and colour-matched silicone, in liquid (LSR) and solid (HCR) form.' },
            { title: 'Recycle silicone waste', body: 'A proprietary chemical process converts scrap silicone back into silicone oil and new silicone.' },
            { title: 'Design & build extrusion machines', body: 'In-house hardware and software, from the patented vertical extrusion line to energy-saving ovens and vision-guided winders.' },
          ]}
        />
      </Section>

      <Section id="milestones" eyebrow="Our journey" title="Milestones">
        <ol data-reveal="stagger" className="relative space-y-10 border-l-2 border-slate-200 pl-8 sm:pl-10">
          {milestones.map((m) => (
            <li key={m.year} className="relative">
              <span aria-hidden="true" className="absolute top-1.5 -left-[2.6rem] h-4 w-4 rounded-full border-4 border-white bg-brand-500 ring-2 ring-brand-200 sm:-left-[3.1rem]" />
              <h3 className="font-display text-2xl font-extrabold text-slate-900">{m.year}</h3>
              <ul className="mt-2 space-y-1.5 text-slate-600">
                {m.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted" id="locations" eyebrow="Where we are" title="Locations">
        <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-3">
          {site.locations.map((l) => (
            <li key={l.name} data-tilt className="card lift p-6">
              <p className="text-xs font-bold tracking-widest text-brand-700 uppercase">{l.role}</p>
              <h3 className="mt-2 text-xl font-bold">{l.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{l.detail}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-6">
          <ArrowLink href="/team">Meet our management team</ArrowLink>
          <ArrowLink href="/innovation">Research & innovation</ArrowLink>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}

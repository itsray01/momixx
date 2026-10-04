import Link from 'next/link'
import { CtaBand, PageHeader, Section, StatTiles } from '@/components/ui'
import { companyStats, patentsSummary } from '@/content/company'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Research & innovation',
  description:
    'MoMixx research in silicone materials, surface treatment and manufacturing equipment, backed by more than 20 patents, granted or pending, including, to our knowledge, the first vertical silicone cable extrusion line.',
  path: '/innovation',
})

const areas = [
  {
    id: 'materials',
    title: 'Materials',
    items: [
      {
        title: 'Exact colour matching',
        body: 'Any colour, including bright shades and see-through silicone, matched to within ΔE94 0.50, a difference most people cannot see. It stays just as flame-retardant and strong.',
      },
      {
        title: 'Flame-retardant without losing strength',
        body: 'The additives that make silicone flame-retardant usually reduce its strength. Our grades are designed for the UL 94 material flammability test and for cables that pass UL VW-1, while keeping their strength.',
      },
      {
        title: 'Free of “forever chemicals”',
        body: 'A dense, silky silicone that feels as good as premium fluorinated-rubber watch straps, and is as strong, without the PFAS.',
      },
      {
        title: 'Chemical recycling',
        body: 'Breaking silicone scrap down into a liquid building block, then rebuilding it into new silicone, with certified chain-of-custody records for the recycled content.',
      },
    ],
  },
  {
    id: 'surface-treatment',
    title: 'Surface finishes',
    items: [
      {
        title: 'Dust-free cables',
        body: 'Silicone is slightly sticky, so it picks up dust. Dipping cables in our coating leaves them soft to the touch, stain-resistant and long-lasting.',
      },
      {
        title: 'Tough phone-case finish',
        body: 'A dipped finish that resists scratches and wear, with fewer rejects in our production than UV-cured coatings.',
      },
    ],
  },
  {
    id: 'equipment',
    title: 'Machines',
    items: [
      { title: 'Vertical extrusion line', body: 'To our knowledge, the world’s first vertical line for silicone data cable: up to 100 metres a minute.', href: '/products/vertical-extruder' },
      { title: 'Energy-saving oven', body: 'Uses about 30% less electricity than a standard curing oven and holds its temperature within ±5 °C.', href: '/products/energy-saving-oven' },
      { title: 'Low-waste mixer', body: 'Empties each bucket, saving the roughly 4% that standard mixers leave behind.', href: '/products/lsr-mixer' },
      { title: 'Camera-guided winder', body: 'A camera keeps the cable in place, so every spool is wound neatly.', href: '/products/autowinder' },
      { title: 'Dip-coating machine', body: 'Up to 20 times lower VOC (solvent fume) emissions than spray coating.', href: '/products/dip-coating-machine' },
    ],
  },
]

export default function InnovationPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/about', label: 'Company' },
          { href: '/innovation', label: 'Research & Innovation' },
        ]}
        eyebrow="Research & innovation"
        title="Setting new standards *in silicone*"
        intro="Our research covers everything from what goes into the silicone, to how its surface looks and feels, to the machines that shape it."
      />

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow">Patents</p>
            <h2 className="display-lg mt-5">
              More than <em className="accent not-italic">20 patents</em>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">{patentsSummary}</p>
          </div>
          <StatTiles
            cols={1}
            stats={companyStats.slice(1, 3)}
          />
        </div>
      </Section>

      {areas.map((area, i) => (
        <Section key={area.id} id={area.id} tone={i % 2 === 0 ? 'muted' : 'white'} eyebrow="Research area" title={area.title} className="scroll-mt-20">
          <div data-reveal="stagger" className="grid gap-5 md:grid-cols-2">
            {area.items.map((it) => (
              <div key={it.title} className="card lift p-7">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{it.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-400">{it.body}</p>
                {'href' in it && it.href && (
                  <Link href={it.href} className="mt-4 inline-block text-sm font-medium text-brand-300 hover:text-brand-200">
                    Product details <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Section>
      ))}

      <CtaBand title="Work with our *research team*" body="We develop new materials and methods with customers who need something that doesn’t exist yet." />
    </>
  )
}

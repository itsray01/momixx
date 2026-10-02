import Link from 'next/link'
import { Render } from '@/components/Render'
import { Scene3D } from '@/components/three/Scene3D'
import { CtaBand, PageHeader, Section, StatTiles } from '@/components/ui'
import { patentsSummary } from '@/content/company'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Research & innovation',
  description:
    'Momixx research in silicone materials, surface treatment and manufacturing equipment, backed by more than 20 patents including the first vertical silicone cable extrusion machine.',
  path: '/innovation',
})

const areas = [
  {
    id: 'materials',
    title: 'Materials',
    model: 'samples' as const,
    items: [
      {
        title: 'Exact colour matching',
        body: 'Any colour, including vivid shades on transparent, translucent or opaque bases, held to within dE94 0.50 of the target (a difference too small for most people to see), without compromising fire retardancy or strength.',
      },
      {
        title: 'Fire retardancy without weakness',
        body: 'Flame-retardant additives normally weaken silicone. Our formulations meet UL 94 (material) and UL 2556 VW-1 (cable) burn standards and UL ageing tests while keeping their strength.',
      },
      {
        title: 'PFAS-free high density',
        body: 'A dense, silky silicone that matches fluororubber (FKM) watch straps in feel, strength and chemical resistance, without fluorine.',
      },
      {
        title: 'Chemical recycling',
        body: 'Turning silicone scrap into DMC, then silicone oil, then new silicone, with every batch traceable.',
      },
    ],
  },
  {
    id: 'surface-treatment',
    title: 'Surface treatment',
    model: 'coating' as const,
    items: [
      {
        title: 'Dust-free cables',
        body: 'Silicone is naturally slightly tacky and attracts dust. Our dip-coating process leaves cables soft to the touch, stain-resistant and durable.',
      },
      {
        title: 'Tough phone-case finish',
        body: 'A dipped finish with F-grade hardness that resists wear, at higher and more consistent yields than conventional UV coating.',
      },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment',
    model: 'extruder-horizontal' as const,
    items: [
      { title: 'Vertical extrusion line', body: 'The world’s first vertical line for high-speed liquid-silicone data cables: up to 100 m/min.', href: '/products/vertical-extruder' },
      { title: 'Energy-saving oven', body: '30% less electricity and ±5 °C temperature control.', href: '/products/energy-saving-oven' },
      { title: 'Low-waste LSR mixer', body: 'Avoids leaving around 4% of each bucket of silicone unused.', href: '/products/lsr-mixer' },
      { title: 'Vision-guided autowinder', body: 'Camera and closed-loop control for neatly wound spools.', href: '/products/autowinder' },
      { title: 'Dip-coating machine', body: 'Up to 20× lower VOC emissions than spray coating.', href: '/products/dip-coating-machine' },
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
        intro="Our R&D covers the whole chain: what goes into the silicone, how its surface performs, and the machines that shape it."
        aside={<Scene3D variant="extrusion" className="h-full" fallback={<Render name="extruder-vertical" priority className="h-full w-full object-contain" />} />}
      />

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow">Patents</p>
            <h2 className="display-lg mt-5">
              More than <em className="accent">20 patents</em>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">{patentsSummary}</p>
          </div>
          <StatTiles
            cols={1}
            stats={[
              { value: '20+', label: 'patents granted or pending' },
              { value: '1st', label: 'vertical silicone data-cable extrusion line in the world' },
            ]}
          />
        </div>
      </Section>

      {areas.map((area, i) => (
        <Section key={area.id} id={area.id} tone={i % 2 === 0 ? 'muted' : 'white'} eyebrow="Research area" title={area.title} className="scroll-mt-20">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="relative lg:sticky lg:top-28">
            <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(closest-side, rgb(20 159 148 / 0.22), transparent)' }} />
            <Render name={area.model} className="relative mx-auto max-h-80 w-auto" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div data-reveal="stagger" className="grid gap-5">
            {area.items.map((it) => (
              <div key={it.title} data-tilt className="card lift p-7">
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
          </div>
        </Section>
      ))}

      <CtaBand title="Partner with our *R&D team*" body="We co-develop materials and processes with customers who need something that doesn’t exist yet." />
    </>
  )
}

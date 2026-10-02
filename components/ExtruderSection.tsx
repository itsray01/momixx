import Link from 'next/link'
import { getProduct } from '@/content/products'
import { ExtruderExplorer } from './ExtruderExplorer'
import { Arrow, Section } from './ui'

// Points carried over from the original site's extruder section.
const points = [
  { title: 'Designed in-house', body: 'We design the hardware and software ourselves, so each line can be built around your manufacturing requirements.' },
  { title: 'Backed by our engineers', body: 'An experienced team supports installation, troubleshooting and maintenance.' },
  { title: 'Pair it with recycled silicone', body: 'Run it with our certified recycled silicone, which performs like virgin material.' },
]

/** The interactive vertical extrusion line, with its specification and service points. */
export function ExtruderSection({ tone = 'white', links = false }: { tone?: 'white' | 'muted'; links?: boolean }) {
  const line = getProduct('vertical-extruder')
  return (
    <Section
      id="extruder"
      tone={tone}
      eyebrow="Momixx Extruder"
      title="Explore the world’s first *vertical extrusion line*"
      intro="We invented the first vertical extrusion machine for high-speed silicone data cable, one of our 20+ patents. Fully automated from mixing to inspection, it runs at up to 100 metres a minute and is supplied to customers including a Fortune Global 500 company. Pick a part to see what it does."
    >
      <ExtruderExplorer specs={line?.specs ?? []} photo={{ src: '/images/products/vertical-extruder.webp', alt: 'Photograph of a Momixx silicone cable extrusion machine' }} />
      <ul data-reveal="stagger" className="mt-5 grid gap-5 md:grid-cols-3">
        {points.map((p, i) => (
          <li key={p.title} className="card p-6 sm:p-7">
            <span className="font-mono text-xs text-brand-300">0{i + 1}</span>
            <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
          </li>
        ))}
      </ul>
      {links && (
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/products/vertical-extruder" className="group btn-primary">
            The vertical extruder <Arrow />
          </Link>
          <Link href="/innovation" className="btn-ghost-dark">
            Research & innovation
          </Link>
        </div>
      )}
    </Section>
  )
}

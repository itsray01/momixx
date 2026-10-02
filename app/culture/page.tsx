import Link from 'next/link'
import { Render } from '@/components/Render'
import { Scene3D } from '@/components/three/Scene3D'
import { Arrow, CtaBand, PageHeader, Section } from '@/components/ui'
import { pageMetadata, site } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Culture & careers',
  description:
    'How we work at Momixx: a tech-driven, fast-moving silicone company building an international business, and a culture designed to grow the next generation of engineers and leaders.',
  path: '/culture',
})

// Values from the founder's brief. Edit freely; each needs a title and a line or two.
const values = [
  { title: 'Engineers at heart', body: 'We are a technology company that happens to make silicone. We solve problems with R&D, and we build our own machines when the right one doesn’t exist.' },
  { title: 'Fast, then faster', body: 'Speed is a habit. We prototype quickly, decide quickly and answer customers quickly, without cutting corners on quality.' },
  { title: 'Sweat the details', body: 'Great products come from obsessive attention to small things: a colour matched to within dE94 0.5, a jacket 0.3 mm thin.' },
  { title: 'Decide together', body: 'Good decisions come from the people closest to the work. Small teams debate openly, agree, and then move as one.' },
  { title: 'Think global', body: 'We build for international markets and international standards from day one, and we hold ourselves to them.' },
  { title: 'Leave it better', body: 'Sustainability is part of the job, not a side project: recycled feedstock, less waste and cleaner processes in everything we do.' },
]

const growth = [
  { title: 'Responsibility early', body: 'New team members own real projects from the start, with experienced engineers beside them.' },
  { title: 'Learning by building', body: 'From material formulation to machine design, you see the whole chain, from lab to production line.' },
  { title: 'The next generation', body: 'We are building a culture that develops tomorrow’s leaders, people who will take Momixx much further than today.' },
]

const teams = ['Materials R&D', 'Process & automation engineering', 'Quality & regulatory', 'Production', 'Sales & applications', 'Corporate functions']

export default function CulturePage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/about', label: 'Company' },
          { href: '/culture', label: 'Culture & careers' },
        ]}
        eyebrow="Culture & careers"
        title="How we *work*"
        intro="Momixx is going for a much bigger future. Getting there takes a particular kind of culture: curious, fast, precise and collaborative, and designed to grow the next generation."
        aside={<Scene3D variant="molecule" className="h-full" fallback={<Render name="molecule" priority className="h-full w-full object-contain" />} />}
      />

      <Section eyebrow="Our values" title="Six things we *believe*">
        <ol data-reveal="stagger" className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <li key={v.title} className="bg-ink-950 p-8 sm:p-10">
              <span className="font-mono text-xs text-brand-300">0{i + 1}</span>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{v.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-400">{v.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted" eyebrow="Growing people" title="Shaping the *next generation*">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(closest-side, rgb(20 159 148 / 0.22), transparent)' }} />
            <Render name="samples" className="relative" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div data-reveal="stagger" className="space-y-5">
            {growth.map((g) => (
              <div key={g.title} data-tilt className="card lift p-7">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{g.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-400">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Careers" title="Build the future of *silicone* with us" intro="We hire engineers, scientists and business people who want to work on hard problems and see their work reach real products.">
        <ul data-reveal="stagger" className="flex flex-wrap gap-3">
          {teams.map((t) => (
            <li key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-slate-200">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <a href={`mailto:${site.email}?subject=${encodeURIComponent('Careers at Momixx')}`} className="group btn-primary px-6 py-3 text-base">
            Send us your CV <Arrow />
          </a>
          <Link href="/about" className="btn-ghost-dark px-6 py-3 text-base">
            About Momixx
          </Link>
        </div>
      </Section>

      <CtaBand title="Want to *work with us?*" body="Whether you’re a customer, a partner or a future colleague, we’d like to hear from you." />
    </>
  )
}

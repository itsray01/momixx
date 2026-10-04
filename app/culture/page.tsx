import Link from 'next/link'
import { Arrow, CtaBand, PageHeader, Section } from '@/components/ui'
import { pageMetadata, site } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Culture & careers',
  description:
    'How we work at MoMixx: a tech-driven, fast-moving silicone company building an international business, and a culture designed to grow the next generation of engineers and leaders.',
  path: '/culture',
})

// Values from the founder's brief. Edit freely; each needs a title and a line or two.
const values = [
  { title: 'Engineers at heart', body: 'We are a technology company that happens to make silicone. We solve problems through research, and we build our own machines when the right one doesn’t exist.' },
  { title: 'Speed with discipline', body: 'Speed is a habit. We prototype quickly, decide quickly and answer customers quickly, without cutting corners on quality.' },
  { title: 'Sweat the details', body: 'Great products come from caring about small things: a colour matched so closely you can’t tell the difference, a cable coating thinner than a credit card.' },
  { title: 'Decide together', body: 'Good decisions come from the people closest to the work. Small teams debate openly, agree, and then move as one.' },
  { title: 'Think global', body: 'We build for international markets and international standards from day one, and we hold ourselves to them.' },
  { title: 'Leave it better', body: 'Sustainability is part of the job, not a side project: recycled materials, less waste and cleaner ways of working in everything we do.' },
]

const growth = [
  { title: 'Responsibility early', body: 'New team members own real projects from the start, with experienced engineers beside them.' },
  { title: 'Learning by building', body: 'From creating new silicone recipes to designing machines, you see the whole journey, from the lab to the factory floor.' },
  { title: 'The next generation', body: 'We develop future leaders from within our own teams, giving them the experience to lead the next stage of the business.' },
]

const teams = ['Materials research', 'Machine and automation engineering', 'Quality and standards', 'Production', 'Sales and customer support', 'Business support']

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
        intro="MoMixx is a technology-led company building an international business. Our culture is curious, fast, precise and collaborative, and designed to develop the next generation of engineers and leaders."
      />

      <Section eyebrow="Our values" title="Six things we *believe*">
        <ol data-reveal="stagger" className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <li key={v.title} className="bg-ink-950 p-8 sm:p-10">
              <span className="font-mono text-xs text-slate-500">0{i + 1}</span>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{v.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-400">{v.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted" eyebrow="Growing people" title="Shaping the *next generation*">
        <div data-reveal="stagger" className="grid gap-5 md:grid-cols-3">
          {growth.map((g) => (
            <div key={g.title} className="card lift p-7">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">{g.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-400">{g.body}</p>
            </div>
          ))}
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
          <a href={`mailto:${site.careersEmail || site.email}?subject=${encodeURIComponent('Careers at MoMixx')}`} className="group btn-primary px-6 py-3 text-base">
            Send us your CV <Arrow />
          </a>
          <Link href="/about" className="btn-ghost-dark px-6 py-3 text-base">
            About MoMixx
          </Link>
        </div>
      </Section>

      <CtaBand title="Want to *work with us?*" body="Whether you’re a customer, a partner or a future colleague, we’d like to hear from you." />
    </>
  )
}

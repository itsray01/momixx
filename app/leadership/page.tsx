import { notFound } from 'next/navigation'
import { LinkCard } from '@/components/LinkCard'
import { PageHeader, Section } from '@/components/ui'
import { team, teamReady } from '@/content/team'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Leadership',
  description: 'The founders of MoMixx: one leads technology and innovation, the other strategy and governance.',
  path: '/leadership',
})

/** The bio's first sentence, set larger, and the rest. */
function splitBio(bio: string) {
  const i = bio.indexOf('. ')
  return i === -1 ? [bio, ''] : [bio.slice(0, i + 1), bio.slice(i + 2)]
}

// The founders are shown by role only, at HQ's request: no names, photos or initials,
// and no Person structured data (which would need a name).
export default function LeadershipPage() {
  if (!teamReady) notFound()

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/about', label: 'Company' },
          { href: '/leadership', label: 'Leadership' },
        ]}
        eyebrow="Leadership"
        title="Our *founders*"
        intro="MoMixx was founded by two business leaders: one leads technology and innovation, the other strategy and governance."
      />

      <Section>
        <ul data-reveal="stagger" className="grid gap-6 lg:grid-cols-2">
          {team.map((m) => {
            const [lead, rest] = splitBio(m.bio)
            const Icon = m.icon
            return (
              <li key={m.focus} className="card relative flex flex-col overflow-hidden p-8 sm:p-10">
                {/* A soft wash of green in the corner, behind the icon. */}
                <span aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(79_191_122/0.16),transparent_70%)]" />

                <div className="relative flex items-center gap-5">
                  <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-brand-400/30 bg-brand-50 text-brand-300 shadow-[0_8px_18px_-10px_rgb(22_132_71/0.5)]">
                    <Icon className="size-6" strokeWidth={1.6} />
                  </span>
                  <h2>
                    <span className="block text-sm font-medium text-zinc-500">{m.role}</span>
                    <span className="mt-0.5 block text-2xl font-semibold tracking-[-0.03em] text-white">{m.focus}</span>
                  </h2>
                </div>

                <div className="relative mt-9 flex items-end gap-4 border-y border-white/10 py-6">
                  <span className="font-display text-6xl leading-[0.85] font-semibold tracking-[-0.05em] text-white tabular-nums">{m.years.value}</span>
                  <span className="max-w-[16rem] pb-0.5 text-sm leading-snug text-zinc-400">{m.years.label}</span>
                </div>

                <p className="relative mt-7 text-xl leading-snug tracking-[-0.01em] text-white">{lead}</p>
                {rest && <p className="relative mt-4 leading-relaxed text-zinc-400">{rest}</p>}

                <ul aria-label="Expertise" className="relative mt-auto flex flex-wrap gap-2 pt-8">
                  {m.expertise.map((e) => (
                    <li key={e} className="rounded-full border border-zinc-800 bg-ink-950/60 px-3 py-1 text-sm text-zinc-300">
                      {e}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section tone="muted" eyebrow="More about us" title="Get to know *MoMixx*">
        <div data-reveal="stagger" className="grid gap-5 md:grid-cols-3">
          <LinkCard href="/about" kicker="About us" title="Our story" body="How MoMixx started, our milestones and where we work." />
          <LinkCard href="/innovation" kicker="Research & innovation" title="What we develop" body="Our patents and research, from new silicones to the vertical extrusion line." />
          <LinkCard href="/governance" kicker="Governance" title="How we are run" body="Company information, certifications and our website policies." />
        </div>
      </Section>
    </>
  )
}

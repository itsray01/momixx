import { notFound } from 'next/navigation'
import { PageHeader, Section } from '@/components/ui'
import { team, teamReady } from '@/content/team'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Leadership',
  description: 'The founders of MoMixx.',
  path: '/leadership',
})

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
        intro="The founders behind MoMixx’s strategy, technology and growth."
      />

      <Section>
        <ul data-reveal="stagger" className="grid gap-6 lg:grid-cols-2">
          {team.map((m) => (
            <li key={m.bio} className="card flex flex-col p-8 sm:p-10">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">{m.role}</h2>
              <span aria-hidden="true" className="mt-6 block h-px w-16 bg-gradient-to-r from-zinc-700 to-transparent" />
              <p className="mt-6 text-lg leading-relaxed text-zinc-300">{m.bio}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

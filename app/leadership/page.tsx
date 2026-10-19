import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { displayName, team, teamReady, type TeamMember } from '@/content/team'
import { absoluteUrl, pageMetadata, showPending } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Leadership',
  description: 'The leadership of MoMixx, led by Chief Executive Officer Dr Cheah Li Kang.',
  path: '/leadership',
})

/** Initials from the name alone (no honorific): "Cheah Li Kang" → "CLK". */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

/** Portrait, or a gilt monogram until a photo is supplied. */
function Portrait({ m, sizes, large = false }: { m: TeamMember; sizes: string; large?: boolean }) {
  return (
    <div className="card relative aspect-[4/5] overflow-hidden">
      {m.photo ? (
        <Image src={m.photo} alt={`Portrait of ${displayName(m)}`} fill sizes={sizes} className="object-cover" />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <span className={`accent-figure font-display font-semibold tracking-[-0.04em] ${large ? 'text-[clamp(4.5rem,9vw,7.5rem)]' : 'text-6xl'}`}>
            {initials(m.name)}
          </span>
        </div>
      )}
    </div>
  )
}

export default function LeadershipPage() {
  if (!teamReady) notFound()
  const [lead, ...rest] = team

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/about', label: 'Company' },
          { href: '/leadership', label: 'Leadership' },
        ]}
        eyebrow="Leadership"
        title="Our *leadership*"
        intro="The people responsible for MoMixx’s strategy, technology and operations."
      />

      <Section>
        {/* The chief executive, featured. */}
        <article data-reveal className="grid items-center gap-10 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
          <div className="mx-auto w-full max-w-xs md:max-w-none">
            <Portrait m={lead} large sizes="(min-width: 1024px) 26rem, (min-width: 768px) 22rem, 20rem" />
          </div>
          <div className="max-w-xl">
            <p className="eyebrow">{lead.role}</p>
            <h2 className="display-md mt-5 text-white">{displayName(lead)}</h2>
            <span aria-hidden="true" className="mt-8 block h-px w-24 bg-gradient-to-r from-zinc-700 to-transparent" />
            {showPending && lead.draftBios ? (
              // Preview only: the bios under review, one under the other.
              <div className="mt-8 space-y-6">
                {lead.draftBios.map((b) => (
                  <div key={b.label} className={b.highlight ? 'rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6' : 'rounded-2xl border border-zinc-800 p-5 sm:p-6'}>
                    <p className={`text-xs font-medium tracking-[0.12em] uppercase ${b.highlight ? 'text-red-700' : 'text-zinc-500'}`}>{b.label}</p>
                    <p className="mt-3 text-lg leading-relaxed text-zinc-300">{b.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-8 text-lg leading-relaxed text-zinc-300 sm:text-xl">{lead.bio ?? `${displayName(lead)} leads MoMixx as ${lead.role}.`}</p>
            )}
            {lead.linkedin && (
              <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm font-medium text-brand-300 hover:text-brand-200">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </article>

        {/* Everyone else, as they are added to content/team.ts. */}
        {rest.length > 0 && (
          <ul data-reveal="stagger" className="mt-24 grid gap-10 border-t border-white/10 pt-16 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((m) => (
              <li key={m.name} className="flex flex-col">
                <Portrait m={m} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" />
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">{displayName(m)}</h3>
                <p className="mt-1 text-sm font-medium text-zinc-500">{m.role}</p>
                {m.bio && <p className="mt-3 text-sm leading-relaxed text-zinc-400">{m.bio}</p>}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-medium text-brand-300 hover:text-brand-200">
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <CtaBand />
      <JsonLd
        data={team.map((m) => ({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: m.name,
          ...(m.honorific ? { honorificPrefix: m.honorific } : {}),
          jobTitle: m.role,
          worksFor: { '@id': absoluteUrl('/#organization') },
          ...(m.photo ? { image: absoluteUrl(m.photo) } : {}),
          ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
        }))}
      />
    </>
  )
}

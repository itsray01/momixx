import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { team, teamReady } from '@/content/team'
import { absoluteUrl, pageMetadata } from '@/lib/site'

export const metadata = {
  ...pageMetadata({
    title: 'Our team',
    description: 'Meet the management team leading Momixx.',
    path: '/team',
  }),
  // Kept out of search results until real profiles replace the placeholders.
  ...(teamReady ? {} : { robots: { index: false, follow: true } }),
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function TeamPage() {
  // Not published until every profile is real; placeholders still show in development for previewing.
  if (!teamReady && process.env.NODE_ENV === 'production') notFound()
  const real = team.filter((m) => !m.placeholder)
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/about', label: 'Company' },
          { href: '/team', label: 'Our Team' },
        ]}
        eyebrow="Leadership"
        title="Our management *team*"
        intro="The people responsible for Momixx’s strategy, technology and operations."
      />
      <Section>
        <ul data-reveal="stagger" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <li key={`${m.role}-${i}`} className="flex flex-col">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/[0.06]">
                {m.photo ? (
                  <Image src={m.photo} alt={`Portrait of ${m.name}`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950 font-display text-5xl font-semibold text-white/80">
                    {m.placeholder ? '?' : initials(m.name)}
                  </div>
                )}
              </div>
              <h2 className={`mt-5 text-xl font-semibold ${m.placeholder ? 'text-slate-400' : ''}`}>{m.name}</h2>
              <p className="text-sm font-semibold text-brand-300">{m.role}</p>
              <p className={`mt-3 text-sm leading-relaxed ${m.placeholder ? 'text-slate-400 italic' : 'text-slate-400'}`}>{m.bio}</p>
              {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-semibold text-brand-300 hover:underline">
                  LinkedIn
                </a>
              )}
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
      {real.length > 0 && (
        <JsonLd
          data={real.map((m) => ({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: m.name,
            jobTitle: m.role,
            worksFor: { '@id': absoluteUrl('/#organization') },
            ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
          }))}
        />
      )}
    </>
  )
}

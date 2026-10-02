import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { glossary } from '@/content/glossary'
import { absoluteUrl, pageMetadata } from '@/lib/site'
import { TopicNav } from '../TopicNav'

export const metadata = pageMetadata({
  title: 'Silicone glossary: LSR, HCR, DMC, GRS, PFAS and more',
  description: 'Plain-English definitions of silicone, silicone recycling and cable terms: LSR, HCR, DMC, siloxane, GRS, ISCC PLUS, PFAS, FKM, UL 94, VW-1 and more.',
  path: '/insights/glossary',
})

const id = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function GlossaryPage() {
  const terms = [...glossary].sort((a, b) => a.term.localeCompare(b.term))
  const letters = [...new Set(terms.map((t) => t.term[0].toUpperCase()))]
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/insights', label: 'Insights' },
          { href: '/insights/glossary', label: 'Glossary' },
        ]}
        eyebrow="Insights"
        title="Silicone *glossary*"
        intro="The words you’ll meet when working with silicone, its recycling and its certifications, defined in plain English."
      >
        <div className="mt-8">
          <TopicNav />
        </div>
      </PageHeader>
      <Section>
        <nav aria-label="Letters" className="mb-12 flex flex-wrap gap-2">
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm text-slate-300 hover:border-brand-300 hover:text-white">
              {l}
            </a>
          ))}
        </nav>
        <dl className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {terms.map((t, i) => {
            const first = i === 0 || terms[i - 1].term[0].toUpperCase() !== t.term[0].toUpperCase()
            return (
              <div key={t.term} id={id(t.term)} className="grid scroll-mt-28 gap-2 py-7 sm:grid-cols-[16rem_1fr] sm:gap-10">
                <dt>
                  {first && <span id={`letter-${t.term[0].toUpperCase()}`} className="block scroll-mt-28" />}
                  <span className="text-xl font-semibold tracking-[-0.02em] text-white">{t.term}</span>
                  {t.also && <span className="mt-1 block text-sm text-slate-500">{t.also}</span>}
                </dt>
                <dd className="leading-relaxed text-slate-300">
                  {t.definition}
                  {t.link && (
                    <Link href={t.link} className="ml-2 text-sm text-brand-300 hover:text-brand-200">
                      Learn more →
                    </Link>
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
      </Section>
      <CtaBand />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTermSet',
          '@id': absoluteUrl('/insights/glossary'),
          name: 'Silicone glossary',
          hasDefinedTerm: terms.map((t) => ({
            '@type': 'DefinedTerm',
            name: t.term,
            ...(t.also ? { alternateName: t.also } : {}),
            description: t.definition,
            url: absoluteUrl(`/insights/glossary#${id(t.term)}`),
            inDefinedTermSet: absoluteUrl('/insights/glossary'),
          })),
        }}
      />
    </>
  )
}

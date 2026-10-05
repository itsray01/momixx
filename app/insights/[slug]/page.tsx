import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { JsonLd } from '@/components/JsonLd'
import { Breadcrumbs, CtaBand, FaqList, GridBackdrop, Section } from '@/components/ui'
import { formatDate, getArticle, getArticles, relatedArticles, topics } from '@/lib/articles'
import { absoluteUrl, pageMetadata, site } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return {}
  const base = pageMetadata({ title: a.seoTitle ?? a.title, description: a.description, path: `/insights/${a.slug}`, ownImage: true })
  return {
    ...base,
    keywords: a.tags,
    // The share image comes from ./opengraph-image.tsx.
    openGraph: { ...base.openGraph, type: 'article', publishedTime: a.date, modifiedTime: a.updated ?? a.date },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) notFound()
  const related = relatedArticles(a)
  const topic = topics[a.topic]

  return (
    <>
      <article>
        <header className="grain relative overflow-hidden pt-32 pb-12 sm:pt-40">
          <GridBackdrop />
          <div className="container-page relative">
            <div className="max-w-4xl">
              <Breadcrumbs
                items={[
                  { href: '/insights', label: 'Insights' },
                  { href: `/insights/topic/${a.topic}`, label: topic.label },
                  { href: `/insights/${a.slug}`, label: a.title },
                ]}
              />
              <p className="eyebrow mt-8">{topic.label}</p>
              <h1 className="display-lg mt-5">{a.title}</h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-zinc-300">{a.description}</p>
              {/* A visible date and author help readers, search engines and AI answers judge how current and credible the article is. */}
              <p className="mt-6 text-sm text-zinc-500">
                Updated <time dateTime={a.updated ?? a.date}>{formatDate(a.updated ?? a.date)}</time> · {a.author ? a.author.name : `${site.name} technical team`}
              </p>
            </div>
          </div>
        </header>

        <div className="container-page grid gap-12 pt-12 pb-24 sm:pt-16 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            {a.headings.length > 2 && (
              <nav aria-label="On this page" className="sticky top-28">
                <p className="text-xs font-medium tracking-[0.16em] text-zinc-500 uppercase">On this page</p>
                <ol className="mt-4 space-y-2.5 border-l border-white/10 text-sm">
                  {a.headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-zinc-400 transition-colors hover:border-brand-300 hover:text-white">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>

          <div className="min-w-0 max-w-3xl">
            {a.takeaways.length > 0 && (
              <section aria-labelledby="takeaways" className="card mb-12 p-7 sm:p-8">
                <h2 id="takeaways" className="text-sm font-medium tracking-[0.16em] text-zinc-400 uppercase">
                  Key takeaways
                </h2>
                <ul className="mt-4 space-y-3 text-zinc-200">
                  {a.takeaways.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="article-prose" dangerouslySetInnerHTML={{ __html: a.html }} />

            {a.faqs.length > 0 && (
              <section className="mt-16">
                <h2 className="display-md mb-6">Questions</h2>
                <FaqList faqs={a.faqs} />
              </section>
            )}

            {a.sources.length > 0 && (
              <section className="mt-16 border-t border-white/[0.08] pt-8">
                <h2 className="text-sm font-medium tracking-[0.16em] text-zinc-500 uppercase">Sources</h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-400 marker:text-zinc-500">
                  {a.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-white">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <p className="mt-12 text-sm text-zinc-500">
              More in{' '}
              <Link href={`/insights/topic/${a.topic}`} className="text-brand-300 underline decoration-brand-300/40 underline-offset-4 hover:text-brand-200">
                {topic.label}
              </Link>
              {a.tags.length > 0 && <> · {a.tags.join(', ')}</>}
            </p>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <Section tone="muted" eyebrow="Keep reading" title="Related *insights*">
          <ul data-reveal="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <ArticleCard article={r} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand title="Questions about *this topic?*" body="Our engineers can help with materials, testing and recycled content." secondary={{ href: '/insights', label: 'More insights' }} />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: a.title,
          description: a.description,
          image: absoluteUrl(`/renders/${a.model}.webp`),
          datePublished: a.date,
          dateModified: a.updated ?? a.date,
          wordCount: a.words,
          articleSection: topic.label,
          keywords: a.tags.join(', '),
          inLanguage: 'en',
          mainEntityOfPage: absoluteUrl(`/insights/${a.slug}`),
          author: a.author
            ? { '@type': 'Person', name: a.author.name, ...(a.author.role ? { jobTitle: a.author.role } : {}), ...(a.author.url ? { url: a.author.url } : {}), worksFor: { '@id': absoluteUrl('/#organization') } }
            : { '@type': 'Organization', name: site.name, url: site.url },
          publisher: { '@id': absoluteUrl('/#organization') },
          ...(a.sources.length ? { citation: a.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })) } : {}),
        }}
      />
    </>
  )
}

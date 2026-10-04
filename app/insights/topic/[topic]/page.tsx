import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { Render } from '@/components/Render'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { getArticles, topics, type Topic } from '@/lib/articles'
import { pageMetadata } from '@/lib/site'
import { TopicNav } from '../../TopicNav'

type Props = { params: Promise<{ topic: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return (Object.keys(topics) as Topic[]).filter((t) => getArticles().some((a) => a.topic === t)).map((topic) => ({ topic }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params
  if (!(topic in topics)) return {}
  const t = topics[topic as Topic]
  const count = getArticles().filter((a) => a.topic === topic).length
  return pageMetadata({
    title: `${t.label}: silicone insights`,
    description: `${t.blurb} ${count} plain-English ${count === 1 ? 'article' : 'articles'} from MoMixx, each with sources and FAQs.`,
    path: `/insights/topic/${topic}`,
  })
}

export default async function TopicPage({ params }: Props) {
  const { topic } = await params
  if (!(topic in topics)) notFound()
  const t = topics[topic as Topic]
  const all = getArticles()
  const [newest, ...rest] = all.filter((a) => a.topic === topic)
  // Articles are sorted newest first, so `find` gives each topic's newest one.
  const others = (Object.keys(topics) as Topic[]).flatMap((k) => {
    const article = all.find((a) => a.topic === k)
    return k !== topic && article ? [{ topic: k, article }] : []
  })
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/insights', label: 'Insights' },
          { href: `/insights/topic/${topic}`, label: t.label },
        ]}
        eyebrow="Insights"
        title={t.label}
        intro={t.blurb}
      >
        <div className="mt-8">
          <TopicNav active={topic as Topic} />
        </div>
      </PageHeader>
      <Section>
        <h2 className="sr-only">Articles</h2>
        <ul data-reveal="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <li className="sm:col-span-2 lg:col-span-3">
            <ArticleCard article={newest} large showRender />
          </li>
          {rest.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} showRender />
            </li>
          ))}
        </ul>
      </Section>
      {others.length > 0 && (
        <Section tone="muted" eyebrow="Insights" title="Explore other *topics*">
          <ul data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.topic}>
                <Link href={`/insights/topic/${o.topic}`} className="group card lift flex h-full items-center gap-4 overflow-hidden p-3 pr-5">
                  <div className="w-28 shrink-0 overflow-hidden rounded-2xl bg-white/[0.03]">
                    <Render name={o.article.model} sizes="112px" className="transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold tracking-[-0.02em] text-white">{topics[o.topic].label}</h3>
                    <p className="mt-1 text-sm leading-snug text-slate-400">{topics[o.topic].blurb}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <CtaBand title="Have a question about *silicone?*" body="Our engineers are happy to help with materials, recycling and manufacturing questions." secondary={{ href: '/insights', label: 'All insights' }} />
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
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
  const list = getArticles().filter((a) => a.topic === topic)
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
          {list.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand title="Have a question about *silicone?*" body="Our engineers are happy to help with materials, recycling and manufacturing questions." secondary={{ href: '/insights', label: 'All insights' }} />
    </>
  )
}

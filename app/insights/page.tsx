import { ArticleCard } from '@/components/ArticleCard'
import { collectionPage, JsonLd } from '@/components/JsonLd'
import { PageHeader, Section } from '@/components/ui'
import { getArticles, topics } from '@/lib/articles'
import { absoluteUrl, pageMetadata } from '@/lib/site'
import { FilteredArticles, TopicButtons } from './TopicFilter'
import { usedTopics } from './TopicNav'

export const metadata = {
  ...pageMetadata({
    title: 'Insights: silicone explained',
    description:
      'Plain-English articles on silicone, silicone recycling, recycled-content certifications, PFAS-free materials, and silicone in cables, EVs, medical devices, data centres and robots.',
    path: '/insights',
  }),
  alternates: { canonical: absoluteUrl('/insights'), types: { 'application/rss+xml': absoluteUrl('/insights/feed.xml') } },
}

export default function InsightsPage() {
  const all = getArticles()
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/insights', label: 'Insights' }]}
        eyebrow="Insights"
        title="Silicone, *explained*"
        intro="Clear, sourced articles on silicone: how it is made, how it is recycled, and where it is used, from phone cables to humanoid robots."
      >
        <div className="mt-8">
          <TopicButtons topics={usedTopics().map((t) => ({ id: t, label: topics[t].label }))} />
        </div>
      </PageHeader>
      <Section>
        <h2 className="sr-only">Latest articles</h2>
        {/* Topics filter this list in place (?topic=…), instead of each having a page. */}
        <FilteredArticles
          items={all.map((a) => ({ slug: a.slug, topic: a.topic, card: <ArticleCard article={a}/>, large: <ArticleCard article={a} large/> }))}
        />
      </Section>
      <JsonLd data={collectionPage('MoMixx Insights', '/insights', all.map((a) => ({ name: a.title, path: `/insights/${a.slug}` })))} />
    </>
  )
}

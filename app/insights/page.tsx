import { ArticleCard } from '@/components/ArticleCard'
import { collectionPage, JsonLd } from '@/components/JsonLd'
import { CtaBand, PageHeader, Section } from '@/components/ui'
import { getArticles } from '@/lib/articles'
import { pageMetadata } from '@/lib/site'
import { TopicNav } from './TopicNav'

export const metadata = {
  ...pageMetadata({
    title: 'Insights: silicone explained',
    description:
      'Plain-English articles on silicone, silicone recycling, recycled-content certifications, PFAS-free materials, and silicone in cables, EVs, medical devices, data centres and robots.',
    path: '/insights',
  }),
  alternates: { canonical: '/insights', types: { 'application/rss+xml': '/insights/feed.xml' } },
}

export default function InsightsPage() {
  const all = getArticles()
  const [featured, ...rest] = all
  return (
    <>
      <PageHeader
        crumbs={[{ href: '/insights', label: 'Insights' }]}
        eyebrow="Insights"
        title="Silicone, *explained*"
        intro="Clear, sourced articles on silicone: how it is made, how it is recycled, and where it is used, from phone cables to humanoid robots."      >
        <div className="mt-8">
          <TopicNav />
        </div>
      </PageHeader>
      <Section>
        <h2 className="sr-only">Latest articles</h2>
        {featured && (
          <div data-reveal className="mb-5">
            <ArticleCard article={featured} large showRender />
          </div>
        )}
        <ul data-reveal="stagger" className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <li key={a.slug} className="flex">
              <ArticleCard article={a} showRender />
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand title="Have a question about *silicone?*" body="Our engineers are happy to help with materials, recycling and manufacturing questions." />
      <JsonLd data={collectionPage('MoMixx Insights', '/insights', all.map((a) => ({ name: a.title, path: `/insights/${a.slug}` })))} />
    </>
  )
}

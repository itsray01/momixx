import { getArticle, getArticles, topics } from '@/lib/articles'
import { ogCard, ogSize } from '@/lib/og'

export const size = ogSize
export const contentType = 'image/png'
// Generated at build time, like the pages themselves.
export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }))
}

export const alt = 'Momixx Insights article'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getArticle(slug)
  return ogCard({ eyebrow: a ? `Momixx Insights · ${topics[a.topic].label}` : 'Momixx Insights', title: a?.title ?? 'Insights' })
}

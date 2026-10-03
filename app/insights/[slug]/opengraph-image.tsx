import { getArticle, getArticles, topics } from '@/lib/articles'
import { ogCard, ogSize } from '@/lib/og'

export const size = ogSize
export const contentType = 'image/png'
// Generated at build time, like the pages themselves.
export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }))
}

export const alt = 'MoMixx Insights article'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getArticle(slug)
  return ogCard({ eyebrow: a ? `MoMixx Insights · ${topics[a.topic].label}` : 'MoMixx Insights', title: a?.title ?? 'Insights' })
}

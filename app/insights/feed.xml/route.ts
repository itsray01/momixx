import { getArticles } from '@/lib/articles'
import { absoluteUrl, site } from '@/lib/site'

// RSS feed of Insights articles, so readers, aggregators and AI crawlers pick up new posts.
export const dynamic = 'force-static'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function GET() {
  const items = getArticles()
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${absoluteUrl(`/insights/${a.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/insights/${a.slug}`)}</guid>
      <description>${esc(a.description)}</description>
      <pubDate>${new Date(a.date + 'T00:00:00Z').toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} Insights</title>
    <link>${absoluteUrl('/insights')}</link>
    <atom:link href="${absoluteUrl('/insights/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>${esc('Silicone, silicone recycling and sustainable materials, explained by Momixx.')}</description>
    <language>en</language>
${items}
  </channel>
</rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}

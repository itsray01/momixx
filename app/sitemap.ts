import type { MetadataRoute } from 'next'
import { applications } from '@/content/applications'
import { getArticles, topics, type Topic } from '@/lib/articles'
import { products } from '@/content/products'
import { teamReady } from '@/content/team'
import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['/', '/silicone', '/products', '/applications', '/sustainability', '/recycled-silicone', '/insights', '/insights/glossary', '/culture', '/locations', '/markets', '/about', '/newsroom', '/innovation', '/contact', '/privacy', '/terms', ...(teamReady ? ['/team'] : [])]
  return [
    ...staticPages.map((p) => ({ url: absoluteUrl(p), changeFrequency: 'monthly' as const, priority: p === '/' ? 1 : p === '/privacy' || p === '/terms' ? 0.3 : 0.8 })),
    ...applications.map((a) => ({ url: absoluteUrl(`/applications/${a.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...getArticles().map((a) => ({ url: absoluteUrl(`/insights/${a.slug}`), lastModified: a.updated ?? a.date, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...(Object.keys(topics) as Topic[])
      .filter((t) => getArticles().some((a) => a.topic === t))
      .map((t) => ({ url: absoluteUrl(`/insights/topic/${t}`), changeFrequency: 'weekly' as const, priority: 0.5 })),
  ]
}

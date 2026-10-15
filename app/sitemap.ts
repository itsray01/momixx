import type { MetadataRoute } from 'next'
import { applications } from '@/content/applications'
import { newsroomReady } from '@/content/news'
import { ownPageProducts } from '@/content/products'
import { getArticles } from '@/lib/articles'
import { teamReady } from '@/content/team'
import { topics } from '@/content/topics'
import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['/', '/silicone', '/products', '/applications', '/sustainability', '/recycled-silicone', '/insights', '/insights/glossary', '/products/machines', '/products/manufacturing', '/culture', '/about', ...(newsroomReady ? ['/newsroom'] : []), '/governance', '/innovation', '/contact', '/privacy', '/terms', ...(teamReady ? ['/leadership'] : [])]
  return [
    ...staticPages.map((p) => ({ url: absoluteUrl(p), changeFrequency: 'monthly' as const, priority: p === '/' ? 1 : p === '/privacy' || p === '/terms' ? 0.3 : 0.8 })),
    ...topics.map((t) => ({ url: absoluteUrl(t.path), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...applications.map((a) => ({ url: absoluteUrl(`/applications/${a.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...ownPageProducts.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...getArticles().map((a) => ({ url: absoluteUrl(`/insights/${a.slug}`), lastModified: a.updated ?? a.date, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}

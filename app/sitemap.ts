import type { MetadataRoute } from 'next'
import { applications } from '@/content/applications'
import { products } from '@/content/products'
import { teamReady } from '@/content/team'
import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['/', '/silicone', '/products', '/applications', '/recycled-silicone', '/markets', '/about', '/innovation', '/contact', ...(teamReady ? ['/team'] : [])]
  return [
    ...staticPages.map((p) => ({ url: absoluteUrl(p), changeFrequency: 'monthly' as const, priority: p === '/' ? 1 : 0.8 })),
    ...applications.map((a) => ({ url: absoluteUrl(`/applications/${a.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}

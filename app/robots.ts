import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

// Search engines and AI assistants (ChatGPT, Claude, Perplexity, Gemini) are
// all welcome: being quotable by AI answer engines is part of the GEO/AEO goal.
// Preview deployments are kept out of the index so only the live domain ranks.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : true
  if (!isProduction) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}

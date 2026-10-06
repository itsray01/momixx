import type { NextConfig } from 'next'

const canonical = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.momixx.com')

// Every other domain the company owns should 301 to the canonical site so that
// search engines and AI crawlers only ever index one copy. The preferred place
// for this is Vercel → Project → Settings → Domains ("Redirect to"), but these
// rules make it work even if a domain is attached to the project without one.
// Comma-separated, e.g. "orionmomixx.com,www.orionmomixx.com,momixx.com".
const redirectHosts = (process.env.REDIRECT_HOSTS ?? 'momixx.com,orionmomixx.com,www.orionmomixx.com')
  .split(',')
  .map((h) => h.trim())
  .filter((h) => h && h !== canonical.host)

// Old WordPress URLs → new pages, so existing Google rankings and inbound links
// carry over after the switch.
const legacyRedirects: Array<[string, string]> = [
  ['/about-us', '/about'],
  ['/company-capability', '/about'],
  ['/data-cable', '/applications/consumer-electronics'],
  ['/power-cable', '/applications/consumer-electronics'],
  ['/series', '/products'],
  ['/horizontal-extruder', '/products/horizontal-extruder'],
  ['/research-equipment', '/products#equipment'],
  ['/research-materials', '/innovation'],
  ['/research-surface-treatment', '/innovation'],
  ['/contact-us', '/contact'],
  ['/odm-oem', '/products/odm-oem'],
  ['/wearable-product', '/applications/consumer-electronics'],
  // Old one-page-per-year milestone posts, and other WordPress leftovers.
  ['/our-milestone/:year*', '/about#milestones'],
  ['/author/:name*', '/about'],
  ['/test', '/'],
  ['/feed', '/insights/feed.xml'],
  ['/wp-sitemap.xml', '/sitemap.xml'],
  ['/wp-sitemap-:part.xml', '/sitemap.xml'],
]

// Security headers for every response. Scripts and styles allow 'unsafe-inline'
// because statically generated Next.js pages carry their data in inline
// scripts (a nonce would force every page to render on demand). In development
// only, scripts may also use eval, which React needs for its debugging (error
// stacks); production never allows it. Forms may post to Formspree, the
// contact form's delivery service. The graphics check is a same-origin worker
// file, so workers are limited to this site.
const isDev = process.env.NODE_ENV === 'development'
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io",
  "worker-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://formspree.io",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    return [
      ...redirectHosts.map((host) => ({
        source: '/:path*',
        has: [{ type: 'host' as const, value: host }],
        destination: `${canonical.origin}/:path*`,
        permanent: true,
      })),
      // Next.js drops a trailing slash first (308), then these apply.
      ...legacyRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ]
  },
}

export default nextConfig

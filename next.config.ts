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
  ['/research-equipment', '/innovation'],
  ['/research-materials', '/innovation'],
  ['/research-surface-treatment', '/innovation'],
  ['/contact-us', '/contact'],
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  // The Tailwind stylesheet is small, so it ships inside the HTML instead of
  // as a separate render-blocking request: faster first paint for new visitors.
  experimental: { inlineCss: true },
  async redirects() {
    return [
      ...redirectHosts.map((host) => ({
        source: '/:path*',
        has: [{ type: 'host' as const, value: host }],
        destination: `${canonical.origin}/:path*`,
        permanent: true,
      })),
      ...legacyRedirects.map(([source, destination]) => ({
        source: `${source}{/}?`,
        destination,
        permanent: true,
      })),
    ]
  },
}

export default nextConfig

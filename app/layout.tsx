import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { ScrollEffects } from '@/components/motion/ScrollEffects'
import { geist, instrumentSerif } from '@/lib/fonts'
import { buildMenus } from '@/lib/nav'
import { absoluteUrl, site } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Momixx | High-performance & recycled silicone',
    template: '%s | Momixx',
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    siteName: site.legalName,
    locale: 'en_SG',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
}

export const viewport: Viewport = {
  themeColor: '#060a10',
}

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Corporation',
  '@id': absoluteUrl('/#organization'),
  name: site.name,
  legalName: site.legalName,
  alternateName: [site.legalName, 'Orion Momixx'],
  slogan: site.tagline,
  url: site.url,
  logo: absoluteUrl('/icon.svg'),
  description: site.description,
  foundingDate: String(site.foundingYear),
  email: site.email,
  areaServed: 'Worldwide',
  contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: site.email, areaServed: 'Worldwide', availableLanguage: ['English'] },
  // Sites, as on /locations.
  location: [
    {
      '@type': 'Place',
      name: `${site.name} headquarters, Singapore`,
      url: absoluteUrl('/locations#singapore'),
      address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.locality, postalCode: site.address.postalCode, addressCountry: site.address.country },
    },
    {
      '@type': 'Place',
      name: `${site.name} R&D and manufacturing, Batu Kawan, Penang`,
      url: absoluteUrl('/locations#penang'),
      address: { '@type': 'PostalAddress', addressLocality: 'Batu Kawan', addressRegion: 'Penang', addressCountry: 'MY' },
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  knowsAbout: [
    'Silicone',
    'Liquid silicone rubber (LSR)',
    'High consistency rubber (HCR)',
    'Fire-retardant silicone',
    'Recycled silicone',
    'Silicone cable extrusion',
    'PFAS-free materials',
    'Medical-grade silicone',
  ],
  ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
}

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': absoluteUrl('/#website'),
  name: site.name,
  url: site.url,
  publisher: { '@id': absoluteUrl('/#organization') },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body>
        <JsonLd data={[organization, website]} />
        <Header menus={buildMenus()} />
        <main id="main">{children}</main>
        <Footer />
        <ScrollEffects />
        {/* Cookie-free visitor counts and real-user speed data. Only on Vercel, where their scripts are served; enable both in the Vercel project. */}
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}

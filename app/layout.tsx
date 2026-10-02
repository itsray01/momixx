import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { ScrollEffects } from '@/components/motion/ScrollEffects'
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
  '@type': 'Organization',
  '@id': absoluteUrl('/#organization'),
  name: site.name,
  alternateName: [site.legalName, 'Orion Momixx'],
  url: site.url,
  logo: absoluteUrl('/icon.svg'),
  description: site.description,
  foundingDate: String(site.foundingYear),
  email: site.email,
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
    <html lang="en">
      <body>
        <JsonLd data={[organization, website]} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ScrollEffects />
      </body>
    </html>
  )
}

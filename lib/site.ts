// Site-wide settings. Change these in one place and every page, the sitemap,
// structured data and llms.txt pick them up.

export const site = {
  // The brand, spelled MoMixx everywhere: logo, footer, page titles and running text.
  name: 'MoMixx',
  legalName: 'Orion MoMixx',
  // Company registration number (Singapore UEN). Shown in the footer once filled in.
  registrationNumber: '201310727R',
  // Canonical origin. The live WordPress site serves www.momixx.com, so we keep
  // www as canonical to preserve existing search rankings.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.momixx.com',
  tagline: 'High-performance and recycled silicone, engineered in Asia for the world.',
  description:
    'MoMixx makes green silicone: GRS and ISCC PLUS certified recycled silicone, plus high-performance flame-retardant and PFAS-free grades, cable machines and finished parts. Headquartered in Singapore, with factories in Penang, Malaysia and Dongguan, China.',
  foundingYear: 2019,
  email: 'enquiries@orionmomixx.com',
  // Contact form: the code after /f/ in the Formspree form's endpoint. Enquiries go to
  // the inbox chosen in Formspree, with the visitor's topic in the subject line.
  formspreeId: 'xqpareyg',
  // Optional dedicated inboxes; each falls back to the enquiries address when empty.
  careersEmail: '',
  // Media and press enquiries on /newsroom; falls back to `email` when empty.
  mediaEmail: '',
  // Company and investor enquiries on /governance; falls back to `email` when empty.
  investorEmail: '',
  address: {
    street: '22 New Industrial Road, #03-09/10 Primax',
    locality: 'Singapore',
    postalCode: '536208',
    country: 'SG',
  },
  // Sites in the order they are listed everywhere: headquarters first, then Malaysia, then the factory in Dongguan last.
  locations: [
    { name: 'Singapore', role: 'Headquarters', detail: '22 New Industrial Road, Primax' },
    { name: 'Batu Kawan, Penang, Malaysia', role: 'Research and manufacturing', detail: 'Liquid silicone, certified medical parts and precision parts' },
    { name: 'Perai, Penang, Malaysia', role: 'Manufacturing', detail: 'MoMixx Malaysia Sdn. Bhd.' },
    { name: 'Dongguan, Guangdong, China', role: 'Manufacturing', detail: 'Orion Automation (Dongguan) Co., Ltd.' },
  ],
  // Plant addresses, written as the company writes them. They feed the About page's
  // locations and the structured data.
  plants: {
    batuKawan: {
      company: 'Orion Technology Sdn. Bhd.',
      lines: ['PT5889, Jalan Cassia Selatan 3/8', 'Taman Perindustrian Batu Kawan'],
      postalCode: '14110',
      locality: 'Simpang Ampat',
      region: 'Penang',
      country: 'Malaysia',
      countryCode: 'MY',
    },
    perai: {
      company: 'MoMixx Malaysia Sdn. Bhd.',
      lines: ['No 5, Jalan Saga Jaya 1', 'Taman Perindustrian Saga Jaya'],
      postalCode: '13600',
      locality: 'Perai',
      region: 'Penang',
      country: 'Malaysia',
      countryCode: 'MY',
    },
    dongguan: {
      company: 'Orion Automation (Dongguan) Co., Ltd.',
      lines: ['No. 18 Xitou East Road', 'Houjie Town'],
      postalCode: '',
      locality: 'Dongguan',
      region: 'Guangdong',
      country: 'China',
      countryCode: 'CN',
    },
  },
  // Add LinkedIn etc. here once confirmed; they feed Organization.sameAs.
  sameAs: [] as string[],
} as const

type Plant = (typeof site.plants)[keyof typeof site.plants]

/** A plant's address as printed lines, for the page. */
export function plantLines(p: Plant) {
  return [...p.lines, [p.postalCode, p.locality].filter(Boolean).join(' '), `${p.region}, ${p.country}`]
}

/** A plant's address for structured data. */
export function plantAddress(p: Plant) {
  return { '@type': 'PostalAddress', streetAddress: p.lines.join(', '), ...(p.postalCode ? { postalCode: p.postalCode } : {}), addressLocality: p.locality, addressRegion: p.region, addressCountry: p.countryCode }
}

export function absoluteUrl(path = '/') {
  return new URL(path, site.url).toString()
}

/**
 * Where this build is actually live, for link-preview images (WhatsApp, LinkedIn, Slack).
 * Until www.momixx.com points here it still serves the old WordPress site, so a preview
 * image addressed there would be missing. Vercel names the live address at build time:
 * momixx.vercel.app today, and the custom domain once it is attached. Canonical links,
 * the sitemap and structured data keep using site.url.
 */
export const shareOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : site.url

/**
 * Search results show about 155–160 characters of a description. Longer text is
 * cut at the last full sentence that fits, or else at a word, never mid-word.
 */
export function metaDescription(text: string, max = 158) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g) ?? []
  let out = ''
  for (const sentence of sentences) {
    if ((out + sentence).trim().length > max) break
    out += sentence
  }
  if (out.trim().length >= 70) return out.trim()
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\s]+$/, '')}…`
}

/**
 * Per-page metadata with a self-referencing canonical URL. Every page must set
 * its own canonical, otherwise search engines may treat pages as duplicates.
 */
/**
 * Claims still waiting for HQ's evidence (see content/home.ts) appear only on Vercel preview
 * deployments, in development, or with SHOW_PENDING=1, marked "Awaiting confirmation". The
 * live site, and any build that cannot tell, leaves them out.
 */
export const showPending =
  process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development' || process.env.SHOW_PENDING === '1'

export function pageMetadata({
  title,
  description: text,
  path,
  ownImage = false,
}: {
  title: string
  description: string
  path: string
  /** The route has its own opengraph-image file, so don't point at the shared one. */
  ownImage?: boolean
}) {
  const description = metaDescription(text)
  return {
    // Google cuts titles at about 60 characters, so a long one drops the " | MoMixx" ending
    // rather than losing its own last words.
    title: title.length + ` | ${site.name}`.length > 60 ? { absolute: title } : title,
    description,
    // Absolute, so they stay on site.url while relative image paths resolve to shareOrigin (metadataBase).
    alternates: {
      canonical: absoluteUrl(path),
      // Every page points feed readers at the Insights feed.
      types: { 'application/rss+xml': [{ url: absoluteUrl('/insights/feed.xml'), title: `${site.name} Insights` }] },
    },
    openGraph: {
      title,
      description,
      // The address a shared card links to: the live site, so a tap never lands on the old one.
      url: new URL(path, shareOrigin).toString(),
      siteName: site.legalName,
      type: 'website' as const,
      locale: 'en_SG',
      // Setting openGraph on a page replaces the root one, so re-attach the
      // shared social image generated by app/opengraph-image.tsx, unless the
      // route makes its own (an explicit image here would override that file).
      ...(ownImage ? {} : { images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }] }),
    },
  }
}

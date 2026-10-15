// Everything the header search can find, built from the same content files as
// the pages. Served at /search.json and only downloaded when someone opens search.

import { applications } from '@/content/applications'
import { glossary, glossaryId } from '@/content/glossary'
import { categoryLabels, productHref, products } from '@/content/products'
import { teamReady } from '@/content/team'
import { topics as topicPages } from '@/content/topics'
import { getArticles, topics } from '@/lib/articles'

export type SearchGroup = 'Page' | 'Product' | 'Application' | 'Article' | 'Glossary'
export type SearchEntry = {
  title: string
  href: string
  group: SearchGroup
  /** Shown under the title. */
  desc?: string
  /** Matched but not shown: synonyms and the words people actually type. */
  keywords?: string
}

const pages: Array<Omit<SearchEntry, 'group'>> = [
  { title: 'All products', href: '/products', desc: 'Silicone materials, machines and manufacturing', keywords: 'catalogue range grades' },
  { title: 'Automation', href: '/products/machines', desc: 'Extrusion lines, mixer, winder, oven, dip coater, LCM and tooling', keywords: 'machines equipment machinery extruder extrusion line cable machine LCM tool tooling mould' },
  { title: 'Manufacturing', href: '/products/manufacturing', desc: 'Contract manufacturing and medical and precision parts', keywords: 'services ODM OEM contract manufacturing parts moulding' },
  { title: 'Markets', href: '/applications', desc: 'Where our silicone is used', keywords: 'industries uses applications' },
  { title: 'Green', href: '/sustainability', desc: 'Recycling, carbon footprint, certifications and factories', keywords: 'sustainability GRS ISCC PLUS SCS ISO certification solar green recycled factories' },
  { title: 'Recycled silicone', href: '/recycled-silicone', desc: 'How we turn silicone scrap into new silicone', keywords: 'recycling chemical recycling scrap waste circular PCR PIR' },
  { title: 'What is silicone?', href: '/silicone', desc: 'The material, from sand to finished product', keywords: 'silicone 101 explainer sand silicon basics' },
  { title: 'Insights', href: '/insights', desc: 'Articles on silicone, recycling and materials', keywords: 'blog articles news guides' },
  { title: 'Glossary', href: '/insights/glossary', desc: 'Silicone terms in plain English', keywords: 'definitions terms dictionary' },
  { title: 'About us', href: '/about', desc: 'Our story, milestones and sites', keywords: 'company history milestones founded story' },
  { title: 'Governance', href: '/governance', desc: 'Company information, certifications and policies', keywords: 'governance board directors committees policies registration UEN company information' },
  ...(teamReady ? [{ title: 'Leadership', href: '/leadership', desc: 'Our management team', keywords: 'leadership management CEO chief executive directors' }] : []),
  { title: 'Culture & careers', href: '/culture', desc: 'How we work, and joining us', keywords: 'careers jobs hiring vacancies work culture' },
  { title: 'Locations', href: '/about#locations', desc: 'Singapore headquarters and plants in Penang, Malaysia', keywords: 'address factory plant Singapore Penang Batu Kawan Perai Malaysia map' },
  { title: 'Research & innovation', href: '/innovation', desc: 'Patents and research', keywords: 'R&D patents research innovation technology' },
  { title: 'Market size', href: '/applications#markets', desc: 'Independent estimates for the industries we serve', keywords: 'market size growth forecast industry data' },
  { title: 'Contact us', href: '/contact', desc: 'Send an enquiry', keywords: 'enquiry email phone quote sales samples get in touch' },
  { title: 'Privacy notice', href: '/privacy', keywords: 'privacy data personal data PDPA' },
  { title: 'Terms of use', href: '/terms', keywords: 'terms conditions legal' },
]

export function buildSearchIndex(): SearchEntry[] {
  return [
    // Recycled silicone is listed once, as its page.
    ...products.filter((p) => p.slug !== 'recycled-silicone').map((p) => ({
      title: p.name,
      href: productHref(p.slug),
      group: 'Product' as const,
      desc: p.tagline,
      keywords: [p.tabLabel, categoryLabels[p.category], p.summary].filter(Boolean).join(' '),
    })),
    ...applications.map((a) => ({
      title: a.name,
      href: `/applications/${a.slug}`,
      group: 'Application' as const,
      desc: a.tagline,
      keywords: [a.tabLabel, ...a.examples].join(' '),
    })),
    ...pages.map((p) => ({ ...p, group: 'Page' as const })),
    ...topicPages.map((t) => ({
      title: t.label,
      href: t.path,
      group: (t.path.startsWith('/products') ? 'Product' : 'Page') as SearchGroup,
      desc: t.description,
      keywords: t.sections.map((x) => x.title).join(' '),
    })),
    ...getArticles().map((a) => ({
      title: a.title,
      href: `/insights/${a.slug}`,
      group: 'Article' as const,
      desc: a.description,
      keywords: [topics[a.topic].label, ...a.tags].join(' '),
    })),
    ...glossary.map((t) => ({
      title: t.term,
      href: `/insights/glossary#${glossaryId(t.term)}`,
      group: 'Glossary' as const,
      desc: t.definition,
      keywords: t.also,
    })),
  ]
}

// Everything the header search can find, built from the same content files as
// the pages. Served at /search.json and only downloaded when someone opens search.

import { applications } from '@/content/applications'
import { glossary, glossaryId } from '@/content/glossary'
import { categoryLabels, products } from '@/content/products'
import { teamReady } from '@/content/team'
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
  { title: 'Applications', href: '/applications', desc: 'Where our silicone is used', keywords: 'industries uses markets' },
  { title: 'Sustainability', href: '/sustainability', desc: 'Certificates, carbon footprint and green initiatives', keywords: 'GRS ISCC PLUS SCS certification carbon footprint solar green recycled' },
  { title: 'Recycled silicone', href: '/recycled-silicone', desc: 'How we turn silicone scrap into new silicone', keywords: 'recycling chemical recycling scrap waste circular PCR PIR' },
  { title: 'What is silicone?', href: '/silicone', desc: 'The material, from sand to finished product', keywords: 'silicone 101 explainer sand silicon basics' },
  { title: 'Insights', href: '/insights', desc: 'Articles on silicone, recycling and materials', keywords: 'blog articles news guides' },
  { title: 'Glossary', href: '/insights/glossary', desc: 'Silicone terms in plain English', keywords: 'definitions terms dictionary' },
  { title: 'About us', href: '/about', desc: 'Our story, milestones and sites', keywords: 'company history milestones founded story' },
  { title: 'Newsroom', href: '/newsroom', desc: 'Announcements, recent milestones and media contacts', keywords: 'news press media announcements milestones' },
  { title: 'Governance', href: '/governance', desc: 'Company information, certifications and policies', keywords: 'governance board directors committees policies registration UEN company information' },
  ...(teamReady ? [{ title: 'Our team', href: '/team', desc: 'Management', keywords: 'leadership management directors' }] : []),
  { title: 'Culture & careers', href: '/culture', desc: 'How we work, and joining us', keywords: 'careers jobs hiring vacancies work culture' },
  { title: 'Locations', href: '/locations', desc: 'Singapore headquarters and plants in Penang, Malaysia', keywords: 'address factory plant Singapore Penang Batu Kawan Perai Malaysia map' },
  { title: 'Research & innovation', href: '/innovation', desc: 'Patents and research', keywords: 'R&D patents research innovation technology' },
  { title: 'Markets', href: '/markets', desc: 'Independent estimates for the industries we serve', keywords: 'market size growth forecast industry data' },
  { title: 'Contact us', href: '/contact', desc: 'Send an enquiry', keywords: 'enquiry email phone quote sales samples get in touch' },
  { title: 'Privacy notice', href: '/privacy', keywords: 'privacy data personal data PDPA' },
  { title: 'Terms of use', href: '/terms', keywords: 'terms conditions legal' },
]

export function buildSearchIndex(): SearchEntry[] {
  return [
    ...products.map((p) => ({
      title: p.name,
      href: `/products/${p.slug}`,
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

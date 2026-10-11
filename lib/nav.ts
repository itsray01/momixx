// Navigation menus, built on the server from the content files so the header
// only receives the few fields it shows (no product data in the browser bundle).

import type { ModelName } from '@/components/three/modelNames'
import { applications } from '@/content/applications'
import { productsByCategory } from '@/content/products'
import { certificationClaim } from '@/content/sustainability'
import { teamReady } from '@/content/team'
import { getArticles, topics, type Topic } from '@/lib/articles'
import { site } from '@/lib/site'

export type MenuLink = { href: string; label: string; desc?: string; model?: ModelName }
export type MenuColumn = { title: string; href?: string; links: MenuLink[] }
export type MenuFeature = { href: string; eyebrow: string; title: string; body: string; model: ModelName; cta?: string }
export type Menu = { label: string; href: string; columns?: MenuColumn[]; feature?: MenuFeature; wide?: boolean }

// Short names for the menu, where the full product name repeats "MoMixx" five times in a row.
const menuNames: Record<string, string> = {
  'momixx-mm': 'MM Series',
  'momixx-high-density': 'High Density (MHD)',
  'momixx-move': 'Move (MV)',
  'momixx-procase': 'ProCase (MPC)',
  'momixx-seal': 'Seal (MMS)',
}

const productLinks = (category: Parameters<typeof productsByCategory>[0]): MenuLink[] =>
  productsByCategory(category).map((p) => ({ href: `/products/${p.slug}`, label: menuNames[p.slug] ?? p.name, desc: p.tagline, model: p.illustration }))

// Five menus: what we sell, where it goes, sustainability, the company (with investors and news),
// and insights (with the silicone explainer). Every page is still reachable; only the grouping changed.
export function buildMenus(): Menu[] {
  const latest = getArticles()[0]
  const usedTopics = (Object.keys(topics) as Topic[]).filter((t) => getArticles().some((a) => a.topic === t))

  return [
    {
      label: 'Products',
      href: '/products',
      wide: true,
      columns: [
        { title: 'Materials', href: '/products#materials', links: productLinks('materials') },
        { title: 'Machines', href: '/products#equipment', links: productLinks('equipment') },
        { title: 'Manufacturing', href: '/products#services', links: productLinks('services') },
      ],
      feature: {
        href: '/products/vertical-extruder',
        eyebrow: 'Patented',
        title: 'Our vertical extrusion line',
        body: 'To our knowledge the first of its kind: up to 100 metres of silicone cable a minute. Explore it part by part.',
        model: 'extruder-vertical',
      },
    },
    {
      label: 'Applications',
      href: '/applications',
      wide: true,
      columns: [
        {
          title: 'Where silicone goes',
          href: '/applications',
          links: [
            ...applications.map((a) => ({ href: `/applications/${a.slug}`, label: a.tabLabel, desc: a.tagline, model: a.illustration })),
            { href: '/markets', label: 'Markets', desc: 'Independent estimates for the industries our materials serve.', model: 'globe' as ModelName },
          ],
        },
      ],
      feature: {
        href: '/applications',
        eyebrow: 'Applications',
        title: 'One material, many industries',
        body: 'Where MoMixx silicone is used today, and which markets are still new for us.',
        model: 'datacentre',
      },
    },
    {
      label: 'Sustainability',
      href: '/sustainability',
      columns: [
        {
          title: 'Sustainability',
          links: [
            { href: '/sustainability', label: 'Overview', desc: 'Certificates, carbon and green initiatives', model: 'recycle' },
            { href: '/recycled-silicone', label: 'Recycled silicone', desc: 'How we turn scrap into new silicone', model: 'bottle' },
            { href: '/sustainability#carbon-footprint', label: 'Carbon footprint', desc: 'Our footprint and how we cut it', model: 'sand' },
            { href: '/insights/grs-vs-iscc-plus-vs-scs', label: 'GRS vs ISCC PLUS vs SCS', desc: 'What each certificate proves', model: 'compound' },
          ],
        },
      ],
      feature: {
        href: '/sustainability',
        eyebrow: certificationClaim.short,
        title: 'Certified recycled silicone',
        body: certificationClaim.headline,
        model: 'recycle',
      },
    },
    {
      label: 'Company',
      href: '/about',
      columns: [
        {
          title: 'Company',
          links: [
            { href: '/about', label: 'About us', desc: `Our story since ${site.foundingYear}` },
            // Listed once real names and photos are in content/team.ts.
            ...(teamReady ? [{ href: '/team', label: 'Our team', desc: 'Management' }] : []),
            { href: '/culture', label: 'Culture & careers', desc: 'How we work, and joining us' },
            { href: '/locations', label: 'Locations', desc: 'Singapore and Penang, Malaysia' },
            { href: '/innovation', label: 'Research & innovation', desc: '20+ patents, granted or pending' },
          ],
        },
        {
          title: 'Investors and news',
          links: [
            { href: '/governance', label: 'Governance', desc: 'Company information, certifications and policies' },
            { href: '/markets', label: 'Markets', desc: 'Independent estimates for the industries we serve' },
            { href: '/newsroom', label: 'Newsroom', desc: 'Milestones and media enquiries' },
            { href: '/governance#company-enquiries', label: 'Company enquiries', desc: 'Contact the company' },
          ],
        },
      ],
      feature: {
        href: '/locations',
        eyebrow: 'Global presence',
        title: 'Built in Asia, for the world',
        body: 'Headquartered in Singapore, with research and manufacturing in Penang, Malaysia.',
        model: 'globe',
      },
    },
    {
      label: 'Insights',
      href: '/insights',
      columns: [
        {
          title: 'Silicone 101',
          href: '/silicone',
          links: [
            { href: '/silicone', label: 'What is silicone?', desc: 'The material, in two minutes', model: 'molecule' },
            { href: '/insights/silicon-vs-silicone', label: 'Silicon vs silicone', desc: 'One letter, two very different things', model: 'sand' },
            { href: '/insights/lsr-vs-hcr', label: 'Liquid vs solid silicone', desc: 'The two main types (LSR and HCR)', model: 'samples' },
            { href: '/insights/glossary', label: 'Glossary', desc: 'Silicone terms in plain English', model: 'compound' },
          ],
        },
        {
          title: 'Topics',
          href: '/insights',
          links: usedTopics.map((t) => ({ href: `/insights/topic/${t}`, label: topics[t].label })),
        },
      ],
      ...(latest
        ? { feature: { href: `/insights/${latest.slug}`, eyebrow: 'Latest article', title: latest.title, body: latest.description, model: latest.model, cta: 'Read' } }
        : {}),
    },
  ]
}

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

export function buildMenus(): Menu[] {
  const latest = getArticles()[0]
  const usedTopics = (Object.keys(topics) as Topic[]).filter((t) => getArticles().some((a) => a.topic === t))

  return [
    // Menu order: what we sell and who we are first; the silicone explainer and articles last.
    {
      label: 'Products',
      href: '/products',
      wide: true,
      columns: [
        {
          title: 'Materials',
          href: '/products#materials',
          links: productsByCategory('materials').map((p) => ({ href: `/products/${p.slug}`, label: p.tabLabel ?? p.name })),
        },
        {
          title: 'Machines',
          href: '/products#equipment',
          links: productsByCategory('equipment').map((p) => ({ href: `/products/${p.slug}`, label: p.name })),
        },
        {
          title: 'Manufacturing',
          href: '/products#services',
          links: productsByCategory('services').map((p) => ({ href: `/products/${p.slug}`, label: p.name })),
        },
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
          links: applications.map((a) => ({ href: `/applications/${a.slug}`, label: a.tabLabel, desc: a.tagline, model: a.illustration })),
        },
      ],
      feature: {
        href: '/markets',
        eyebrow: 'Markets',
        title: 'Growth markets, sourced',
        body: 'Independent estimates for the industries our materials serve.',
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
            { href: '/newsroom', label: 'Newsroom', desc: 'Announcements and milestones' },
            { href: '/governance', label: 'Governance', desc: 'Company information and certifications' },
            // Listed once real names and photos are in content/team.ts.
            ...(teamReady ? [{ href: '/team', label: 'Our team', desc: 'Management' }] : []),
            { href: '/culture', label: 'Culture & careers', desc: 'How we work, and joining us' },
            { href: '/locations', label: 'Locations', desc: 'Singapore and Penang, Malaysia' },
            { href: '/innovation', label: 'Research & innovation', desc: '20+ patents, granted or pending' },
            { href: '/markets', label: 'Markets', desc: 'Where the growth is' },
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
      label: 'Silicone',
      href: '/silicone',
      columns: [
        {
          title: 'Silicone 101',
          links: [
            { href: '/silicone', label: 'What is silicone?', desc: 'The material, in two minutes', model: 'molecule' },
            { href: '/insights/silicon-vs-silicone', label: 'Silicon vs silicone', desc: 'One letter, two very different things', model: 'sand' },
            { href: '/insights/lsr-vs-hcr', label: 'Liquid vs solid silicone', desc: 'The two main types (LSR and HCR)', model: 'samples' },
            { href: '/insights/glossary', label: 'Glossary', desc: 'Silicone terms in plain English', model: 'compound' },
          ],
        },
      ],
      feature: {
        href: '/insights/how-silicone-cable-is-made',
        eyebrow: 'Explainer',
        title: 'How silicone cable is made',
        body: 'From wire and liquid silicone to finished cable, in five steps.',
        model: 'extruder-horizontal',
        cta: 'Read',
      },
    },
    {
      label: 'Insights',
      href: '/insights',
      columns: [
        {
          title: 'Topics',
          href: '/insights',
          links: [
            ...usedTopics.map((t) => ({ href: `/insights/topic/${t}`, label: topics[t].label })),
            { href: '/insights/glossary', label: 'Glossary' },
          ],
        },
      ],
      ...(latest
        ? { feature: { href: `/insights/${latest.slug}`, eyebrow: 'Latest article', title: latest.title, body: latest.description, model: latest.model, cta: 'Read' } }
        : {}),
    },
  ]
}

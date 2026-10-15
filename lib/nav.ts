// Navigation menus, built on the server from the content files so the header
// only receives the few fields it shows (no product data in the browser bundle).

import type { ModelName } from '@/components/three/modelNames'
import { applications } from '@/content/applications'
import { newsroomReady } from '@/content/news'
import { certificationClaim } from '@/content/sustainability'
import { teamReady } from '@/content/team'
import { productGroups } from '@/content/topics'
import { getArticles } from '@/lib/articles'
import { site } from '@/lib/site'

export type MenuLink = { href: string; label: string; desc?: string; model?: ModelName }
export type MenuColumn = { title: string; href?: string; links: MenuLink[] }
export type MenuFeature = { href: string; eyebrow: string; title: string; body: string; model: ModelName; cta?: string }
export type Menu = { label: string; href: string; columns?: MenuColumn[]; feature?: MenuFeature; wide?: boolean }

// Menus follow the site map (Who we are / Green / Markets / Products), plus Insights.
// Each link opens a page that lists its own sub-items as anchored sections.
export function buildMenus(): Menu[] {
  const latest = getArticles()[0]

  return [
    {
      label: 'Who we are',
      href: '/about',
      columns: [
        {
          title: 'Who we are',
          links: [
            { href: '/about', label: 'About us', desc: `Our story since ${site.foundingYear}, and our sites`, model: 'globe' },
            // Listed while content/team.ts has at least one person.
            ...(teamReady ? [{ href: '/leadership', label: 'Leadership', desc: 'Our management team', model: 'globe' as const }] : []),
            { href: '/innovation', label: 'Research & innovation', desc: '20+ patents, granted or pending', model: 'molecule' },
            { href: '/culture', label: 'Culture & careers', desc: 'How we work, and careers', model: 'samples' },
            { href: '/governance', label: 'Governance', desc: 'Company information, certifications and policies', model: 'compound' },
            // Listed once the first press release is in content/news.ts.
            ...(newsroomReady ? [{ href: '/newsroom', label: 'Newsroom', desc: 'Announcements and media enquiries', model: 'globe' as const }] : []),
          ],
        },
      ],
      feature: {
        href: '/about#locations',
        eyebrow: 'Global presence',
        title: 'Built in Asia, for the world',
        body: 'Headquartered in Singapore, with research and manufacturing in Penang, Malaysia.',
        model: 'globe',
      },
    },
    {
      label: 'Green',
      href: '/sustainability',
      columns: [
        {
          title: 'Green',
          href: '/sustainability',
          links: [
            { href: '/recycled-silicone', label: 'Recycle', desc: 'How we turn silicone waste into new silicone', model: 'recycle' },
            { href: '/carbon-footprint', label: 'Carbon footprint', desc: 'An independently checked calculation', model: 'sand' },
            { href: '/sustainability', label: 'Sustainability', desc: 'Certifications and factories', model: 'globe' },
          ],
        },
      ],
      feature: {
        href: '/sustainability#certificates',
        eyebrow: certificationClaim.short,
        title: 'Certified recycled silicone',
        body: certificationClaim.headline,
        model: 'recycle',
      },
    },
    {
      label: 'Markets',
      href: '/applications',
      columns: [
        {
          title: 'Markets',
          href: '/applications',
          links: applications.filter((a) => a.inMenu !== false).map((a) => ({ href: `/applications/${a.slug}`, label: a.tabLabel, desc: a.tagline, model: a.illustration })),
        },
      ],
      feature: {
        href: '/applications#markets',
        eyebrow: 'Market size',
        title: 'One material, many industries',
        body: 'Where MoMixx silicone is used today, which markets are still new for us, and how large they are expected to grow.',
        model: 'datacentre',
      },
    },
    {
      label: 'Products',
      href: '/products',
      columns: productGroups.map((g) => ({ title: g.title, href: `/products#${g.id}`, links: g.links })),
      feature: {
        href: '/products/machines#vertical-extruder',
        eyebrow: 'Patented',
        title: 'Our vertical extrusion line',
        body: 'To our knowledge the first of its kind: up to 100 metres of silicone cable a minute. Explore it part by part.',
        model: 'extruder-vertical',
      },
    },
    {
      label: 'Insights',
      href: '/insights',
      columns: [
        {
          title: 'Insights',
          links: [
            { href: '/insights', label: 'Articles', desc: 'Silicone, recycling and where it is used', model: 'compound' },
            { href: '/silicone', label: 'What is silicone?', desc: 'The material, in two minutes', model: 'molecule' },
            { href: '/insights/glossary', label: 'Glossary', desc: 'Silicone terms in plain English', model: 'sand' },
          ],
        },
      ],
      ...(latest
        ? { feature: { href: `/insights/${latest.slug}`, eyebrow: 'Latest article', title: latest.title, body: latest.description, model: latest.model, cta: 'Read' } }
        : {}),
    },
  ]
}

// Navigation menus, built on the server from the content files so the header
// only receives the few fields it shows (no product data in the browser bundle).

import type { ModelName } from '@/components/three/modelNames'
import { applications } from '@/content/applications'
import { newsroomReady } from '@/content/news'
import { certificationClaim } from '@/content/sustainability'
import { teamReady } from '@/content/team'
import { getArticles } from '@/lib/articles'
import { site } from '@/lib/site'

export type MenuLink = { href: string; label: string; desc?: string; model?: ModelName }
export type MenuColumn = { title: string; href?: string; links: MenuLink[] }
export type MenuFeature = { href: string; eyebrow: string; title: string; body: string; model: ModelName; cta?: string }
export type Menu = { label: string; href: string; columns?: MenuColumn[]; feature?: MenuFeature; wide?: boolean }

// Five short menus, about 18 links in all: each points at a page that gathers its
// own detail (the products overview lists every material, the machines page every
// machine, and so on), so the menus stay quick to scan.
export function buildMenus(): Menu[] {
  const latest = getArticles()[0]

  return [
    {
      label: 'Products',
      href: '/products',
      columns: [
        {
          title: 'Products',
          href: '/products',
          links: [
            { href: '/products#materials', label: 'Materials', desc: 'Silicone for cables, seals, bonding and PFAS-free parts', model: 'samples' },
            { href: '/products/machines', label: 'Machines', desc: 'Extrusion lines and the machines around them', model: 'extruder-vertical' },
            { href: '/products/manufacturing', label: 'Manufacturing', desc: 'Parts made to order, including medical', model: 'oem' },
          ],
        },
      ],
      feature: {
        href: '/products/machines#vertical-extruder',
        eyebrow: 'Patented',
        title: 'Our vertical extrusion line',
        body: 'To our knowledge the first of its kind: up to 100 metres of silicone cable a minute. Explore it part by part.',
        model: 'extruder-vertical',
      },
    },
    {
      label: 'Applications',
      href: '/applications',
      columns: [
        {
          title: 'Where silicone goes',
          href: '/applications',
          links: applications.map((a) => ({ href: `/applications/${a.slug}`, label: a.tabLabel, desc: a.tagline, model: a.illustration })),
        },
      ],
      feature: {
        href: '/applications',
        eyebrow: 'Applications',
        title: 'One material, many industries',
        body: 'Where MoMixx silicone is used today, which markets are still new for us, and how large they are expected to grow.',
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
            { href: '/about', label: 'About us', desc: `Our story since ${site.foundingYear}, and our sites` },
            // Listed once real names and photos are in content/team.ts.
            ...(teamReady ? [{ href: '/team', label: 'Our team', desc: 'Management' }] : []),
            { href: '/innovation', label: 'Research & innovation', desc: '20+ patents, granted or pending' },
            { href: '/culture', label: 'Culture & careers', desc: 'How we work, and joining us' },
            { href: '/governance', label: 'Governance', desc: 'Company information, certifications and policies' },
            // Listed once the first press release is in content/news.ts.
            ...(newsroomReady ? [{ href: '/newsroom', label: 'Newsroom', desc: 'Announcements and media enquiries' }] : []),
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

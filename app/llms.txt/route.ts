import { applications } from '@/content/applications'
import { certifications, milestones } from '@/content/company'
import { siliconeFaqs } from '@/content/faqs'
import { formatUsd, markets } from '@/content/markets'
import { newsroomReady } from '@/content/news'
import { categoryLabels, productHref, products } from '@/content/products'
import { certificationClaim } from '@/content/sustainability'
import { displayName, team, teamReady } from '@/content/team'
import { topics } from '@/content/topics'
import { getArticles } from '@/lib/articles'
import { absoluteUrl, site } from '@/lib/site'

// /llms.txt: a plain-text summary of the site for AI assistants and answer
// engines (see llmstxt.org). Generated from the same content as the pages, so
// it never goes out of date.
export const dynamic = 'force-static'

export function GET() {
  const lines = [
    `# ${site.name} (${site.legalName})`,
    '',
    `> ${site.description}`,
    '',
    `Founded ${site.foundingYear}. Headquarters: ${site.address.street}, ${site.address.locality} ${site.address.postalCode}. Contact: ${site.email}.`,
    `Note: MoMixx makes silicone (the flexible polymer), not silicon (the element used in chips).`,
    `Sustainability: ${certificationClaim.headline}`,
    '',
    '## Key pages',
    `- [What is silicone?](${absoluteUrl('/silicone')}): plain-English guide, silicon vs silicone, FAQs`,
    `- [Products](${absoluteUrl('/products')}): silicone materials, coatings, yarn and leather, precision components, automation and carbon footprint reports`,
    `- [Markets](${absoluteUrl('/applications')}): where MoMixx silicone is used, with third-party market-size estimates and sources`,
    `- [Green](${absoluteUrl('/sustainability')}): certifications, factories, and links to recycling and carbon footprint`,
    `- [Recycled silicone](${absoluteUrl('/recycled-silicone')}): how we started, recycling process, audits and certifications`,
    ...topics.map((t) => `- [${t.label}](${absoluteUrl(t.path)}): ${t.description}`),
    `- [Insights](${absoluteUrl('/insights')}): articles on silicone, recycling and applications (RSS: ${absoluteUrl('/insights/feed.xml')})`,
    `- [About](${absoluteUrl('/about')}): history, milestones and locations: Singapore headquarters; R&D and manufacturing at Batu Kawan, Penang, Malaysia (ISO 13485); manufacturing at Perai, Penang (${site.plants.perai.company}); manufacturing at Dongguan, Guangdong, China (${site.plants.dongguan.company})`,
    ...(teamReady ? [`- [Leadership](${absoluteUrl('/leadership')}): ${team.map((m) => `${displayName(m)}, ${m.role}`).join('; ')}`] : []),
    ...(newsroomReady ? [`- [Newsroom](${absoluteUrl('/newsroom')}): announcements, recent milestones, latest articles and media contact (${site.mediaEmail || site.email})`] : []),
    `- [Governance](${absoluteUrl('/governance')}): company information (${site.legalName}, Singapore UEN ${site.registrationNumber}), certifications and website policies`,
    `- [Research & innovation](${absoluteUrl('/innovation')}): patents and research areas, including the vertical extrusion line`,
    `- [Glossary](${absoluteUrl('/insights/glossary')}): silicone and certification terms in plain English`,
    `- [Culture & careers](${absoluteUrl('/culture')}): how the company works, and roles it hires for`,
    `- [Contact](${absoluteUrl('/contact')}): sales, technical and partnership enquiries`,
    '',
    '## Products',
    ...products.map((p) => `- [${p.name}](${absoluteUrl(productHref(p.slug))}) (${categoryLabels[p.category]}): ${p.tagline}`),
    '',
    '## Markets',
    ...applications.map((a) => `- [${a.name}](${absoluteUrl(`/applications/${a.slug}`)}): ${a.tagline} Status: ${a.maturity}.`),
    '',
    '## Insights articles',
    ...getArticles().map((a) => `- [${a.title}](${absoluteUrl(`/insights/${a.slug}`)}) (${a.updated ?? a.date}): ${a.description}`),
    '',
    '## Certifications',
    ...certifications.map((c) => `- ${c.name} (${c.schemeOwner ? `standard owner: ${c.schemeOwner}; ` : ''}issued by ${c.issuer})${c.year ? `, since ${c.year}` : ''}: ${c.plain}`),
    '',
    '## Milestones',
    ...milestones.map((m) => `- ${m.year}: ${m.items.join('; ')}`),
    '',
    '## Market context (third-party estimates, not MoMixx forecasts)',
    ...markets.map(
      (m) =>
        `- ${m.name}: ${m.current ? `${formatUsd(m.current.usdBn)} (${m.current.year}) → ` : ''}${formatUsd(m.forecast.usdBn)} (${m.forecast.year})${m.cagr ? `, ${m.cagr.pct}% CAGR ${m.cagr.period}` : ''}. Source: ${m.source.publisher}, ${m.source.url}`,
    ),
    '',
    '## FAQ',
    ...siliconeFaqs.flatMap((f) => [`### ${f.q}`, f.a, '']),
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

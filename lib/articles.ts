// Insights articles: Markdown files in content/articles/*.md with frontmatter.
// Add a new file and it appears on /insights, in the sitemap, the RSS feed and
// /llms.txt automatically. See content/articles/README.md for the format.

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { modelNames, type ModelName } from '@/components/three/modelNames'

const dir = path.join(process.cwd(), 'content/articles')

export const topics = {
  'silicone-basics': { label: 'Silicone basics', blurb: 'What silicone is, how it is made and the main types.' },
  recycling: { label: 'Recycling', blurb: 'How silicone recycling works and why it matters.' },
  sustainability: { label: 'Sustainability', blurb: 'Certifications, carbon footprint and safer materials.' },
  applications: { label: 'Applications', blurb: 'Silicone in cables, EVs, medicine, data centres and robots.' },
  technology: { label: 'Technology', blurb: 'How silicone products are made, and the machines that make them.' },
  regulation: { label: 'Regulation', blurb: 'Standards and rules that shape the silicone industry.' },
} as const

export type Topic = keyof typeof topics

export type Article = {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  topic: Topic
  tags: string[]
  model: ModelName
  takeaways: string[]
  faqs: Array<{ q: string; a: string }>
  sources: Array<{ title: string; url: string }>
  /** Named expert byline (optional). Without it, the article is credited to the Momixx team. */
  author?: { name: string; role?: string; url?: string }
  html: string
  headings: Array<{ id: string; text: string }>
  readingMinutes: number
  words: number
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Plain text from inline HTML: strips tags and decodes the entities marked emits. */
function plainText(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function render(md: string) {
  const headings: Array<{ id: string; text: string }> = []
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens)
        const plain = plainText(text)
        const id = slugify(plain.replace(/['’]/g, ''))
        if (depth === 2) headings.push({ id, text: plain })
        return `<h${depth} id="${id}">${text}</h${depth}>\n`
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens)
        const external = /^https?:\/\//.test(href)
        return `<a href="${href}"${title ? ` title="${title}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`
      },
    },
  })
  // Wide tables scroll inside their own box instead of widening the page on phones.
  const html = (marked.parse(md, { async: false }) as string)
    .replace(/<table>/g, '<div class="table-scroll" role="region" aria-label="Table" tabindex="0"><table>')
    .replace(/<\/table>/g, '</table></div>')
  return { html, headings }
}

let cache: Article[] | null = null

export function getArticles(): Article[] {
  if (cache && process.env.NODE_ENV === 'production') return cache
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md') : []
  const list = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data, content } = matter(raw)
    const slug = file.replace(/\.md$/, '')
    const { html, headings } = render(content)
    const words = content.split(/\s+/).filter(Boolean).length
    const topic = data.topic as Topic
    if (!(topic in topics)) throw new Error(`${file}: unknown topic "${data.topic}"`)
    const model = (modelNames as readonly string[]).includes(data.model) ? (data.model as ModelName) : 'samples'
    const toDate = (d: unknown) => (d instanceof Date ? d.toISOString().slice(0, 10) : d ? String(d) : undefined)
    return {
      slug,
      title: String(data.title),
      description: String(data.description),
      date: toDate(data.date)!,
      updated: toDate(data.updated),
      topic,
      tags: data.tags ?? [],
      model,
      takeaways: data.takeaways ?? [],
      faqs: data.faqs ?? [],
      sources: data.sources ?? [],
      author: data.author?.name ? { name: String(data.author.name), role: data.author.role, url: data.author.url } : undefined,
      html,
      headings,
      words,
      readingMinutes: Math.max(1, Math.round(words / 220)),
    } satisfies Article
  })
  cache = list.sort((a, b) => (b.updated ?? b.date).localeCompare(a.updated ?? a.date))
  return cache
}

export function getArticle(slug: string) {
  return getArticles().find((a) => a.slug === slug)
}

export function relatedArticles(a: Article, n = 3) {
  return getArticles()
    .filter((x) => x.slug !== a.slug)
    .map((x) => ({ x, score: (x.topic === a.topic ? 2 : 0) + x.tags.filter((t) => a.tags.includes(t)).length }))
    .sort((p, q) => q.score - p.score)
    .slice(0, n)
    .map((p) => p.x)
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

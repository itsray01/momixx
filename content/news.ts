// Press releases for /newsroom, newest first. Each one needs a real, published
// date. Until there is at least one, the newsroom is hidden: /newsroom redirects
// to /about (next.config.ts) and it is left out of the menus, footer and sitemap.

export type NewsItem = {
  slug: string
  /** Publication date, YYYY-MM-DD. */
  date: string
  title: string
  summary: string
  /** The full release, e.g. a PDF in public/ or an exchange announcement. */
  href?: string
}

export const news: NewsItem[] = []

/** The newsroom is listed once there is news to show. */
export const newsroomReady = news.length > 0

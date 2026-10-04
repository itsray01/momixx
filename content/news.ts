// Press releases for /newsroom, newest first. Each one needs a real, published
// date. Until there is at least one, the Announcements section stays hidden.

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

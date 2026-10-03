import { buildSearchIndex } from '@/lib/searchIndex'

// The header search's index, built once at build time and fetched the first
// time someone opens search.
export const dynamic = 'force-static'

export function GET() {
  return Response.json(buildSearchIndex())
}

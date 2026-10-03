import { applications, getApplication } from '@/content/applications'
import { ogCard, ogSize } from '@/lib/og'

export const size = ogSize
export const contentType = 'image/png'
// Generated at build time, like the pages themselves.
export function generateStaticParams() {
  return applications.map((a) => ({ slug: a.slug }))
}

export const alt = 'Silicone applications'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getApplication(slug)
  return ogCard({ eyebrow: 'Momixx · Applications', title: a ? `Silicone for ${a.name}` : 'Applications', subtitle: a?.tagline })
}

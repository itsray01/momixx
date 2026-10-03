import { categoryLabels, getProduct, products } from '@/content/products'
import { ogCard, ogSize } from '@/lib/og'

export const size = ogSize
export const contentType = 'image/png'
// Generated at build time, like the pages themselves.
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export const alt = 'Momixx product'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProduct(slug)
  return ogCard({ eyebrow: p ? `Momixx · ${categoryLabels[p.category]}` : 'Momixx', title: p?.name ?? 'Products', subtitle: p?.tagline })
}

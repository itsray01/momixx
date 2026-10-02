import type { Tab } from '@/components/TabNav'
import { products } from '@/content/products'

const groupLabel = { materials: 'Materials', equipment: 'Equipment', services: 'Services' } as const

export const productTabs: Tab[] = [
  { href: '/products', label: 'Overview' },
  ...(['materials', 'equipment', 'services'] as const).flatMap((cat) =>
    products
      .filter((p) => p.category === cat)
      .map((p) => ({ href: `/products/${p.slug}`, label: p.tabLabel ?? p.name, group: groupLabel[cat] })),
  ),
]

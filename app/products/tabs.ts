import type { Tab } from '@/components/TabNav'
import { getProduct, productsByCategory, type ProductCategory } from '@/content/products'

// Labels match the Products menu (lib/nav.ts); the ids are the sections on /products.
const categories: Array<{ id: ProductCategory; label: string }> = [
  { id: 'materials', label: 'Materials' },
  { id: 'equipment', label: 'Machines' },
  { id: 'services', label: 'Manufacturing' },
]

/**
 * The product tab bar: a category switch, then only the current category's products.
 * On the overview the categories jump to their sections; on a product page each
 * one opens the first product in that category.
 */
export function productNav(currentSlug?: string): { primary: Tab[]; tabs: Tab[] } {
  const current = currentSlug ? getProduct(currentSlug) : undefined
  if (!current) {
    return {
      primary: [
        { href: '/products', label: 'Overview', active: true },
        ...categories.map((c) => ({ href: `/products#${c.id}`, label: c.label, active: false })),
      ],
      tabs: [],
    }
  }
  return {
    primary: [
      { href: '/products', label: 'Overview', active: false },
      ...categories.map((c) => ({ href: `/products/${productsByCategory(c.id)[0].slug}`, label: c.label, active: c.id === current.category })),
    ],
    tabs: productsByCategory(current.category).map((p) => ({ href: `/products/${p.slug}`, label: p.tabLabel ?? p.name })),
  }
}

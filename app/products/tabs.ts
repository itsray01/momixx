import type { Tab } from '@/components/TabNav'
import { getProduct, groupPages, productHref, productsByCategory, type ProductCategory } from '@/content/products'

// Labels match the Products menu (lib/nav.ts); the ids are the sections on /products.
const categories: Array<{ id: ProductCategory; label: string }> = [
  { id: 'materials', label: 'Materials' },
  { id: 'equipment', label: 'Machines' },
  { id: 'services', label: 'Manufacturing' },
]

/** Where a category tab goes from a product page: the shared page, or the first product. */
const categoryHref = (c: ProductCategory) => groupPages[c]?.path ?? productHref(productsByCategory(c)[0].slug)

/**
 * The product tab bar: a category switch, then only the current category's products.
 * On the overview the categories jump to their sections; elsewhere each one opens
 * its page (machines and manufacturing have one page each, with a section per product).
 */
export function productNav(current?: { slug?: string; category?: ProductCategory }): { primary: Tab[]; tabs: Tab[] } {
  const category = current?.category ?? (current?.slug ? getProduct(current.slug)?.category : undefined)
  if (!category) {
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
      ...categories.map((c) => ({ href: categoryHref(c.id), label: c.label, active: c.id === category })),
    ],
    tabs: productsByCategory(category).map((p) => ({ href: productHref(p.slug), label: p.tabLabel ?? p.name })),
  }
}

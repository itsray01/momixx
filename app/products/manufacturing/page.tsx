import { categoryIntros } from '@/content/products'
import { pageMetadata } from '@/lib/site'
import { ProductGroup } from '../ProductGroup'

export const metadata = pageMetadata({
  title: 'Silicone ODM, OEM and medical parts manufacturing',
  description:
    'Silicone contract manufacturing (ODM and OEM) for other brands, and high-precision parts for medical devices and semiconductor equipment, made under our ISO 13485 certified quality system.',
  path: '/products/manufacturing',
})

export default function ManufacturingPage() {
  return (
    <ProductGroup
      category="services"
      eyebrow="Manufacturing"
      title="Finished parts, *made to order*"
      intro={categoryIntros.services}
      cta={{ title: 'Need parts *made?*', body: 'Tell us what you need made, and our team will get back to you.' }}
    />
  )
}

import { categoryIntros } from '@/content/products'
import { pageMetadata } from '@/lib/site'
import { ProductGroup } from '../ProductGroup'

export const metadata = pageMetadata({
  title: 'Silicone cable extrusion lines and machines',
  description:
    'Our patented vertical silicone cable extrusion line, a horizontal line, a low-waste LSR mixer, a camera-guided autowinder, an energy-saving curing oven and a dip-coating machine.',
  path: '/products/machines',
})

export default function MachinesPage() {
  return (
    <ProductGroup
      category="equipment"
      eyebrow="Machines"
      title="Machines we *design and build*"
      intro={categoryIntros.equipment}
      cta={{ title: 'Machinery *enquiries*', body: 'Request a datasheet or a technical consultation with our team.' }}
    />
  )
}

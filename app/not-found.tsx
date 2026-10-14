import Link from 'next/link'
import { PageHeader } from '@/components/ui'

export default function NotFound() {
  return (
    <PageHeader loop="v-dune" eyebrow="404" title="Page not found" intro="The page may have moved when the site was redesigned.">
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          Go to the home page
        </Link>
        <Link href="/products" className="btn-ghost-dark">
          Browse products
        </Link>
      </div>
    </PageHeader>
  )
}

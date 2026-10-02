import Link from 'next/link'
import { PageHeader } from '@/components/ui'

export default function NotFound() {
  return (
    <PageHeader eyebrow="404" title="We couldn’t find that page" intro="It may have moved when we redesigned the site.">
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

'use client'

import Link from 'next/link'
import { useEffect } from 'react'

// Shown if a page fails while rendering in the browser. The header and footer
// stay in place, so visitors can carry on to another page.
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="container-page pt-40 pb-32">
      <p className="eyebrow">Error</p>
      <h1 className="display-lg mt-6">Something went wrong on this page</h1>
      <p className="mt-6 max-w-xl text-lg text-zinc-300">Please try again. If it keeps happening, the rest of the site is still available.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-ghost-dark">
          Go to the home page
        </Link>
      </div>
    </section>
  )
}

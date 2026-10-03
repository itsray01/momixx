'use client'

import Link from 'next/link'

// Last-resort error page, used only if the root layout itself fails. It renders
// its own document, so it carries its own minimal styling.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#060a10', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
        <title>Something went wrong | MoMixx</title>
        <main style={{ maxWidth: 520, padding: 24 }}>
          <h1 style={{ fontSize: 32, margin: 0, color: '#fff' }}>Something went wrong</h1>
          <p style={{ lineHeight: 1.6, color: '#94a3b8' }}>Please try again in a moment.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button type="button" onClick={() => retry()} style={{ padding: '10px 18px', borderRadius: 999, border: 0, background: '#fff', color: '#060a10', fontWeight: 600, cursor: 'pointer' }}>
              Try again
            </button>
            <Link href="/" style={{ padding: '10px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,.2)', color: '#fff', textDecoration: 'none' }}>
              Home page
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}

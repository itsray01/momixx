import Link from 'next/link'
import { site } from '@/lib/site'
import { applications } from '@/content/applications'
import { products } from '@/content/products'
import { teamReady } from '@/content/team'
import { Logo } from './Logo'

const columns = [
  {
    title: 'Products',
    links: [
      { href: '/products', label: 'All products' },
      ...products
        .filter((p) => ['momixx-mm', 'momixx-high-density', 'momixx-move', 'recycled-silicone', 'vertical-extruder', 'odm-oem'].includes(p.slug))
        .map((p) => ({ href: `/products/${p.slug}`, label: p.name })),
    ],
  },
  {
    title: 'Applications',
    links: applications.map((a) => ({ href: `/applications/${a.slug}`, label: a.name })),
  },
  {
    title: 'Company',
    links: [
      { href: '/silicone', label: 'What is silicone?' },
      { href: '/sustainability', label: 'Sustainability' },
      { href: '/insights', label: 'Insights' },
      { href: '/about', label: 'About us' },
      ...(teamReady ? [{ href: '/team', label: 'Our team' }] : []),
      { href: '/culture', label: 'Culture & careers' },
      { href: '/innovation', label: 'Research & innovation' },
      { href: '/markets', label: 'Markets' },
      { href: '/contact', label: 'Contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden border-t border-white/[0.06] bg-ink-950 text-slate-400">
      <div className="container-page grid gap-12 pt-20 pb-12 lg:grid-cols-[1.2fr_2fr]">
        <div className="space-y-6">
          <Logo className="text-white" />
          <p className="max-w-sm text-sm leading-relaxed">{site.tagline}</p>
          <address className="space-y-1 text-sm not-italic">
            <p>{site.address.street}</p>
            <p>
              {site.address.locality} {site.address.postalCode}
            </p>
            <p className="pt-2">
              <a href={`mailto:${site.email}`} className="text-white underline decoration-white/20 underline-offset-4 hover:decoration-brand-300">
                {site.email}
              </a>
            </p>
          </address>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">{col.title}</h2>
              <ul className="mt-4 space-y-1 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-block py-1.5 text-slate-300 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        <p
          className="container-page -mb-[0.2em] text-center font-display text-[22vw] leading-none font-semibold tracking-[-0.06em] text-transparent lg:text-[17rem]"
          style={{ backgroundImage: 'linear-gradient(180deg, rgb(255 255 255 / 0.09), rgb(255 255 255 / 0))', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
        >
          Momixx
        </p>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}
            {site.registrationNumber && ` (UEN ${site.registrationNumber})`}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li>
              <Link href="/privacy" className="inline-block py-1 hover:text-white">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="inline-block py-1 hover:text-white">
                Terms of use
              </Link>
            </li>
            <li>
              <Link href="/locations" className="inline-block py-1 hover:text-white">
                Singapore · Penang, Malaysia
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

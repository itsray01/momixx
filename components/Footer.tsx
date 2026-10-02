import Link from 'next/link'
import { site } from '@/lib/site'
import { applications } from '@/content/applications'
import { products } from '@/content/products'
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
      { href: '/about', label: 'About us' },
      { href: '/team', label: 'Our team' },
      { href: '/innovation', label: 'Research & innovation' },
      { href: '/recycled-silicone', label: 'Recycled silicone' },
      { href: '/markets', label: 'Markets' },
      { href: '/contact', label: 'Contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-ink-950 text-slate-400">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div className="space-y-5">
          <Logo className="text-white" />
          <p className="max-w-sm text-sm leading-relaxed">{site.tagline}</p>
          <address className="space-y-1 text-sm not-italic">
            <p>{site.address.street}</p>
            <p>
              {site.address.locality} {site.address.postalCode}
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="text-slate-200 hover:text-white">
                {site.email}
              </a>
            </p>
          </address>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="font-display text-sm font-semibold text-white">{col.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>Singapore · Penang, Malaysia · Guangdong, China</p>
        </div>
      </div>
    </footer>
  )
}

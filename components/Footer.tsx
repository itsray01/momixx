import Link from 'next/link'
import { site } from '@/lib/site'
import { applications } from '@/content/applications'
import { newsroomReady } from '@/content/news'
import { getProduct } from '@/content/products'
import { teamReady } from '@/content/team'
import { BackToTop } from './BackToTop'
import { Logo } from './Logo'

const columns = [
  {
    title: 'Products',
    links: [
      { href: '/products', label: 'All products' },
      ...['momixx-mm', 'momixx-high-density', 'momixx-move'].map((slug) => ({ href: `/products/${slug}`, label: getProduct(slug)?.name ?? slug })),
      { href: '/recycled-silicone', label: 'Recycled silicone' },
      { href: '/products/machines', label: 'Machines' },
      { href: '/products/manufacturing', label: 'Manufacturing' },
    ],
  },
  {
    title: 'Applications',
    links: [...applications.map((a) => ({ href: `/applications/${a.slug}`, label: a.name })), { href: '/applications#markets', label: 'Markets' }],
  },
  {
    title: 'Company',
    links: [
      { href: '/silicone', label: 'What is silicone?' },
      { href: '/sustainability', label: 'Sustainability' },
      { href: '/insights', label: 'Insights' },
      { href: '/about', label: 'About us' },
      ...(newsroomReady ? [{ href: '/newsroom', label: 'Newsroom' }] : []),
      { href: '/governance', label: 'Governance' },
      ...(teamReady ? [{ href: '/team', label: 'Our team' }] : []),
      { href: '/culture', label: 'Culture & careers' },
      { href: '/innovation', label: 'Research & innovation' },
      { href: '/contact', label: 'Contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden border-t border-white/[0.06] bg-ink-950 text-zinc-400">
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
              <h2 className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{col.title}</h2>
              <ul className="mt-4 space-y-1 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group inline-block py-1.5 text-zinc-300 transition-colors hover:text-white">
                      {/* A thin line draws in under the link on hover. */}
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
                        {l.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
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
              <Link href="/about#locations" className="inline-block py-1 hover:text-white">
                Singapore · Penang, Malaysia
              </Link>
            </li>
            <li>
              <BackToTop />
            </li>
          </ul>
        </div>
      </div>

      {/* The name, large and quiet, sitting on the bottom edge of the site. */}
      <div aria-hidden="true" className="pointer-events-none overflow-hidden select-none">
        <p
          className="container-page -mb-[0.2em] bg-gradient-to-b from-white/[0.11] to-white/0 to-80% bg-clip-text font-display text-[clamp(5rem,21.5vw,20rem)] leading-[0.95] font-extrabold tracking-[-0.055em] text-transparent"
        >
          {site.name}
        </p>
      </div>
    </footer>
  )
}

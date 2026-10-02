'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { mainNav } from '@/lib/site'
import { Logo } from './Logo'

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

// Floating glass navigation bar. Tucks away while scrolling down and returns
// as soon as you scroll up, so it never covers content you're reading.
export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(pathname)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)

  if (open && openedAt !== pathname) setOpen(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > 240 && y > lastY.current + 4)
      if (y < lastY.current - 4 || y < 240) setHidden(false)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-out sm:px-4 sm:pt-4 ${hidden && !open ? '-translate-y-[120%]' : 'translate-y-0'}`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-ink-950">
        Skip to content
      </a>
      <div
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border px-3 pl-5 text-white transition-colors duration-500 ${
          scrolled || open ? 'border-white/10 bg-ink-950/70 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
      >
        <Link href="/" aria-label="Momixx home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.label} className="group relative">
                  <button
                    type="button"
                    aria-haspopup="true"
                    className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors hover:bg-white/[0.06] hover:text-white ${
                      item.children.some((c) => isActive(pathname, c.href)) ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {item.label}
                    <svg viewBox="0 0 12 12" className="h-3 w-3 opacity-60" aria-hidden="true">
                      <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <div className="invisible absolute top-full right-0 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="glass w-60 rounded-2xl p-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-white/[0.06] ${isActive(pathname, child.href) ? 'text-white' : 'text-slate-300'}`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-sm transition-colors hover:bg-white/[0.06] hover:text-white ${
                      isActive(pathname, item.href) ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {item.label}
                    {isActive(pathname, item.href) && <span aria-hidden="true" className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent" />}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-primary hidden py-2 sm:inline-flex">
            Contact us
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => {
              setOpenedAt(pathname)
              setOpen((o) => !o)
            }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="glass mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-6xl overflow-y-auto rounded-3xl lg:hidden">
          <ul className="space-y-1 p-3">
            {mainNav.flatMap((item) => item.children ?? [item]).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3.5 text-lg font-medium ${isActive(pathname, item.href) ? 'bg-white/[0.06] text-white' : 'text-slate-200'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="p-1 pt-3">
              <Link href="/contact" className="btn-primary w-full py-3 text-base">
                Contact us
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

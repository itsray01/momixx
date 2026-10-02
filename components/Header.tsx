'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Menu, MenuColumn, MenuLink } from '@/lib/nav'
import { Logo } from './Logo'

function isActive(pathname: string, href: string) {
  const path = href.split('#')[0]
  return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
}

const colsClass: Record<number, string> = { 1: '', 2: 'grid-cols-2', 3: 'grid-cols-[1.35fr_1fr_0.9fr]' }

function Thumb({ model }: { model: NonNullable<MenuLink['model']> }) {
  return (
    <span className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-ink-850">
      <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgb(20_159_148/0.25),transparent)]" />
      <Image src={`/renders/${model}.webp`} alt="" width={96} height={72} sizes="64px" className="relative h-full w-full object-contain p-0.5" />
    </span>
  )
}

function MenuColumnView({ col, pathname, cards, alone }: { col: MenuColumn; pathname: string; cards: boolean; alone: boolean }) {
  const many = col.links.length > 4
  const listCols = cards ? (many ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-2') : alone && many ? 'grid-cols-3' : col.links.length > 6 ? 'grid-cols-2' : ''
  return (
    <div>
      <p className="px-2.5 text-[11px] font-medium tracking-[0.16em] text-slate-500 uppercase">
        {col.href ? (
          <Link href={col.href} className="hover:text-white">
            {col.title}
          </Link>
        ) : (
          col.title
        )}
      </p>
      <ul className={`mt-3 grid gap-1 ${listCols}`}>
        {col.links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={isActive(pathname, l.href) && !l.href.includes('#') ? 'page' : undefined}
              className="group/link flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.05]"
            >
              {cards && l.model && <Thumb model={l.model} />}
              <span className="min-w-0">
                <span className={`block text-sm font-medium transition-colors group-hover/link:text-white ${isActive(pathname, l.href) ? 'text-white' : 'text-slate-200'}`}>
                  {l.label}
                </span>
                {l.desc && <span className="mt-0.5 block text-xs leading-snug text-slate-500 group-hover/link:text-slate-400">{l.desc}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Panel({ menu, pathname }: { menu: Menu; pathname: string }) {
  const columns = menu.columns ?? []
  const cards = columns.some((c) => c.links.some((l) => l.model))
  return (
    <div className={`grid gap-6 p-5 ${menu.feature ? 'grid-cols-[1fr_17rem]' : ''}`}>
      <div className={`grid gap-6 ${colsClass[Math.min(columns.length, 3)]}`}>
        {columns.map((col) => (
          <MenuColumnView key={col.title} col={col} pathname={pathname} cards={cards} alone={columns.length === 1} />
        ))}
      </div>
      {menu.feature && (
        <Link
          href={menu.feature.href}
          className="group/feature relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-brand-900/40 to-ink-900 p-5 transition-colors hover:border-brand-300/40"
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_70%_at_50%_40%,rgb(20_159_148/0.35),transparent)]" />
          <Image
            src={`/renders/${menu.feature.model}.webp`}
            alt=""
            width={480}
            height={360}
            sizes="272px"
            className="relative -mx-2 -mt-3 h-32 w-[calc(100%+1rem)] object-contain transition-transform duration-500 group-hover/feature:scale-105"
          />
          <span className="relative mt-2 text-[11px] font-medium tracking-[0.16em] text-brand-300 uppercase">{menu.feature.eyebrow}</span>
          <span className="relative mt-1.5 line-clamp-2 font-semibold tracking-[-0.02em] text-white">{menu.feature.title}</span>
          <span className="relative mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">{menu.feature.body}</span>
          <span className="relative mt-auto pt-4 text-xs font-medium text-brand-300">
            {menu.feature.cta ?? 'Explore'} <span aria-hidden="true">→</span>
          </span>
        </Link>
      )}
    </div>
  )
}

// Floating glass navigation bar with hover mega-menus. Tucks away while
// scrolling down and returns as soon as you scroll up.
export function Header({ menus }: { menus: Menu[] }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(pathname)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const [mounted, setMounted] = useState<number[]>([])
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const lastY = useRef(0)
  const closeTimer = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  if ((mobileOpen || active !== null) && openedAt !== pathname) {
    setMobileOpen(false)
    setActive(null)
    setOpenedAt(pathname)
  }

  const open = useCallback(
    (i: number) => {
      window.clearTimeout(closeTimer.current)
      setOpenedAt(pathname)
      setActive(i)
      setMounted((m) => (m.includes(i) ? m : [...m, i]))
    },
    [pathname],
  )
  const close = useCallback((delay = 160) => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setActive(null), delay)
  }, [])

  const movePill = (el: HTMLElement | null) => {
    const list = listRef.current
    if (!el || !list) return setPill(null)
    const a = el.getBoundingClientRect()
    const b = list.getBoundingClientRect()
    setPill({ left: a.left - b.left, width: a.width })
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      const down = y > 240 && y > lastY.current + 4
      setHidden(down)
      if (down) setActive(null)
      if (y < lastY.current - 4 || y < 240) setHidden(false)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setActive(null)
      listRef.current?.querySelectorAll<HTMLElement>('[data-trigger]')[active]?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const solid = scrolled || mobileOpen || active !== null

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-[2px] transition-opacity duration-300 ${active !== null ? 'opacity-100' : 'opacity-0'}`}
      />
      <header
        ref={headerRef}
        onMouseLeave={() => close()}
        onBlur={(e) => {
          if (!headerRef.current?.contains(e.relatedTarget as Node)) setActive(null)
        }}
        className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-out sm:px-4 sm:pt-4 ${hidden && !mobileOpen ? '-translate-y-[120%]' : 'translate-y-0'}`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-ink-950">
          Skip to content
        </a>
        <div
          className={`relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border px-3 pl-5 text-white transition-[background-color,border-color,box-shadow] duration-500 ${
            solid ? 'border-white/10 bg-ink-950/75 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl' : 'border-transparent bg-transparent'
          }`}
        >
          <Link href="/" aria-label="Orion MoMixx home" className="shrink-0" onMouseEnter={() => close(120)}>
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul ref={listRef} className="relative flex items-center" onMouseLeave={() => setPill(null)}>
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 rounded-full bg-white/[0.07] transition-[left,width,opacity] duration-300 ease-out ${pill ? 'opacity-100' : 'opacity-0'}`}
                style={pill ? { left: pill.left, width: pill.width } : undefined}
              />
              {menus.map((menu, i) => {
                const current = isActive(pathname, menu.href) || (menu.columns ?? []).some((c) => c.links.some((l) => !l.href.includes('#') && isActive(pathname, l.href)))
                return (
                  <li
                    key={menu.label}
                    onMouseEnter={(e) => {
                      movePill(e.currentTarget)
                      if (menu.columns) open(i)
                      else close(80)
                    }}
                  >
                    <Link
                      href={menu.href}
                      data-trigger
                      aria-expanded={menu.columns ? active === i : undefined}
                      aria-controls={menu.columns ? `menu-${i}` : undefined}
                      aria-current={pathname === menu.href ? 'page' : undefined}
                      onFocus={(e) => {
                        movePill(e.currentTarget.parentElement)
                        if (menu.columns) open(i)
                        else setActive(null)
                      }}
                      className={`relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors hover:text-white ${current || active === i ? 'text-white' : 'text-slate-300'}`}
                    >
                      {menu.label}
                      {menu.columns && (
                        <svg viewBox="0 0 12 12" className={`h-3 w-3 opacity-60 transition-transform duration-300 ${active === i ? 'rotate-180' : ''}`} aria-hidden="true">
                          <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      )}
                      {current && <span aria-hidden="true" className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2" onMouseEnter={() => close(120)}>
            <Link href="/contact" className="btn-primary hidden py-2 sm:inline-flex">
              Contact us
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => {
                setOpenedAt(pathname)
                setMobileOpen((o) => !o)
              }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop mega-menus: each mounts on first use, so their images never load with the page. */}
        <div className="relative mx-auto hidden max-w-6xl lg:block">
          {menus.map((menu, i) =>
            menu.columns && mounted.includes(i) ? (
              <div
                key={menu.label}
                id={`menu-${i}`}
                onMouseEnter={() => open(i)}
                className={`absolute inset-x-0 top-0 pt-2 transition-[opacity,transform,visibility] duration-300 ease-out ${
                  active === i ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                }`}
              >
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-ink-950/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                  <Panel menu={menu} pathname={pathname} />
                </div>
              </div>
            ) : null,
          )}
        </div>

        {mobileOpen && (
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-6xl overflow-y-auto rounded-3xl border border-white/10 bg-ink-950/[0.97] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:hidden"
          >
            <ul className="divide-y divide-white/[0.06] p-3">
              {menus.map((menu) => (
                <li key={menu.label}>
                  {menu.columns ? (
                    <details className="group" open={isActive(pathname, menu.href) || undefined}>
                      <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium text-slate-100">
                        {menu.label}
                        <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 opacity-60 transition-transform group-open:rotate-180" aria-hidden="true">
                          <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </summary>
                      <div className="space-y-4 px-2 pb-4">
                        {menu.columns.map((c) => (
                          <div key={c.title}>
                            {menu.columns!.length > 1 && <p className="px-3 pb-1 text-[11px] font-medium tracking-[0.16em] text-slate-500 uppercase">{c.title}</p>}
                            <ul className={`grid gap-0.5 ${c.links.every((l) => !l.desc) ? 'grid-cols-2' : 'sm:grid-cols-2'}`}>
                              {c.links.map((l) => (
                                <li key={l.href}>
                                  <Link
                                    href={l.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block rounded-xl px-3 py-2.5 ${isActive(pathname, l.href) && !l.href.includes('#') ? 'bg-white/[0.06] text-white' : 'text-slate-300'}`}
                                  >
                                    <span className="block text-[15px]">{l.label}</span>
                                    {l.desc && <span className="block text-xs text-slate-500">{l.desc}</span>}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link href={menu.href} className="block rounded-2xl px-4 py-3.5 text-lg font-medium text-slate-100">
                      {menu.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="p-1 pt-4">
                <Link href="/contact" className="btn-primary w-full py-3 text-base">
                  Contact us
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  )
}

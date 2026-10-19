'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Menu, MenuLink } from '@/lib/nav'
import { site } from '@/lib/site'
import { Logo } from './Logo'
import { scriptedScroll } from './motion/scriptedScroll'
import { Search } from './Search'

/** How far the visitor must keep scrolling one way before the bar hides or returns. */
const TURN = 24
/** Above this, the bar always shows. */
const NEAR_TOP = 240

function isActive(pathname: string, href: string) {
  const path = href.split('#')[0]
  return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
}

const colsClass: Record<number, string> = { 1: '', 2: 'grid-cols-2', 3: 'grid-cols-[1.1fr_1.1fr_0.9fr]' }

/** A label that rolls up to a copy of itself on hover (styles: .nav-roll in globals.css). */
function Roll({ children }: { children: string }) {
  return (
    <span className="nav-roll relative block overflow-hidden">
      <span className="nav-roll-a block">{children}</span>
      <span aria-hidden="true" className="nav-roll-b absolute inset-0 block">
        {children}
      </span>
    </span>
  )
}

/**
 * One menu as a full-width sheet: the links in columns on the left and a feature card on the right,
 * which follows the link under the pointer (or keyboard focus) and otherwise shows the menu's feature.
 */
function Sheet({ menu, pathname, open }: { menu: Menu; pathname: string; open: boolean }) {
  const columns = menu.columns ?? []
  const [hover, setHover] = useState<MenuLink | null>(null)
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (!open) setHover(null)
  }
  const f = menu.feature
  const shown = hover?.model
    ? { model: hover.model, eyebrow: columns.find((c) => c.links.includes(hover))?.title, title: hover.label, body: hover.desc, href: hover.href }
    : f
      ? { model: f.model, eyebrow: f.eyebrow, title: f.title, body: f.body, href: f.href }
      : null
  let n = 0
  return (
    // On smaller laptops a three-column menu needs the room, so its feature card appears from 1280 px up.
    <div
      className={`container-page grid gap-10 py-10 ${shown ? (columns.length >= 3 ? 'xl:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]' : 'grid-cols-[minmax(0,1fr)_minmax(14rem,22rem)]') : ''} xl:gap-20`}
    >
      <div className={`grid gap-x-10 gap-y-8 ${colsClass[Math.min(columns.length, 3)]}`}>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm text-zinc-500">
              {col.href ? (
                <Link href={col.href} className="transition-colors hover:text-white">
                  {col.title}
                </Link>
              ) : (
                col.title
              )}
            </p>
            {/* A long single list runs down two columns (down, then across), in reading order. */}
            <ul className={`mt-4 ${columns.length === 1 && col.links.length > 4 ? 'columns-2 gap-x-10' : 'grid gap-y-0.5'}`}>
              {col.links.map((l) => {
                const here = isActive(pathname, l.href) && !l.href.includes('#')
                return (
                  <li key={l.href} className="menu-item break-inside-avoid" style={{ ['--i' as string]: n++ }}>
                    <Link
                      href={l.href}
                      aria-current={here ? 'page' : undefined}
                      onMouseEnter={() => setHover(l)}
                      onFocus={() => setHover(l)}
                      className="group/link block py-1.5"
                    >
                      <span className={`block text-base transition-colors duration-200 group-hover/link:text-white ${here ? 'text-white' : 'text-zinc-300'}`}>
                        {l.label}
                      </span>
                      {/* Links without a picture, and short lists, carry their note here; the others show it beside the picture. */}
                      {l.desc && (!l.model || col.links.length <= 4) && <span className="mt-0.5 block text-sm leading-snug text-zinc-500">{l.desc}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      {shown && (
        <Link href={shown.href} className={`card group/feature flex-col self-start p-7 ${columns.length >= 3 ? 'hidden xl:flex' : 'flex'}`} tabIndex={-1}>
          {shown.eyebrow && <span className="text-sm font-medium text-zinc-500">{shown.eyebrow}</span>}
          <span className="mt-2 text-lg font-semibold tracking-[-0.02em] text-white">{shown.title}</span>
          {shown.body && <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{shown.body}</span>}
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 group-hover/feature:text-brand-200">
            Learn more <span aria-hidden="true">→</span>
          </span>
        </Link>
      )}
    </div>
  )
}

// The site bar: full width, lined up with the page, see-through over the top of a page and frosted
// black once you scroll. Five menus open as full-width sheets. It tucks away once you have scrolled
// down a little and returns once you scroll up, and whenever keyboard focus moves into it.
export function Header({ menus }: { menus: Menu[] }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(pathname)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  // Moving straight from one menu to another swaps the sheets without replaying the opening.
  const [switching, setSwitching] = useState(false)
  const hiddenRef = useRef(false)
  const closeTimer = useRef(0)
  const skipFocusOpen = useRef(false)
  const headerRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const activeRef = useRef<number | null>(null)
  useEffect(() => {
    activeRef.current = active
  }, [active])

  if ((mobileOpen || active !== null) && openedAt !== pathname) {
    setMobileOpen(false)
    setActive(null)
    setOpenedAt(pathname)
  }

  const open = useCallback(
    (i: number) => {
      window.clearTimeout(closeTimer.current)
      setOpenedAt(pathname)
      setSwitching(activeRef.current !== null && activeRef.current !== i)
      setActive(i)
    },
    [pathname],
  )
  const close = useCallback((delay = 160) => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setSwitching(false)
      setActive(null)
    }, delay)
  }, [])

  // At most once per frame. Only a clear run in one direction changes the bar;
  // small back-and-forth movements, and scrolling done by script (see
  // scriptedScroll.ts), leave it as it is.
  useEffect(() => {
    const show = (on: boolean) => {
      if (hiddenRef.current === !on) return
      hiddenRef.current = !on
      setHidden(!on)
      if (!on) setActive(null)
    }
    let frame = 0
    let lastY = window.scrollY
    let runFrom = lastY
    let direction = 0
    let seenVersion = scriptedScroll.version
    const update = () => {
      frame = 0
      const root = document.documentElement
      // Clamped, so elastic overscroll at either end does not count as a turn.
      const y = Math.min(Math.max(window.scrollY, 0), Math.max(0, root.scrollHeight - window.innerHeight))
      setScrolled(y > 24)
      const delta = y - lastY
      lastY = y
      if (y < NEAR_TOP || scriptedScroll.active || seenVersion !== scriptedScroll.version) {
        if (y < NEAR_TOP) show(true)
        seenVersion = scriptedScroll.version
        runFrom = y
        direction = 0
        return
      }
      if (!delta) return
      const now = delta > 0 ? 1 : -1
      if (now !== direction) {
        direction = now
        runFrom = y - delta
      }
      if (Math.abs(y - runFrom) < TURN) return
      if (direction < 0) show(true)
      else if (!headerRef.current?.contains(document.activeElement)) show(false)
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Lets sticky elements (e.g. the product tab bar) move up while the header is away.
  useEffect(() => {
    document.documentElement.dataset.header = hidden && !mobileOpen ? 'hidden' : 'shown'
  }, [hidden, mobileOpen])

  // Mobile menu: lock the page behind it, make it inert for keyboards and screen
  // readers, move focus into the menu, and close it with Escape.
  useEffect(() => {
    if (!mobileOpen) return
    const root = document.documentElement
    const behind = [document.getElementById('main'), document.querySelector('body > footer')].filter(Boolean) as HTMLElement[]
    root.style.overflow = 'hidden'
    behind.forEach((el) => (el.inert = true))
    document.querySelector<HTMLElement>('#mobile-nav summary, #mobile-nav a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMobileOpen(false)
      document.querySelector<HTMLElement>('[aria-controls="mobile-nav"]')?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = ''
      behind.forEach((el) => (el.inert = false))
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setSwitching(false)
      setActive(null)
      // Return focus to the trigger without its focus handler reopening the panel.
      // If it already has focus no focus event fires, so the skip must not be armed.
      const trigger = listRef.current?.querySelectorAll<HTMLElement>('[data-trigger]')[active]
      if (trigger && document.activeElement !== trigger) {
        skipFocusOpen.current = true
        trigger.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const solid = scrolled || mobileOpen || active !== null
  const owner = menus.findIndex((m) => isActive(pathname, m.href))

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-[2px] transition-opacity duration-300 ${active !== null ? 'opacity-100' : 'opacity-0'}`}
      />
      <header
        ref={headerRef}
        data-switching={switching || undefined}
        onMouseLeave={() => close()}
        onFocus={() => {
          hiddenRef.current = false
          setHidden(false)
        }}
        onBlur={(e) => {
          if (!headerRef.current?.contains(e.relatedTarget as Node)) setActive(null)
        }}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out ${hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-ink-950">
          Skip to content
        </a>
        {/* The sheets are placed against this full-width bar, so nothing between it and them is positioned. */}
        <div
          className={`relative border-b text-white transition-[background-color,border-color] duration-500 ${
            solid ? 'border-white/[0.07] bg-ink-950/80 backdrop-blur-xl' : 'border-transparent bg-transparent'
          }`}
        >
          <div className="container-page grid h-16 grid-cols-[1fr_auto] items-center gap-6 lg:h-[4.5rem] lg:grid-cols-[1fr_auto_1fr]">
            <Link href="/" aria-label={`${site.name} home`} className="justify-self-start" onMouseEnter={() => close(120)}>
              <Logo />
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              {/* Each menu's sheet sits right after its trigger, so keyboard users tab from the trigger straight into its links. */}
              <ul ref={listRef} className="flex items-center">
                {menus.map((menu, i) => {
                  const current =
                    owner >= 0 ? owner === i : (menu.columns ?? []).some((c) => c.links.some((l) => !l.href.includes('#') && isActive(pathname, l.href)))
                  return (
                    <li key={menu.label} onMouseEnter={() => (menu.columns ? open(i) : close(80))}>
                      <Link
                        href={menu.href}
                        data-trigger
                        aria-expanded={menu.columns ? active === i : undefined}
                        aria-controls={menu.columns ? `menu-${i}` : undefined}
                        aria-current={pathname === menu.href ? 'page' : undefined}
                        onFocus={() => {
                          if (skipFocusOpen.current) skipFocusOpen.current = false
                          else if (menu.columns) open(i)
                          else setActive(null)
                        }}
                        className={`group/nav relative flex h-16 items-center px-4 text-sm whitespace-nowrap transition-colors duration-200 lg:h-[4.5rem] ${
                          current || active === i ? 'text-white' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        <Roll>{menu.label}</Roll>
                        {/* A small dot under the section you are in. */}
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-3.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand-500 transition-opacity duration-300 ${current ? 'opacity-100' : 'opacity-0'}`}
                        />
                      </Link>
                      {menu.columns && (
                        <div
                          id={`menu-${i}`}
                          data-open={active === i || undefined}
                          className="menu-sheet absolute inset-x-0 top-full border-b border-white/[0.07] bg-ink-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
                        >
                          <Sheet menu={menu} pathname={pathname} open={active === i} />
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex items-center justify-self-end gap-2" onMouseEnter={() => close(120)}>
              <Search onOpen={() => setActive(null)} />
              <Link href="/contact" className="btn-primary hidden py-2 whitespace-nowrap sm:inline-flex">
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
                <span aria-hidden="true" className="relative block h-3.5 w-5">
                  <span
                    className={`absolute inset-x-0 top-[3px] h-[1.8px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen ? 'translate-y-[3.1px] rotate-45' : ''}`}
                  />
                  <span
                    className={`absolute inset-x-0 bottom-[3px] h-[1.8px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen ? '-translate-y-[3.1px] -rotate-45' : ''}`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <nav
            id="mobile-nav"
            aria-label="Main"
            // Placed under the bar by height, not by "fixed": the header is transformed, so fixed children size against it.
            className="mobile-nav absolute inset-x-0 top-full flex h-[calc(100dvh-4rem)] flex-col overflow-y-auto bg-ink-950 lg:hidden"
          >
            <ul className="container-page w-full flex-1 divide-y divide-white/[0.06] pt-2 pb-6">
              {menus.map((menu, i) => (
                <li key={menu.label} className="mobile-nav-item" style={{ animationDelay: `${60 + i * 40}ms` }}>
                  {menu.columns ? (
                    <details className="group" open={isActive(pathname, menu.href) || undefined}>
                      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                        {menu.label}
                        <svg viewBox="0 0 12 12" className="h-4 w-4 opacity-60 transition-transform group-open:rotate-180" aria-hidden="true">
                          <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </summary>
                      <div className="space-y-6 pb-6">
                        {menu.columns.map((c) => (
                          <div key={c.title}>
                            {menu.columns!.length > 1 && <p className="pb-2 text-sm text-zinc-500">{c.title}</p>}
                            <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                              {c.links.map((l) => (
                                <li key={l.href}>
                                  <Link
                                    href={l.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block py-2 text-base ${isActive(pathname, l.href) && !l.href.includes('#') ? 'text-white' : 'text-zinc-300'}`}
                                  >
                                    {l.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link href={menu.href} className="block py-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                      {menu.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="sticky bottom-0 bg-gradient-to-t from-ink-950 from-70% to-transparent pt-8 pb-5">
              <div className="container-page">
                <Link href="/contact" className="btn-primary w-full py-3 text-base">
                  Contact us
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}

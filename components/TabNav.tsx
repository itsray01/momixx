'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'

/** `active`, when set, overrides matching the href against the current page (e.g. for a category). */
export type Tab = { href: string; label: string; active?: boolean }

/**
 * Sticky, horizontally scrollable tab bar. Each tab is a real page (good for
 * SEO and shareable links); this just shows where you are. It wraps the content
 * it belongs to, so it stops sticking before the closing call to action and the
 * footer, and it moves up when the site header slides away. Optional `primary`
 * tabs (such as categories) come first, before a divider.
 */
export function TabNav({ primary = [], tabs, label, children }: { primary?: Tab[]; tabs: Tab[]; label: string; children?: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  // A category can link to the page it is on, so the current page is looked up in `tabs` first.
  const current = tabs.find((t) => t.href === pathname) ?? primary.find((t) => t.href === pathname)
  const isActive = (t: Tab) => t.active ?? t === current
  const shown = tabs.find(isActive) ?? primary.find(isActive)
  const activePrimary = primary.find(isActive) ?? primary[0]

  const onCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    const href = event.currentTarget.value
    if (!href) return
    const samePage = new URL(href, window.location.href).pathname === pathname
    router.push(href)
    // A hash on this page does not change which category is active, so the picker stays put.
    if (samePage && activePrimary) event.currentTarget.value = activePrimary.href
  }
  const listRef = useRef<HTMLUListElement>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  const measure = useCallback(() => {
    const l = listRef.current
    if (!l) return
    setEdges({ left: l.scrollLeft > 4, right: l.scrollLeft + l.clientWidth < l.scrollWidth - 4 })
  }, [])

  // Scroll only as far as needed to show the active tab, so the start of the bar
  // (e.g. the category switch) stays in view; never scrolls the page vertically.
  useEffect(() => {
    const list = listRef.current
    const el = activeRef.current
    if (list && el) {
      const margin = 16
      const start = el.offsetLeft - margin
      const end = el.offsetLeft + el.offsetWidth + margin
      if (start < list.scrollLeft) list.scrollLeft = start
      else if (end > list.scrollLeft + list.clientWidth) list.scrollLeft = end - list.clientWidth
    }
    measure()
  }, [pathname, measure])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [measure])

  const nudge = (dir: 1 | -1) => {
    const l = listRef.current
    if (!l) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    l.scrollBy({ left: dir * l.clientWidth * 0.6, behavior: smooth ? 'smooth' : 'auto' })
  }

  const arrow = (dir: 1 | -1) => (
    <button
      type="button"
      onClick={() => nudge(dir)}
      aria-label={dir > 0 ? 'More tabs' : 'Previous tabs'}
      tabIndex={-1}
      className={`absolute inset-y-0 z-10 hidden w-10 items-center justify-center text-zinc-300 transition-opacity hover:text-white md:flex ${dir > 0 ? 'right-0' : 'left-0'} ${
        (dir > 0 ? edges.right : edges.left) ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <svg viewBox="0 0 12 12" className={`h-3.5 w-3.5 ${dir < 0 ? 'rotate-180' : ''}`} aria-hidden="true">
        <path d="M4.5 3l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  )

  const fade = `${edges.left ? 'transparent 0, black 3rem' : 'black 0'}, ${edges.right ? 'black calc(100% - 3rem), transparent 100%' : 'black 100%'}`

  const item = (t: Tab, key: string, collapse = false) => {
    const active = isActive(t)
    const here = t === current
    return (
      <li key={key} className={`${collapse ? 'hidden sm:flex' : 'flex'} shrink-0 items-center`}>
        <Link
          ref={t === shown ? activeRef : undefined}
          href={t.href}
          aria-current={here ? 'page' : active ? 'true' : undefined}
          className={`block rounded-full px-3.5 py-2 text-sm whitespace-nowrap transition-colors ${
            active && here ? 'bg-white text-ink-950' : active ? 'bg-white/[0.12] text-white' : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          {t.label}
        </Link>
      </li>
    )
  }

  return (
    <div className="relative">
      <nav aria-label={label} className="tabnav sticky z-40 -mt-7 mb-0 px-3 sm:px-4">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-full border border-white/10 bg-ink-950/90 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          {arrow(-1)}
          <ul
            ref={listRef}
            onScroll={measure}
            style={{ maskImage: `linear-gradient(to right, ${fade})`, WebkitMaskImage: `linear-gradient(to right, ${fade})` }}
            className="relative flex items-center gap-1 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {primary.length > 0 && activePrimary && (
              <li className="relative flex shrink-0 items-center sm:hidden">
                <select
                  aria-label="Product category"
                  value={activePrimary.href}
                  onChange={onCategory}
                  className="h-9 [field-sizing:content] appearance-none rounded-full border-0 bg-white/[0.12] py-0 pr-8 pl-3.5 text-sm leading-9 text-white"
                >
                  {primary.map((t) => (
                    <option key={t.href} value={t.href}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <svg viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-3 h-3 w-3 -tranzinc-y-1/2 text-white" aria-hidden="true">
                  <path d="M3.5 4.5l2.5 2.5 2.5-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </li>
            )}
            {primary.map((t) => item(t, `primary:${t.href}`, true))}
            {primary.length > 0 && tabs.length > 0 && <li aria-hidden="true" className="mx-1.5 h-5 w-px shrink-0 bg-white/15" />}
            {tabs.map((t) => item(t, `tab:${t.href}`))}
          </ul>
          {arrow(1)}
        </div>
      </nav>
      {children}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export type Tab = { href: string; label: string; group?: string }

/**
 * Sticky, horizontally scrollable tab bar. Each tab is a real page (good for
 * SEO and shareable links); this just shows where you are. It wraps the content
 * it belongs to, so it stops sticking before the closing call to action and the
 * footer, and it moves up when the site header slides away.
 */
export function TabNav({ tabs, label, children }: { tabs: Tab[]; label: string; children?: ReactNode }) {
  const pathname = usePathname()
  const listRef = useRef<HTMLUListElement>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  const measure = useCallback(() => {
    const l = listRef.current
    if (!l) return
    setEdges({ left: l.scrollLeft > 4, right: l.scrollLeft + l.clientWidth < l.scrollWidth - 4 })
  }, [])

  // Centre the active tab horizontally without scrolling the page vertically.
  useEffect(() => {
    const list = listRef.current
    const el = activeRef.current
    if (list && el) list.scrollLeft = el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2
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
      className={`absolute inset-y-0 z-10 hidden w-10 items-center justify-center text-slate-300 transition-opacity hover:text-white md:flex ${dir > 0 ? 'right-0' : 'left-0'} ${
        (dir > 0 ? edges.right : edges.left) ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <svg viewBox="0 0 12 12" className={`h-3.5 w-3.5 ${dir < 0 ? 'rotate-180' : ''}`} aria-hidden="true">
        <path d="M4.5 3l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  )

  const fade = `${edges.left ? 'transparent 0, black 3rem' : 'black 0'}, ${edges.right ? 'black calc(100% - 3rem), transparent 100%' : 'black 100%'}`

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
            {tabs.map((t, i) => {
              const active = pathname === t.href
              const showGroup = t.group && t.group !== tabs[i - 1]?.group
              return (
                <li key={t.href} className="flex shrink-0 items-center">
                  {showGroup && (
                    <span className="mr-1 ml-3 hidden text-[10px] font-medium tracking-[0.18em] text-slate-500 uppercase md:inline">{t.group}</span>
                  )}
                  <Link
                    ref={active ? activeRef : undefined}
                    href={t.href}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-full px-3.5 py-2 text-sm whitespace-nowrap transition-colors ${
                      active ? 'bg-white text-ink-950' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {t.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          {arrow(1)}
        </div>
      </nav>
      {children}
    </div>
  )
}

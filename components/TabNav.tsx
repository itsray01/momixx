'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export type Tab = { href: string; label: string; group?: string }

// Sticky, horizontally scrollable tab bar. Each tab is a real page (good for
// SEO and shareable links); this just shows where you are.
export function TabNav({ tabs, label }: { tabs: Tab[]; label: string }) {
  const pathname = usePathname()
  const listRef = useRef<HTMLUListElement>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)

  // Centre the active tab horizontally without scrolling the page vertically.
  useEffect(() => {
    const list = listRef.current
    const el = activeRef.current
    if (!list || !el) return
    list.scrollLeft = el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2
  }, [pathname])

  return (
    <nav aria-label={label} className="sticky top-16 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page">
        <ul ref={listRef} className="relative -mb-px flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t, i) => {
            const active = pathname === t.href
            const showGroup = t.group && t.group !== tabs[i - 1]?.group
            return (
              <li key={t.href} className="flex shrink-0 items-center">
                {showGroup && (
                  <span className="mr-1 ml-3 hidden text-[10px] font-bold tracking-widest text-slate-400 uppercase first:ml-0 md:inline">{t.group}</span>
                )}
                <Link
                  ref={active ? activeRef : undefined}
                  href={t.href}
                  aria-current={active ? 'page' : undefined}
                  className={`block border-b-2 px-3 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? 'border-brand-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

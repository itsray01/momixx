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
    <nav aria-label={label} className="sticky top-[84px] z-40 -mt-7 mb-0 px-3 sm:px-4">
      <div className="glass mx-auto max-w-6xl overflow-hidden rounded-full">
        <ul ref={listRef} className="relative flex items-center gap-1 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
      </div>
    </nav>
  )
}

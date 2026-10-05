'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { SearchEntry, SearchGroup } from '@/lib/searchIndex'

// Header search. The button opens a search panel over the header, with results
// grouped by section. The index (/search.json) is generated from the content
// files and only downloaded when someone is about to search.

let indexRequest: Promise<SearchEntry[]> | null = null
function loadIndex() {
  indexRequest ??= fetch('/search.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .catch((err) => {
      indexRequest = null
      throw err
    })
  return indexRequest
}

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Every word typed must match somewhere; a match in the title counts most. */
function score(e: SearchEntry, words: string[]) {
  const title = fold(e.title)
  const desc = fold(e.desc ?? '')
  const keywords = fold(e.keywords ?? '')
  let total = 0
  for (const w of words) {
    if (title.startsWith(w)) total += 8
    else if (new RegExp(`\\b${escapeRegExp(w)}`).test(title)) total += 6
    else if (title.includes(w)) total += 4
    else if (desc.includes(w)) total += 2
    else if (keywords.includes(w)) total += 1
    else return 0
  }
  return total
}

const groupLabels: Record<SearchGroup, string> = {
  Product: 'Products',
  Application: 'Applications',
  Article: 'Insights',
  Page: 'Company',
  Glossary: 'Glossary',
}
const groupOrder: SearchGroup[] = ['Product', 'Application', 'Article', 'Page', 'Glossary']
const perGroup = 4

type Section = { title: string; items: SearchEntry[] }

/** Results grouped by section, the most relevant section first. */
function search(entries: SearchEntry[], query: string): Section[] {
  const words = fold(query).split(/\s+/).filter(Boolean)
  const groups = new Map<SearchGroup, Array<{ e: SearchEntry; s: number }>>()
  for (const e of entries) {
    const s = score(e, words)
    if (s) groups.set(e.group, [...(groups.get(e.group) ?? []), { e, s }])
  }
  return [...groups]
    .map(([group, hits]) => ({ group, hits: hits.sort((a, b) => b.s - a.s) }))
    .sort((a, b) => b.hits[0].s - a.hits[0].s || groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group))
    .map(({ group, hits }) => ({ title: groupLabels[group], items: hits.slice(0, perGroup).map((h) => h.e) }))
}

// Shown before anything is typed.
const popular = ['/recycled-silicone', '/products/vertical-extruder', '/products/momixx-mm', '/products/momixx-high-density', '/insights/lsr-vs-hcr', '/sustainability']

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.6 12.6L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function Search({ onOpen }: { onOpen?: () => void }) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)

  const typed = query.trim()
  const sections = useMemo<Section[]>(() => {
    if (!index) return []
    if (!typed) return [{ title: 'Popular', items: popular.map((href) => index.find((e) => e.href === href)).filter((e): e is SearchEntry => !!e) }]
    return search(index, typed)
  }, [index, typed])
  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections])
  const offsets = sections.map((_, i) => sections.slice(0, i).reduce((n, s) => n + s.items.length, 0))

  const prefetch = () => {
    if (index) return
    loadIndex().then(
      (data) => {
        setIndex(data)
        setFailed(false)
      },
      () => setFailed(true),
    )
  }

  const openSearch = () => {
    prefetch()
    onOpen?.()
    const d = dialogRef.current
    if (d && !d.open) d.showModal()
    inputRef.current?.focus()
  }

  const closeSearch = () => dialogRef.current?.close()

  // Ctrl+K / ⌘K opens search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // openSearch only touches refs, the module-level index request and a stable callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the highlighted result in view while moving with the arrow keys.
  useEffect(() => {
    resultsRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  const go = (href: string) => {
    closeSearch()
    router.push(href)
  }

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!flat.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % flat.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => (i - 1 + flat.length) % flat.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(flat[Math.min(activeIdx, flat.length - 1)].href)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-label="Search"
        aria-haspopup="dialog"
        className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] text-zinc-300 transition-colors hover:text-white lg:w-auto lg:border-transparent lg:bg-transparent lg:px-3 lg:hover:bg-white/[0.06]"
      >
        <SearchIcon className="h-[18px] w-[18px]" />
        <span className="hidden text-sm xl:inline">Search</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search"
        onClose={() => {
          setQuery('')
          setActiveIdx(0)
        }}
        // A click on the dimmed page around the panel closes it.
        onClick={(e) => e.target === e.currentTarget && closeSearch()}
        className="mx-auto mt-3 mb-auto w-[calc(100%-1.5rem)] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-ink-950/95 p-0 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-[opacity,translate] duration-300 ease-out backdrop:bg-ink-950/60 backdrop:backdrop-blur-[2px] starting:-tranzinc-y-2 starting:opacity-0 sm:mt-4 sm:w-[calc(100%-2rem)]"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.08] py-2 pr-2 pl-5 sm:pl-6">
          <SearchIcon className="h-5 w-5 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIdx(0)
            }}
            onKeyDown={onInputKey}
            placeholder="Search products, applications and insights"
            aria-label="Search"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls="search-results"
            aria-activedescendant={flat.length ? `search-option-${activeIdx}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            className="h-12 min-w-0 flex-1 bg-transparent text-lg font-medium tracking-[-0.01em] text-white placeholder:font-normal placeholder:text-zinc-500 focus:outline-none sm:text-xl [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-zinc-300 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div ref={resultsRef} className="max-h-[min(62vh,34rem)] overflow-y-auto px-3 py-5 sm:px-4">
          {!index && !failed && <p className="px-3 text-sm text-zinc-500">Loading…</p>}
          {failed && (
            <p className="px-3 text-sm text-zinc-400">
              Search isn’t available right now.{' '}
              <button type="button" onClick={prefetch} className="text-brand-300 underline underline-offset-2">
                Try again
              </button>
            </p>
          )}
          {index && typed && !flat.length && (
            <div className="px-3">
              <p className="text-[15px] text-zinc-200">No results for “{typed}”.</p>
              <p className="mt-1 text-[13px] text-zinc-500">Try a product name, a material such as LSR, or a topic such as recycling.</p>
            </div>
          )}
          {flat.length > 0 && (
            <div id="search-results" role="listbox" aria-label="Search results" className={`grid gap-x-6 gap-y-6 ${typed ? 'lg:grid-cols-2' : ''}`}>
              {sections.map((s, si) => (
                <div key={s.title} role="group" aria-labelledby={`search-group-${si}`} className="min-w-0">
                  <p id={`search-group-${si}`} className="px-3 text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
                    {s.title}
                  </p>
                  <div className={`mt-2 grid grid-cols-1 gap-0.5 ${typed ? '' : 'sm:grid-cols-2'}`}>
                    {s.items.map((r, j) => {
                      const i = offsets[si] + j
                      const on = i === activeIdx
                      return (
                        <Link
                          key={r.href}
                          id={`search-option-${i}`}
                          data-idx={i}
                          href={r.href}
                          role="option"
                          aria-selected={on}
                          tabIndex={-1}
                          onClick={closeSearch}
                          onMouseMove={() => !on && setActiveIdx(i)}
                          className={`flex min-w-0 items-center justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors ${on ? 'bg-white/[0.06]' : ''}`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-[15px] font-medium text-zinc-100">{r.title}</span>
                            {r.desc && <span className="mt-0.5 line-clamp-1 text-[13px] text-zinc-500">{r.desc}</span>}
                          </span>
                          <span aria-hidden="true" className={`shrink-0 text-brand-300 transition-opacity ${on ? 'opacity-100' : 'opacity-0'}`}>
                            →
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="border-t border-white/[0.08] px-6 py-4 text-[13px] text-zinc-400">
          Can’t find what you need?{' '}
          <Link href="/contact" onClick={closeSearch} className="font-medium text-brand-300 hover:text-brand-200">
            Contact our team <span aria-hidden="true">→</span>
          </Link>
        </p>
      </dialog>
    </>
  )
}

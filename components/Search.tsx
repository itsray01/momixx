'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { SearchEntry } from '@/lib/searchIndex'

// Header search: a button that opens a quick-jump box over every product,
// application, article, glossary term and page. The index (/search.json) is
// only downloaded when someone is about to use it.

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

/** Every word typed must match; a match in the title counts most. */
function rank(entries: SearchEntry[], query: string) {
  const words = fold(query).split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const scored: Array<{ e: SearchEntry; score: number }> = []
  for (const e of entries) {
    const title = fold(e.title)
    const desc = fold(e.desc ?? '')
    const keywords = fold(e.keywords ?? '')
    let score = 0
    for (const w of words) {
      if (title.startsWith(w)) score += 8
      else if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(title)) score += 6
      else if (title.includes(w)) score += 4
      else if (desc.includes(w)) score += 2
      else if (keywords.includes(w)) score += 1
      else {
        score = 0
        break
      }
    }
    if (score) scored.push({ e, score })
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 12).map((s) => s.e)
}

// The shortcut hint depends on the visitor's OS, so it is left out of the server render.
const noSubscribe = () => () => {}
const shortcutHint = () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K')

// Shown before anything is typed.
const suggested = ['/products', '/recycled-silicone', '/products/vertical-extruder', '/silicone', '/sustainability', '/contact']

export function Search({ onOpen }: { onOpen?: () => void }) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const shortcut = useSyncExternalStore(noSubscribe, shortcutHint, () => null)

  const results = useMemo(() => {
    if (!index) return []
    if (!query.trim()) return suggested.map((href) => index.find((e) => e.href === href)).filter((e): e is SearchEntry => !!e)
    return rank(index, query)
  }, [index, query])

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

  // ⌘K / Ctrl+K anywhere, or "/" when not typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        openSearch()
      } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
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
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  const go = (href: string) => {
    closeSearch()
    router.push(href)
  }

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[Math.min(activeIdx, results.length - 1)].href)
    }
  }

  const empty = !!index && !!query.trim() && !results.length

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-label="Search the site"
        aria-keyshortcuts="Meta+K Control+K /"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 text-sm text-slate-300 transition-colors hover:border-white/30 hover:text-white xl:pr-2 xl:pl-3.5"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12.6 12.6L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="hidden xl:inline">Search</span>
        {shortcut && <kbd className="hidden rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 font-sans text-[11px] text-slate-400 xl:inline">{shortcut}</kbd>}
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search the site"
        onClose={() => {
          setQuery('')
          setActiveIdx(0)
        }}
        // A click on the dimmed area around the box closes it.
        onClick={(e) => e.target === e.currentTarget && closeSearch()}
        className="m-auto mt-[12vh] w-[min(40rem,calc(100%-2rem))] max-w-none overflow-hidden rounded-3xl border border-white/10 bg-ink-950/95 p-0 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop:bg-ink-950/60 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-5">
          <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12.6 12.6L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIdx(0)
            }}
            onKeyDown={onInputKey}
            placeholder="Search products, applications, articles…"
            aria-label="Search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results.length ? `search-result-${activeIdx}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="button" onClick={closeSearch} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400 hover:text-white">
            Esc
          </button>
        </div>

        <div className="max-h-[min(60vh,28rem)] overflow-y-auto p-2">
          {!index && !failed && <p className="px-3 py-6 text-sm text-slate-500">Loading…</p>}
          {failed && (
            <p className="px-3 py-6 text-sm text-slate-400">
              Search isn’t available right now.{' '}
              <button type="button" onClick={prefetch} className="text-brand-300 underline underline-offset-2">
                Try again
              </button>
            </p>
          )}
          {index && !query.trim() && <p className="px-3 pt-2 pb-1 text-[11px] font-medium tracking-[0.16em] text-slate-500 uppercase">Suggested</p>}
          {results.length > 0 && (
            <ul id="search-results" ref={listRef} role="listbox" aria-label="Results">
              {results.map((r, i) => (
                <li key={r.href} role="presentation">
                  <Link
                    id={`search-result-${i}`}
                    data-idx={i}
                    href={r.href}
                    role="option"
                    aria-selected={i === activeIdx}
                    tabIndex={-1}
                    onClick={closeSearch}
                    onMouseMove={() => i !== activeIdx && setActiveIdx(i)}
                    className={`flex items-start justify-between gap-4 rounded-xl px-3 py-2.5 ${i === activeIdx ? 'bg-white/[0.07]' : ''}`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-white">{r.title}</span>
                      {r.desc && <span className="mt-0.5 line-clamp-1 text-xs text-slate-400">{r.desc}</span>}
                    </span>
                    <span className="mt-0.5 shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] tracking-wide text-slate-400">{r.group}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {empty && (
            <p className="px-3 py-6 text-sm text-slate-400">
              Nothing found for “{query.trim()}”. Try “recycled”, “cable” or “LSR”, or{' '}
              <Link href="/contact" onClick={closeSearch} className="text-brand-300 underline underline-offset-2">
                ask our team
              </Link>
              .
            </p>
          )}
        </div>
      </dialog>
    </>
  )
}

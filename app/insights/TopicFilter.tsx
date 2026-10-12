'use client'

import Link from 'next/link'
import { useSyncExternalStore, type ReactNode } from 'react'

// The topic buttons (in the header) and the article list (below it) share one
// filter, kept in the address as ?topic=, so a filtered view can be linked to.

const listeners = new Set<() => void>()
let chosen: string | null | undefined

function read(): string | null {
  if (chosen === undefined) chosen = new URLSearchParams(window.location.search).get('topic')
  return chosen
}

function subscribe(listener: () => void) {
  // Coming back to the page (e.g. from an article's "More in" link), the address decides again.
  if (!listeners.size) chosen = new URLSearchParams(window.location.search).get('topic')
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function choose(topic: string | null) {
  chosen = topic
  const url = new URL(window.location.href)
  if (topic) url.searchParams.set('topic', topic)
  else url.searchParams.delete('topic')
  window.history.replaceState(window.history.state, '', url)
  listeners.forEach((l) => l())
}

/** The chosen topic, if it is one of `ids`; on the server and while hydrating, none. */
function useTopic(ids: string[]): string | null {
  const t = useSyncExternalStore(subscribe, read, () => null)
  return t && ids.includes(t) ? t : null
}

const pill = 'rounded-full px-4 py-2 text-sm transition-[color,background-color,border-color,scale] duration-200 ease-soft motion-safe:active:scale-[0.97]'
const on = 'bg-white text-ink-950'
const off = 'border border-white/10 text-zinc-300 hover:border-white/30 hover:text-white'

export function TopicButtons({ topics }: { topics: Array<{ id: string; label: string }> }) {
  const active = useTopic(topics.map((t) => t.id))
  return (
    <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={!active} onClick={() => choose(null)} className={`${pill} ${!active ? on : off}`}>
        All
      </button>
      {topics.map((t) => (
        <button key={t.id} type="button" aria-pressed={active === t.id} onClick={() => choose(t.id)} className={`${pill} ${active === t.id ? on : off}`}>
          {t.label}
        </button>
      ))}
      <Link href="/insights/glossary" className={`${pill} ${off}`}>
        Glossary
      </Link>
    </div>
  )
}

/** The newest matching article large, the rest in a grid. Cards are rendered on the server and passed in. */
export function FilteredArticles({ items }: { items: Array<{ slug: string; topic: string; card: ReactNode; large: ReactNode }> }) {
  const active = useTopic([...new Set(items.map((i) => i.topic))])
  const shown = active ? items.filter((i) => i.topic === active) : items
  const [first, ...rest] = shown
  return (
    <div>
      {first && (
        <div key={`${active}:${first.slug}`} className="mb-5">
          {first.large}
        </div>
      )}
      {rest.length > 0 && (
        <ul className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <li key={a.slug} className="flex">
              {a.card}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import Link from 'next/link'
import { getArticles, topics, type Topic } from '@/lib/articles'

export function TopicNav({ active }: { active?: Topic }) {
  return (
    <nav aria-label="Topics" className="flex flex-wrap gap-2">
      <Link href="/insights" className={`rounded-full px-4 py-2 text-sm transition-colors ${!active ? 'bg-white text-ink-950' : 'border border-white/10 text-zinc-300 hover:border-white/30 hover:text-white'}`}>
        All
      </Link>
      {/* Only topics that have articles get a page. */}
      {(Object.keys(topics) as Topic[])
        .filter((t) => getArticles().some((a) => a.topic === t))
        .map((t) => (
        <Link
          key={t}
          href={`/insights/topic/${t}`}
          aria-current={active === t ? 'page' : undefined}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${active === t ? 'bg-white text-ink-950' : 'border border-white/10 text-zinc-300 hover:border-white/30 hover:text-white'}`}
        >
          {topics[t].label}
        </Link>
      ))}
      <Link href="/insights/glossary" className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/30 hover:text-white">
        Glossary
      </Link>
    </nav>
  )
}

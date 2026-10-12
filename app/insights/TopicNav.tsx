import Link from 'next/link'
import { getArticles, topics, type Topic } from '@/lib/articles'

/** Topic links for pages other than /insights, where the same topics are filter buttons (TopicFilter.tsx). */
export function TopicNav({ glossary = false }: { glossary?: boolean }) {
  const pill = 'rounded-full px-4 py-2 text-sm transition-[color,background-color,border-color,scale] duration-200 ease-soft motion-safe:active:scale-[0.97]'
  const off = 'border border-white/10 text-zinc-300 hover:border-white/30 hover:text-white'
  return (
    <nav aria-label="Topics" className="flex flex-wrap gap-2">
      <Link href="/insights" className={`${pill} ${off}`}>
        All
      </Link>
      {usedTopics().map((t) => (
        <Link key={t} href={`/insights?topic=${t}`} className={`${pill} ${off}`}>
          {topics[t].label}
        </Link>
      ))}
      <Link href="/insights/glossary" aria-current={glossary ? 'page' : undefined} className={`${pill} ${glossary ? 'bg-white text-ink-950' : off}`}>
        Glossary
      </Link>
    </nav>
  )
}

/** Topics that have at least one article. */
export function usedTopics(): Topic[] {
  return (Object.keys(topics) as Topic[]).filter((t) => getArticles().some((a) => a.topic === t))
}

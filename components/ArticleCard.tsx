import Link from 'next/link'
import { topics, type Article } from '@/lib/articles'
import { Arrow } from './ui'

/** Card for an Insights article: topic, title and summary. */
export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <Link href={`/insights/${article.slug}`} data-tilt className={`group card lift flex h-full flex-col ${large ? 'p-8 sm:p-12' : 'p-7'}`}>
      <p className="text-xs font-medium text-brand-300">{topics[article.topic].label}</p>
      <h3 className={`mt-4 font-semibold tracking-[-0.03em] ${large ? 'max-w-3xl text-3xl sm:text-4xl' : 'text-xl'}`}>{article.title}</h3>
      <p className={`mt-3 flex-1 text-slate-400 ${large ? 'max-w-2xl text-lg' : ''}`}>{article.description}</p>
      <div className="mt-8 flex items-center border-t border-white/[0.06] pt-5 text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium text-white">
          Read <Arrow />
        </span>
      </div>
    </Link>
  )
}

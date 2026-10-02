import Link from 'next/link'
import { formatDate, topics, type Article } from '@/lib/articles'
import { Render } from './Render'
import { Arrow } from './ui'

/** Card for an Insights article: 3D render, topic, title, summary, date. */
export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <Link href={`/insights/${article.slug}`} data-tilt className={`group card lift flex h-full overflow-hidden ${large ? 'flex-col lg:flex-row' : 'flex-col'}`}>
      <div className={`relative flex items-center justify-center px-8 pt-6 ${large ? 'lg:w-1/2 lg:p-10' : ''}`}>
        <div aria-hidden="true" className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(55% 60% at 50% 55%, rgb(20 159 148 / 0.22), transparent)' }} />
        <Render name={article.model} className={`relative w-auto transition-transform duration-700 group-hover:scale-[1.05] ${large ? 'max-h-80' : 'max-h-44'}`} />
      </div>
      <div className={`flex flex-1 flex-col p-7 ${large ? 'lg:justify-center lg:p-12' : 'pt-3'}`}>
        <p className="text-xs font-medium text-brand-300">
          {topics[article.topic].label} · {article.readingMinutes} min read
        </p>
        <h3 className={`mt-3 font-semibold tracking-[-0.03em] ${large ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>{article.title}</h3>
        <p className={`mt-3 flex-1 text-slate-400 ${large ? 'text-lg' : ''}`}>{article.description}</p>
        <div className="mt-6 flex items-center justify-between text-sm">
          <time dateTime={article.updated ?? article.date} className="text-slate-500">
            {formatDate(article.updated ?? article.date)}
          </time>
          <span className="inline-flex items-center gap-1.5 font-medium text-white">
            Read <Arrow />
          </span>
        </div>
      </div>
    </Link>
  )
}

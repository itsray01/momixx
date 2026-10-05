import Link from 'next/link'
import { topics, type Article } from '@/lib/articles'
import { Render } from './Render'
import { Arrow } from './ui'

/** Card for an Insights article: topic, title and summary, optionally with the article's render. */
export function ArticleCard({ article, large = false, showRender = false }: { article: Article; large?: boolean; showRender?: boolean }) {
  const text = (
    <>
      <p className="text-xs font-medium text-zinc-400">{topics[article.topic].label}</p>
      <h3 className={`mt-4 font-semibold tracking-[-0.03em] ${large ? 'max-w-3xl text-3xl sm:text-4xl' : 'text-xl'}`}>{article.title}</h3>
      <p className={`mt-3 flex-1 text-zinc-400 ${large ? 'max-w-2xl text-lg' : ''}`}>{article.description}</p>
      <div className="mt-8 flex items-center border-t border-white/[0.06] pt-5 text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium text-white">
          Read <Arrow />
        </span>
      </div>
    </>
  )
  if (!showRender) {
    return (
      <Link href={`/insights/${article.slug}`} className={`group card lift flex h-full w-full flex-col ${large ? 'p-8 sm:p-12' : 'p-7'}`}>
        {text}
      </Link>
    )
  }
  if (large) {
    return (
      <Link href={`/insights/${article.slug}`} className="group card lift grid h-full w-full overflow-hidden md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-center">
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden md:order-last [&_img]:absolute [&_img]:inset-0 [&_img]:h-full [&_img]:w-full [&_img]:object-contain">
          <Render name={article.model} sizes="(min-width: 1280px) 500px, (min-width: 768px) 42vw, 92vw" priority className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        </div>
        <div className="flex h-full flex-col p-8 pt-2 sm:p-12 md:pt-12">{text}</div>
      </Link>
    )
  }
  return (
    <Link href={`/insights/${article.slug}`} className="group card lift flex h-full w-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden [&_img]:absolute [&_img]:inset-0 [&_img]:h-full [&_img]:w-full [&_img]:object-contain">
        <Render name={article.model} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col px-7 pb-7">{text}</div>
    </Link>
  )
}

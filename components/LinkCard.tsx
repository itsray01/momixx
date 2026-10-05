import Link from 'next/link'
import type { ReactNode } from 'react'
import { Render } from './Render'
import type { ModelName } from './three/modelNames'
import { Arrow } from './ui'

/** A linked, text-led card: kicker, title, summary and a footer line, with an optional render on top. */
export function LinkCard({
  href,
  kicker,
  title,
  body,
  footer,
  render,
}: {
  href: string
  kicker?: string
  title: string
  body?: string
  footer?: ReactNode
  render?: ModelName
}) {
  const text = (
    <>
      {kicker && <span className="text-xs font-medium text-zinc-400">{kicker}</span>}
      <h3 className={`text-xl font-semibold tracking-[-0.03em] ${kicker ? 'mt-3' : ''}`}>{title}</h3>
      {body && <p className="mt-3 flex-1 text-zinc-400">{body}</p>}
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-5 text-sm">
        <span className="text-zinc-400">{footer}</span>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-white">
          Learn more <Arrow />
        </span>
      </div>
    </>
  )
  if (!render) {
    return (
      <Link href={href} className="group card lift flex h-full flex-col p-7">
        {text}
      </Link>
    )
  }
  return (
    <Link href={href} className="group card lift flex h-full flex-col overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <Render name={render} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col px-7 pb-7">{text}</div>
    </Link>
  )
}

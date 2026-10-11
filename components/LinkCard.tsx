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
  note,
  render,
  wide = false,
}: {
  href: string
  kicker?: string
  title: string
  body?: string
  footer?: ReactNode
  /** A short fact under the summary, in small grey type. */
  note?: string
  render?: ModelName
  /** The only card in its row: picture on the left, words on the right, on wide screens. */
  wide?: boolean
}) {
  const text = (
    <>
      {kicker && <span className="text-xs font-medium text-zinc-400">{kicker}</span>}
      <h3 className={`text-xl font-semibold tracking-[-0.03em] ${kicker ? 'mt-3' : ''}`}>{title}</h3>
      {body && <p className={`mt-3 text-zinc-400 ${note ? '' : 'flex-1'}`}>{body}</p>}
      {note && <p className="mt-4 flex-1 text-xs leading-relaxed text-zinc-500">{note}</p>}
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
  if (wide) {
    return (
      <Link href={href} className="group card lift grid h-full overflow-hidden md:grid-cols-2 md:items-center">
        <div className="aspect-[4/3] overflow-hidden">
          <Render name={render} sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 90vw" className="motion-media" />
        </div>
        <div className="flex h-full flex-col px-7 pb-7 md:py-10 md:pr-10 md:pl-2">{text}</div>
      </Link>
    )
  }
  // When the grid stretches a card across two columns on tablets (an odd one out), it lays out like
  // a wide card there: picture beside the words rather than a picture twice the size.
  return (
    <Link href={href} className="group card lift flex h-full flex-col overflow-hidden [li[class*='col-span-2']_&]:sm:max-lg:grid [li[class*='col-span-2']_&]:sm:max-lg:grid-cols-2 [li[class*='col-span-2']_&]:sm:max-lg:items-center">
      <div className="aspect-[4/3] overflow-hidden">
        <Render name={render} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="motion-media" />
      </div>
      <div className="flex flex-1 flex-col px-7 pb-7 [li[class*='col-span-2']_&]:sm:max-lg:py-8 [li[class*='col-span-2']_&]:sm:max-lg:pl-2">{text}</div>
    </Link>
  )
}

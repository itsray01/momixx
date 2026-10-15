import Link from 'next/link'
import type { ReactNode } from 'react'
import { Arrow } from './ui'

/** A linked, text-only card: kicker, title, summary and a footer line. */
export function LinkCard({
  href,
  kicker,
  title,
  body,
  footer,
  note,
  wide = false,
}: {
  href: string
  kicker?: string
  title: string
  body?: string
  footer?: ReactNode
  /** A short fact under the summary, in small grey type. */
  note?: string
  /** The only card in its row: a little more room inside. */
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
  return (
    <Link href={href} className={`group card lift flex h-full flex-col p-7 ${wide ? 'md:p-10' : ''}`}>
      {text}
    </Link>
  )
}

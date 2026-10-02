import Link from 'next/link'
import type { ReactNode } from 'react'
import { Render } from './Render'
import type { ModelName } from './three/modelNames'
import { Arrow } from './ui'

/** A linked card led by a 3D render on a soft teal light. */
export function RenderCard({
  href,
  model,
  kicker,
  title,
  body,
  footer,
}: {
  href: string
  model: ModelName
  kicker?: string
  title: string
  body?: string
  footer?: ReactNode
}) {
  return (
    <Link href={href} data-tilt className="group card lift flex h-full flex-col overflow-hidden">
      <div className="relative px-8 pt-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(55% 60% at 50% 55%, rgb(20 159 148 / 0.22), transparent)' }}
        />
        <Render name={model} className="relative mx-auto max-h-48 w-auto transition-transform duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="flex flex-1 flex-col p-7 pt-3">
        {kicker && <span className="text-xs font-medium text-brand-300">{kicker}</span>}
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{title}</h3>
        {body && <p className="mt-2 flex-1 text-slate-400">{body}</p>}
        <div className="mt-6 flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-400">{footer}</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-white">
            Learn more <Arrow />
          </span>
        </div>
      </div>
    </Link>
  )
}

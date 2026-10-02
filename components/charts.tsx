import type { Comparison } from '@/content/products'
import { formatUsd, type Market } from '@/content/markets'

// Emphasis palette (validated): Momixx in brand-600, comparison material in
// slate-400. Every bar carries a direct value label, so the gray's lower
// contrast is always relieved by text.
const ACCENT = 'var(--color-brand-600)'
const MUTED = 'var(--color-slate-400)'

function advantage(row: Comparison['rows'][number], other: string) {
  // Ratios of Celsius temperatures are meaningless, so show the difference.
  if (row.unit === '°C') return `${Math.abs(row.momixx - row.other)} °C ${row.better === 'higher' ? 'higher' : 'lower'} than ${other}`
  if (row.better === 'lower') return `${Math.round((1 - row.momixx / row.other) * 100)}% lower than ${other}`
  return `${(row.momixx / row.other).toFixed(1).replace(/\.0$/, '')}× the ${other} result`
}

/** Small multiples: one mini bar pair per metric, each on its own scale. */
export function CompareBars({ comparison }: { comparison: Comparison }) {
  return (
    <figure className="card lift p-6 sm:p-8">
      <figcaption className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold">{comparison.title}</h3>
        <ul className="flex gap-5 text-sm text-slate-600" aria-label="Legend">
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: ACCENT }} /> Momixx
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: MUTED }} /> {comparison.otherLabel}
          </li>
        </ul>
      </figcaption>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {comparison.rows.map((row) => {
          const max = Math.max(row.momixx, row.other)
          const winner = row.better === 'higher' ? row.momixx >= row.other : row.momixx <= row.other
          return (
            <div key={row.metric}>
              <p className="text-sm font-semibold text-slate-900">
                {row.metric} <span className="font-normal text-slate-500">({row.unit})</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{row.better === 'higher' ? 'Higher is better' : 'Lower is better'}</p>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Momixx', v: row.momixx, t: row.momixxText, c: ACCENT },
                  { label: comparison.otherLabel, v: row.other, t: row.otherText, c: MUTED },
                ].map((b) => {
                  const text = b.t ?? b.v.toLocaleString('en')
                  return (
                    <div key={b.label} className="flex items-center gap-2" title={`${b.label}: ${text} ${row.unit}`}>
                      <div
                        data-grow
                        className="h-6 shrink-0 rounded-r-[4px]"
                        style={{ width: `${(b.v / max) * 75}%`, background: b.c }}
                        role="img"
                        aria-label={`${b.label}: ${text} ${row.unit}`}
                      />
                      <span className="text-sm font-semibold whitespace-nowrap text-slate-900 tabular-nums">{text}</span>
                    </div>
                  )
                })}
              </div>
              {winner && <p className="mt-2 text-xs font-medium text-brand-700">{advantage(row, comparison.otherLabel)}</p>}
            </div>
          )
        })}
      </div>
      {comparison.note && <p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-500">{comparison.note}</p>}
      <p className="mt-2 text-xs text-slate-400">Source: Momixx internal testing.</p>
    </figure>
  )
}

/** One market: current vs forecast columns on a shared scale, plus CAGR. */
export function MarketCard({ market, compact = false }: { market: Market; compact?: boolean }) {
  const max = market.forecast.usdBn
  return (
    <article data-tilt className="card lift flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold">{market.name}</h3>
        {market.kind === 'context' && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">Industry context</span>
        )}
      </div>
      {!compact && <p className="mt-1 text-sm text-slate-500">{market.scope}</p>}

      <div className="mt-6 flex items-end gap-6">
        {market.current && (
          <div className="flex h-28 items-end gap-3" aria-hidden="true">
            <div className="flex flex-col items-center gap-1.5">
              <div data-grow-y className="w-10 rounded-t-[4px] bg-brand-200" style={{ height: `${Math.max((market.current.usdBn / max) * 100, 4)}px` }} />
              <span className="text-xs text-slate-500 tabular-nums">{market.current.year}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div data-grow-y className="w-10 rounded-t-[4px] bg-brand-600" style={{ height: '100px' }} />
              <span className="text-xs text-slate-500 tabular-nums">{market.forecast.year}</span>
            </div>
          </div>
        )}
        <dl className="min-w-0 space-y-2">
          <div>
            <dt className="text-xs text-slate-500">Forecast {market.forecast.year}</dt>
            <dd className="font-display text-3xl font-extrabold tracking-tight text-slate-900">{formatUsd(market.forecast.usdBn)}</dd>
          </div>
          {market.current && (
            <div>
              <dt className="text-xs text-slate-500">{market.current.year}</dt>
              <dd className="text-sm font-semibold text-slate-700">{formatUsd(market.current.usdBn)}</dd>
            </div>
          )}
        </dl>
      </div>

      {market.cagr && (
        <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-800">
          {market.cagr.pct}% a year <span className="font-normal text-brand-700">CAGR {market.cagr.period}</span>
        </p>
      )}
      {market.note && !compact && <p className="mt-4 text-sm leading-relaxed text-slate-600">{market.note}</p>}
      <p className="mt-auto pt-5 text-xs text-slate-400">
        Source:{' '}
        <a href={market.source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-600">
          {market.source.publisher}
        </a>
        , {market.source.date}
      </p>
    </article>
  )
}

/** Comparable view across markets: expected annual growth (CAGR). */
export function GrowthChart({ markets }: { markets: Market[] }) {
  const rows = markets.filter((m) => m.cagr).sort((a, b) => b.cagr!.pct - a.cagr!.pct)
  const max = Math.ceil(Math.max(...rows.map((r) => r.cagr!.pct)) / 2) * 2
  return (
    <figure className="card p-6 sm:p-8">
      <figcaption>
        <h3 className="text-lg font-bold">Expected annual growth by market</h3>
        <p className="mt-1 text-sm text-slate-500">Compound annual growth rate (CAGR) forecast by each publisher. Growth rates are comparable even where market sizes are measured differently.</p>
      </figcaption>
      <div className="mt-8 space-y-4">
        {rows.map((m) => (
          <div key={m.id} className="group grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-4 sm:grid-cols-[14rem_1fr]">
            <span className="text-sm font-medium text-slate-700">{m.name}</span>
            <div className="relative flex items-center gap-3">
              <div className="h-6 flex-1">
                <div
                  data-grow
                  className="h-full rounded-r-[4px] bg-brand-600 transition-colors group-hover:bg-brand-700"
                  style={{ width: `${(m.cagr!.pct / max) * 100}%` }}
                  title={`${m.name}: ${m.cagr!.pct}% a year, ${m.cagr!.period} (${m.source.publisher})`}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-sm font-semibold text-slate-900 tabular-nums">{m.cagr!.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}

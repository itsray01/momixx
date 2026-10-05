import type { Comparison } from '@/content/products'
import { formatUsd, type Market } from '@/content/markets'

// Emphasis palette for the dark surface (#101012): MoMixx in near-white
// #e4e4e7 against comparison grey #71717a. Both clear 3:1 against the
// surface and differ by lightness alone, so they stay distinct in greyscale
// and for colour-blind readers. Every bar also carries a direct value label.
const ACCENT = '#e4e4e7'
const MUTED = '#71717a'

function advantage(row: Comparison['rows'][number], label: string) {
  // Lower-case a leading ordinary word ("Standard TPE" → "standard TPE"), but keep acronyms like XLPO.
  const other = /^[A-Z][a-z]/.test(label) ? label[0].toLowerCase() + label.slice(1) : label
  // Ratios of Celsius temperatures are meaningless, so show the difference.
  if (row.unit === '°C') return `${Math.abs(row.momixx - row.other)} °C ${row.better === 'higher' ? 'higher' : 'lower'} than ${other}`
  if (row.better === 'lower') return `${Math.round((1 - row.momixx / row.other) * 100)}% lower than ${other}`
  return `${(row.momixx / row.other).toFixed(1).replace(/\.0$/, '')}× the ${other} result`
}

/** Small multiples: one mini bar pair per metric, each on its own scale. */
export function CompareBars({ comparison }: { comparison: Comparison }) {
  return (
    <figure className="card p-6 sm:p-10">
      <figcaption className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold tracking-[-0.02em]">{comparison.title}</h3>
        <ul className="flex gap-5 text-sm text-zinc-400" aria-label="Legend">
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: ACCENT }} /> MoMixx
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: MUTED }} /> {comparison.otherLabel}
          </li>
        </ul>
      </figcaption>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {comparison.rows.map((row) => {
          const max = Math.max(row.momixx, row.other)
          const winner = row.better === 'higher' ? row.momixx >= row.other : row.momixx <= row.other
          return (
            <div key={row.metric}>
              <p className="text-sm font-medium text-white">
                {row.metric} <span className="font-normal text-zinc-500">({row.unit})</span>
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{row.better === 'higher' ? 'Higher is better' : 'Lower is better'}</p>
              <div className="mt-4 space-y-2.5">
                {[
                  { label: 'MoMixx', v: row.momixx, t: row.momixxText, c: ACCENT },
                  { label: comparison.otherLabel, v: row.other, t: row.otherText, c: MUTED },
                ].map((b) => {
                  const text = b.t ?? b.v.toLocaleString('en')
                  return (
                    <div key={b.label} className="flex items-center gap-3" title={`${b.label}: ${text} ${row.unit}`}>
                      <div
                        data-grow
                        className="h-7 shrink-0 rounded-r-[4px]"
                        style={{ width: `${(b.v / max) * 75}%`, background: b.c }}
                        role="img"
                        aria-label={`${b.label}: ${text} ${row.unit}`}
                      />
                      <span className="text-sm font-medium whitespace-nowrap text-white tabular-nums">{text}</span>
                    </div>
                  )
                })}
              </div>
              {winner && <p className="mt-3 text-xs font-medium text-brand-300">{row.advantageText ?? advantage(row, comparison.otherLabel)}</p>}
            </div>
          )
        })}
      </div>
      {comparison.note && <p className="mt-10 border-t border-white/[0.06] pt-5 text-xs text-zinc-500">{comparison.note}</p>}
      <p className="mt-2 text-xs text-zinc-500">Source: MoMixx internal testing.</p>
    </figure>
  )
}

/** One market: current vs forecast columns on a shared scale, plus CAGR. */
export function MarketCard({ market, compact = false }: { market: Market; compact?: boolean }) {
  const max = market.forecast.usdBn
  return (
    <article className="card lift flex h-full flex-col p-7">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-[-0.02em]">{market.name}</h3>
        {market.kind === 'context' && (
          <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-zinc-400">Industry context</span>
        )}
      </div>
      {!compact && <p className="mt-1.5 text-sm text-zinc-500">{market.scope}</p>}

      <div className="mt-8 flex items-end gap-6">
        {market.current && (
          <div className="flex h-28 items-end gap-3" aria-hidden="true">
            <div className="flex flex-col items-center gap-2">
              <div data-grow-y className="w-9 rounded-t-[4px] bg-white/25" style={{ height: `${Math.max((market.current.usdBn / max) * 100, 4)}px` }} />
              <span className="text-xs text-zinc-500 tabular-nums">{market.current.year}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div data-grow-y className="w-9 rounded-t-[4px]" style={{ height: '100px', background: `linear-gradient(180deg, #ffffff, ${ACCENT})` }} />
              <span className="text-xs text-zinc-500 tabular-nums">{market.forecast.year}</span>
            </div>
          </div>
        )}
        <dl className="min-w-0 space-y-2">
          <div>
            <dt className="text-xs text-zinc-500">Forecast {market.forecast.year}</dt>
            <dd className="font-display text-4xl font-semibold tracking-[-0.04em] text-white">{formatUsd(market.forecast.usdBn)}</dd>
          </div>
          {market.current && (
            <div>
              <dt className="text-xs text-zinc-500">{market.current.year}</dt>
              <dd className="text-sm font-medium text-zinc-300">{formatUsd(market.current.usdBn)}</dd>
            </div>
          )}
        </dl>
      </div>

      {market.cagr && (
        <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1 text-sm font-medium text-brand-200">
          {market.cagr.pct}% growth a year <span className="font-normal text-brand-300/80">{market.cagr.period}</span>
        </p>
      )}
      {market.note && (!compact || !market.current) && <p className="mt-5 text-sm leading-relaxed text-zinc-400">{market.note}</p>}
      <p className="mt-auto pt-6 text-xs text-zinc-500">
        Source:{' '}
        <a href={market.source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-zinc-300">
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
    <figure className="card p-6 sm:p-10">
      <figcaption>
        <h3 className="text-xl font-semibold tracking-[-0.02em]">Expected annual growth by market</h3>
        <p className="mt-1.5 text-sm text-zinc-500">Average growth a year, as forecast by each publisher. Publishers use different market definitions and forecast periods, so compare growth rates with care.</p>
      </figcaption>
      <div className="mt-10 space-y-5">
        {rows.map((m) => (
          <div key={m.id} className="group grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-4 sm:grid-cols-[15rem_1fr]">
            <span className="text-sm text-zinc-300">{m.name}</span>
            <div className="relative flex items-center gap-3">
              <div className="h-7 flex-1">
                <div
                  data-grow
                  className="h-full rounded-r-[4px] transition-opacity group-hover:opacity-80"
                  style={{ width: `${(m.cagr!.pct / max) * 100}%`, background: `linear-gradient(90deg, ${ACCENT}, #ffffff)` }}
                  title={`${m.name}: ${m.cagr!.pct}% a year, ${m.cagr!.period} (${m.source.publisher})`}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-sm font-medium text-white tabular-nums">{m.cagr!.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}

import { regionDots } from './regionDots'

// Equirectangular projection of the grid in scripts/generate-region-dots.mjs
// (92° to 122° E, 8° S to 22° N, 0.3° steps): one viewBox unit per grid step.
const west = 92
const north = 22
const step = 0.3
const x = (lon: number) => (lon - west) / step
const y = (lat: number) => (north - lat) / step

// The map shows a 16:10 window of that grid, from about 14° N to 4.5° S.
const view = { top: 26, width: 100, height: 62.5 }

const dots = (() => {
  let d = ''
  for (let i = 0; i < regionDots.length; i += 2) {
    const py = Math.round(y(regionDots[i]))
    if (py < view.top || py > view.top + view.height) continue
    d += `M${Math.round(x(regionDots[i + 1]))} ${py}h0`
  }
  return d
})()

const pins = [
  { key: 'singapore', lat: 1.33, lon: 103.89, short: 'Singapore', long: 'Singapore · Headquarters' },
  { key: 'penang', lat: 5.3, lon: 100.41, short: 'Penang', long: 'Penang · Batu Kawan and Perai plants' },
] as const

type PinKey = (typeof pins)[number]['key']

/**
 * A static dot map of South-East Asia with our two locations. Pass `links` to make
 * the pins jump to each site's details; without it the pins are labels only.
 */
export function RegionMap({ links, className = '' }: { links?: Record<PinKey, string>; className?: string }) {
  return (
    <div className={`@container relative aspect-[16/10] w-full ${className}`}>
      <svg
        viewBox={`0 ${view.top} ${view.width} ${view.height}`}
        role="img"
        aria-label="Map of South-East Asia showing the MoMixx headquarters in Singapore and our plants at Batu Kawan and Perai in Penang, Malaysia."
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]"
      >
        {/* Narrow maps get slightly larger, brighter dots so the land still reads. */}
        <path
          d={dots}
          fill="none"
          stroke="#a1a1aa"
          strokeLinecap="round"
          className="[stroke-opacity:0.38] [stroke-width:0.42] @max-xl:[stroke-opacity:0.5] @max-xl:[stroke-width:0.6]"
        />
      </svg>
      {pins.map((p) => {
        const href = links?.[p.key]
        const props = {
          className: 'group absolute flex -tranzinc-x-[7px] -tranzinc-y-1/2 items-center gap-2.5 rounded-full outline-none',
          style: { left: `${(x(p.lon) / view.width) * 100}%`, top: `${((y(p.lat) - view.top) / view.height) * 100}%` },
        }
        const content = (
          <>
            <span aria-hidden="true" className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
              <span className="absolute -inset-2.5 rounded-full bg-white/10" />
              <span className="absolute -inset-1 rounded-full border border-white/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.55)]" />
            </span>
            <span
              className={`rounded-full border border-white/10 bg-ink-950/80 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white backdrop-blur @3xl:text-sm ${
                href ? 'transition-colors group-hover:border-white/30 group-focus-visible:ring-2 group-focus-visible:ring-brand-300' : ''
              }`}
            >
              <span className="@xl:hidden">{p.short}</span>
              <span className="hidden @xl:inline">{p.long}</span>
            </span>
          </>
        )
        // Without links the pins only repeat the map's label, so screen readers skip them.
        return href ? (
          <a key={p.key} href={href} {...props}>
            {content}
          </a>
        ) : (
          <div key={p.key} aria-hidden="true" {...props}>
            {content}
          </div>
        )
      })}
    </div>
  )
}

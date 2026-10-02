// How hot and cold each cable material can go: a range chart in HTML (so text
// stays readable on phones), with direct value labels and a table view.
// Momixx is the one accent colour; everything else is a muted grey.

type Row = { name: string; detail: string; min: number; max: number; tone: 'momixx' | 'silicone' | 'other' }

const rows: Row[] = [
  { name: 'Momixx MV silicone', detail: 'Material rating, Momixx data', min: -60, max: 250, tone: 'momixx' },
  { name: 'Silicone cable', detail: 'LAPP ÖLFLEX HEAT 180 SiHF', min: -60, max: 180, tone: 'silicone' },
  { name: 'TPE cable', detail: 'LAPP ÖLFLEX ROBUST FD, flexing', min: -40, max: 105, tone: 'other' },
  { name: 'PVC cable', detail: 'LAPP ÖLFLEX CLASSIC 110, flexing', min: -15, max: 70, tone: 'other' },
]

const LO = -80
const HI = 280
const ticks = [-80, -40, 0, 40, 80, 120, 160, 200, 240, 280]
const pct = (t: number) => ((t - LO) / (HI - LO)) * 100
const deg = (t: number) => `${t < 0 ? '−' : ''}${Math.abs(t)} °C`

const fill = { momixx: 'bg-[#1caa9e] shadow-[0_0_18px_rgb(28_170_158/0.45)]', silicone: 'bg-[#1caa9e]/55', other: 'bg-[#5a6474]' }

export function TemperatureRange() {
  return (
    <figure className="card p-6 sm:p-8">
      <figcaption>
        <p className="text-lg font-semibold tracking-[-0.02em] text-white">Silicone keeps working from −60 °C to well above 180 °C</p>
        <p className="mt-1 text-sm text-slate-400">Rated temperature range by cable material</p>
      </figcaption>

      <div className="relative mt-8">
        {/* Reference lines: freezing and boiling water */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-2 left-12 sm:right-0 sm:left-56">
          {[
            { t: 0, label: 'Water freezes' },
            { t: 100, label: 'Water boils' },
          ].map((r) => (
            <div key={r.t} className="absolute inset-y-0 border-l border-dashed border-white/15" style={{ left: `${pct(r.t)}%` }}>
              <span className="absolute -top-6 -translate-x-1/2 text-[11px] whitespace-nowrap text-slate-500">{r.label}</span>
            </div>
          ))}
        </div>

        <ul className="relative space-y-5">
          {rows.map((r) => (
            <li key={r.name} className="sm:flex sm:items-center sm:gap-0">
              <div className="mb-2 sm:mb-0 sm:w-56 sm:shrink-0 sm:pr-6">
                <p className={`text-sm font-medium ${r.tone === 'momixx' ? 'text-white' : 'text-slate-200'}`}>{r.name}</p>
                <p className="text-xs text-slate-500">{r.detail}</p>
              </div>
              <div className="relative mr-2 ml-12 h-9 flex-1 sm:mr-0 sm:ml-0">
                <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-white/[0.06]" />
                <div
                  title={`${r.name}: ${deg(r.min)} to ${deg(r.max)}`}
                  data-grow
                  className={`absolute top-1/2 h-3 -translate-y-1/2 rounded-full ${fill[r.tone]}`}
                  style={{ left: `${pct(r.min)}%`, width: `${pct(r.max) - pct(r.min)}%` }}
                />
                <span className="absolute top-1/2 -translate-x-full -translate-y-1/2 pr-2 text-xs whitespace-nowrap text-slate-300" style={{ left: `${pct(r.min)}%` }}>
                  {deg(r.min)}
                </span>
                <span className={`absolute top-1/2 -translate-y-1/2 pl-2 text-xs font-medium whitespace-nowrap ${r.tone === 'momixx' ? 'text-white' : 'text-slate-300'}`} style={{ left: `${pct(r.max)}%` }}>
                  {deg(r.max)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Axis */}
        <div aria-hidden="true" className="relative mt-4 mr-2 ml-12 h-5 sm:mr-0 sm:ml-56">
          {ticks.map((t) => (
            <span key={t} className={`absolute -translate-x-1/2 text-[11px] text-slate-500 ${t % 80 === 0 || t === 0 ? '' : 'hidden sm:inline'}`} style={{ left: `${pct(t)}%` }}>
              {t}°
            </span>
          ))}
        </div>
      </div>

      <details className="mt-6 text-sm">
        <summary className="cursor-pointer text-slate-400 hover:text-white">View as table</summary>
        <table className="mt-3 w-full text-left text-slate-300">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="py-1.5 font-medium">Material</th>
              <th className="py-1.5 font-medium">Lowest</th>
              <th className="py-1.5 font-medium">Highest</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-white/[0.06]">
                <td className="py-1.5">
                  {r.name} <span className="text-slate-500">({r.detail})</span>
                </td>
                <td className="py-1.5">{deg(r.min)}</td>
                <td className="py-1.5">{deg(r.max)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Cable ratings for flexible use from one manufacturer&apos;s catalogue, for a like-for-like comparison:{' '}
        <a href="https://products.lappgroup.com/online-catalogue/power-and-control-cables/expanded-ambient-temperatures/silicone-cables/oelflex-heat-180-sihf.html" target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-white">
          LAPP ÖLFLEX catalogue
        </a>
        . The Momixx MV figure is the material&apos;s rating from our own testing.
      </p>
    </figure>
  )
}

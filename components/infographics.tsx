import { Illustration, type IllustrationName } from './Illustration'

// ───────────────────────── Recycling loop ─────────────────────────

export const recycleSteps = [
  { title: 'Collect scrap', body: 'Factory offcuts (post-industrial) and used products (post-consumer) that would otherwise go to landfill.' },
  { title: 'Break it down', body: 'High-temperature depolymerisation splits the silicone back into its molecular building blocks.' },
  { title: 'Recover DMC', body: 'The vapour is cooled into a liquid called DMC (dimethylcyclosiloxane), then filtered several times.' },
  { title: 'Make silicone oil', body: 'Purified DMC is rebuilt into silicone oil, the same base used for virgin silicone.' },
  { title: 'New silicone', body: 'We compound the oil into new, high-performance silicone, traceable batch by batch.' },
]

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
}

export function RecycleCycle() {
  const cx = 380
  const cy = 250
  const R = 150
  const angles = recycleSteps.map((_, i) => -90 + i * 72)
  const labelPos: Array<{ x: number; y: number; anchor: 'start' | 'middle' | 'end' }> = [
    { x: 380, y: 44, anchor: 'middle' },
    { x: 570, y: 190, anchor: 'start' },
    { x: 500, y: 438, anchor: 'middle' },
    { x: 260, y: 438, anchor: 'middle' },
    { x: 190, y: 190, anchor: 'end' },
  ]
  return (
    <>
      <svg viewBox="0 0 760 480" className="hidden w-full md:block" role="img" aria-labelledby="recycle-title">
        <title id="recycle-title">Our five-step silicone recycling loop</title>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="var(--color-brand-500)" />
          </marker>
        </defs>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-brand-100)" strokeWidth="18" />
        {angles.map((a, i) => {
          const [x1, y1] = polar(cx, cy, R, a + 17)
          const [x2, y2] = polar(cx, cy, R, a + 72 - 17)
          return (
            <path
              key={i}
              d={`M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke="var(--color-brand-500)"
              strokeWidth="2.5"
              markerEnd="url(#arrow)"
              data-draw
            />
          )
        })}
        <text x={cx} y={cy - 8} textAnchor="middle" className="fill-slate-900 font-display" fontSize="22" fontWeight="800">
          Closed-loop
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" className="fill-slate-900 font-display" fontSize="22" fontWeight="800">
          silicone
        </text>
        <text x={cx} y={cy + 44} textAnchor="middle" className="fill-slate-500" fontSize="12">
          GRS · ISCC PLUS · SCS certified
        </text>
        {angles.map((a, i) => {
          const [x, y] = polar(cx, cy, R, a)
          const l = labelPos[i]
          return (
            <g key={i}>
              <circle data-pop cx={x} cy={y} r="30" fill="white" stroke="var(--color-brand-500)" strokeWidth="2.5" />
              <text x={x} y={y + 7} textAnchor="middle" fontSize="20" fontWeight="800" className="fill-brand-700 font-display">
                {i + 1}
              </text>
              <text x={l.x} y={l.y} textAnchor={l.anchor} fontSize="16" fontWeight="700" className="fill-slate-900 font-display">
                {recycleSteps[i].title}
              </text>
            </g>
          )
        })}
      </svg>
      <ol data-reveal="stagger" className="grid gap-4 md:mt-10 md:grid-cols-5">
        {recycleSteps.map((s, i) => (
          <li key={s.title} className="card lift p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 font-display text-sm font-extrabold text-brand-700">{i + 1}</span>
            <h3 className="mt-3 font-bold">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.body}</p>
          </li>
        ))}
      </ol>
    </>
  )
}

// ───────────────────────── Sand to silicone ─────────────────────────

const journey: Array<{ title: string; body: string; icon: IllustrationName }> = [
  { title: 'Sand', body: 'Quartz sand is silicon dioxide (SiO₂), one of the most abundant materials on Earth.', icon: 'sand' },
  { title: 'Silicon', body: 'Heated in a furnace, sand becomes silicon metal: the element.', icon: 'chip' },
  { title: 'Silicone', body: 'Silicon is combined with oxygen, carbon and hydrogen into long, flexible chains.', icon: 'compound' },
  { title: 'Momixx compound', body: 'We blend silicone with additives for fire safety, colour, strength or feel.', icon: 'oem' },
  { title: 'Your product', body: 'Cables, seals, cases, medical parts and more, made by our customers.', icon: 'cable' },
]

export function SiliconeJourney() {
  return (
    <ol data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {journey.map((step, i) => (
        <li key={step.title} className="relative">
          <div data-tilt className="card lift h-full p-5">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-brand-600">Step {i + 1}</span>
              {i === 3 && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">Momixx</span>}
            </div>
            <Illustration name={step.icon} className="mt-3 h-20 w-full text-slate-800" />
            <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
          </div>
          {i < journey.length - 1 && (
            <span aria-hidden="true" className="absolute top-1/2 -right-3.5 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-600 lg:flex">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

// ───────────────────────── Silicone molecule ─────────────────────────

export function SiloxaneChain({ className }: { className?: string }) {
  const units = 4
  return (
    <svg viewBox="0 0 520 260" className={className} role="img" aria-labelledby="siloxane-title">
      <title id="siloxane-title">A silicone chain: alternating silicon and oxygen atoms with methyl side groups</title>
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="3">
        <path d="M30 130 H490" />
        {Array.from({ length: units }, (_, i) => {
          const x = 80 + i * 120
          return (
            <g key={i}>
              <path d={`M${x} 130 V60`} />
              <path d={`M${x} 130 V200`} />
            </g>
          )
        })}
      </g>
      {Array.from({ length: units }, (_, i) => {
        const x = 80 + i * 120
        return (
          <g key={i}>
            <circle cx={x} cy="130" r="28" fill="var(--color-brand-400)" />
            <text x={x} y="138" textAnchor="middle" fontSize="20" fontWeight="800" fill="var(--color-ink-950)">
              Si
            </text>
            {i < units - 1 && (
              <>
                <circle cx={x + 60} cy="130" r="18" fill="#f87171" />
                <text x={x + 60} y="136" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--color-ink-950)">
                  O
                </text>
              </>
            )}
            {[60, 200].map((y) => (
              <g key={y}>
                <circle cx={x} cy={y} r="21" fill="#e2e8f0" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-ink-950)">
                  CH₃
                </text>
              </g>
            ))}
          </g>
        )
      })}
      <g fontSize="13" fill="rgba(255,255,255,0.7)">
        <text x="20" y="250">Silicon (Si) and oxygen (O) backbone: heat-resistant and flexible</text>
      </g>
    </svg>
  )
}

// ───────────────────────── Silicon vs silicone ─────────────────────────

export function SiliconVsSilicone() {
  const cols = [
    {
      name: 'Silicon',
      formula: 'Si',
      what: 'A chemical element, number 14 on the periodic table.',
      looks: 'Hard, brittle, grey and shiny.',
      uses: 'Computer chips, solar panels, aluminium alloys.',
      highlight: false,
    },
    {
      name: 'Silicone',
      formula: '[–Si–O–]ₙ',
      what: 'A man-made material built from silicon, oxygen, carbon and hydrogen.',
      looks: 'Soft rubber, liquid, gel or resin; any colour.',
      uses: 'Cables, seals, medical devices, phone cases, cookware. This is what Momixx makes.',
      highlight: true,
    },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cols.map((c) => (
        <div key={c.name} className={`rounded-2xl border p-6 sm:p-8 ${c.highlight ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-2xl font-extrabold">{c.name}</h3>
            <span className="font-display text-lg font-bold text-slate-500">{c.formula}</span>
          </div>
          <dl className="mt-5 space-y-4 text-sm">
            {(
              [
                ['What it is', c.what],
                ['What it looks like', c.looks],
                ['Used in', c.uses],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="font-semibold text-slate-900">{k}</dt>
                <dd className="mt-0.5 leading-relaxed text-slate-600">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}

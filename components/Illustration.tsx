// Line-art illustrations used on product and application pages when no photo
// is available. One consistent style: 2px ink strokes, teal accent fills.

const A = 'var(--color-brand-400)'
const AS = 'var(--color-brand-100)'

const drawings = {
  cable: (
    <>
      <path d="M20 120c40 0 50-70 100-70s40 50 70 50" strokeWidth="10" stroke={A} strokeLinecap="round" />
      <path d="M20 120c40 0 50-70 100-70s40 50 70 50" />
      <rect x="186" y="88" width="22" height="24" rx="4" fill={AS} />
      <rect x="208" y="93" width="16" height="14" rx="3" />
      <path d="M212 100h8" />
    </>
  ),
  'ev-cable': (
    <>
      <path d="M24 130c30 0 40-40 80-40h40" strokeWidth="14" stroke={A} strokeLinecap="round" />
      <path d="M24 130c30 0 40-40 80-40h40" />
      <rect x="144" y="70" width="34" height="40" rx="6" fill={AS} />
      <circle cx="196" cy="90" r="22" />
      <circle cx="188" cy="84" r="3.5" fill="currentColor" />
      <circle cx="204" cy="84" r="3.5" fill="currentColor" />
      <circle cx="196" cy="98" r="3.5" fill="currentColor" />
      <path d="M90 34l-10 18h12l-8 16" stroke={A} />
    </>
  ),
  watchband: (
    <>
      <rect x="98" y="16" width="44" height="128" rx="18" fill={AS} />
      <rect x="92" y="54" width="56" height="52" rx="14" fill="white" />
      <rect x="100" y="62" width="40" height="36" rx="8" />
      <path d="M120 72v8l6 4" />
      <circle cx="120" cy="128" r="3" fill="currentColor" />
    </>
  ),
  'phone-case': (
    <>
      <rect x="80" y="12" width="80" height="136" rx="16" fill={AS} />
      <rect x="88" y="20" width="64" height="120" rx="10" fill="white" />
      <rect x="96" y="28" width="22" height="22" rx="6" />
      <circle cx="107" cy="39" r="5" />
      <path d="M160 52v18M80 48v12M80 66v12" stroke={A} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  seal: (
    <>
      <ellipse cx="120" cy="96" rx="70" ry="30" fill={AS} />
      <ellipse cx="120" cy="96" rx="48" ry="18" fill="white" />
      <ellipse cx="120" cy="96" rx="70" ry="30" />
      <ellipse cx="120" cy="96" rx="48" ry="18" />
      <path d="M70 30c-6 10-10 16-10 21a10 10 0 0020 0c0-5-4-11-10-21zM120 16c-6 10-10 16-10 21a10 10 0 0020 0c0-5-4-11-10-21zM170 30c-6 10-10 16-10 21a10 10 0 0020 0c0-5-4-11-10-21z" stroke={A} />
    </>
  ),
  compound: (
    <>
      <path d="M40 110l80-36 80 36-80 36z" fill={AS} />
      <path d="M40 110l80-36 80 36-80 36zM40 110v10l80 36 80-36v-10" />
      <path d="M150 74c10-20 30-26 40-14s-6 26-20 22" stroke={A} />
      <circle cx="78" cy="58" r="10" fill={A} stroke="none" />
      <circle cx="104" cy="40" r="7" fill={A} stroke="none" opacity=".6" />
      <circle cx="126" cy="54" r="5" fill={A} stroke="none" opacity=".4" />
    </>
  ),
  recycle: (
    <>
      <circle cx="120" cy="80" r="58" fill={AS} stroke="none" />
      <path d="M120 30a50 50 0 0143 25" stroke={A} strokeWidth="6" strokeLinecap="round" />
      <path d="M163 105a50 50 0 01-43 25" stroke={A} strokeWidth="6" strokeLinecap="round" />
      <path d="M77 105a50 50 0 010-50" stroke={A} strokeWidth="6" strokeLinecap="round" />
      <path d="M156 44l9 12-14 3M127 140l-9-11 13-6M68 64l7-13 8 12" />
      <circle cx="120" cy="80" r="16" />
    </>
  ),
  bottle: (
    <>
      <path d="M104 14h32v14l10 16v96a10 10 0 01-10 10h-32a10 10 0 01-10-10V44l10-16z" fill={AS} />
      <path d="M104 14h32v14l10 16v96a10 10 0 01-10 10h-32a10 10 0 01-10-10V44l10-16zM94 60h52" />
      <path d="M110 76v50" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  'extruder-vertical': (
    <>
      <rect x="92" y="10" width="56" height="140" rx="6" fill={AS} />
      <rect x="92" y="10" width="56" height="140" rx="6" />
      <path d="M120 0v160" stroke={A} strokeWidth="5" />
      <rect x="104" y="28" width="32" height="20" rx="3" fill="white" />
      <path d="M100 70h40M100 86h40M100 102h40M100 118h40" />
      <path d="M40 30h40l12 10M200 130h-52" />
      <circle cx="40" cy="30" r="10" />
      <circle cx="210" cy="130" r="14" />
    </>
  ),
  'extruder-horizontal': (
    <>
      <rect x="40" y="60" width="110" height="44" rx="6" fill={AS} />
      <rect x="40" y="60" width="110" height="44" rx="6" />
      <path d="M70 60V30h40v30" />
      <path d="M0 82h40M150 82h90" stroke={A} strokeWidth="5" />
      <path d="M50 104v24M140 104v24M30 128h130" />
    </>
  ),
  mixer: (
    <>
      <rect x="40" y="24" width="56" height="60" rx="6" fill={AS} />
      <rect x="144" y="24" width="56" height="60" rx="6" fill={AS} />
      <rect x="40" y="24" width="56" height="60" rx="6" />
      <rect x="144" y="24" width="56" height="60" rx="6" />
      <text x="68" y="60" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor" stroke="none">A</text>
      <text x="172" y="60" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor" stroke="none">B</text>
      <path d="M68 84v20l52 20 52-20V84" />
      <path d="M120 124v26" stroke={A} strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  winder: (
    <>
      <circle cx="140" cy="88" r="52" fill={AS} />
      <circle cx="140" cy="88" r="52" />
      <circle cx="140" cy="88" r="14" />
      <path d="M104 60h72M100 74h80M98 88h84M100 102h80M104 116h72" stroke={A} />
      <path d="M0 40h60l40 20" />
      <rect x="40" y="110" width="34" height="22" rx="4" />
      <circle cx="57" cy="121" r="6" />
      <path d="M74 116l26-10" strokeDasharray="4 4" />
    </>
  ),
  oven: (
    <>
      <rect x="40" y="40" width="160" height="96" rx="8" fill={AS} />
      <rect x="40" y="40" width="160" height="96" rx="8" />
      <path d="M0 88h240" stroke={A} strokeWidth="5" />
      <path d="M80 30c-6-8 6-12 0-20M120 30c-6-8 6-12 0-20M160 30c-6-8 6-12 0-20" />
      <path d="M60 116h40" strokeLinecap="round" />
      <text x="170" y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor" stroke="none">−30%</text>
    </>
  ),
  coating: (
    <>
      <path d="M50 90h140v40a10 10 0 01-10 10H60a10 10 0 01-10-10z" fill={AS} />
      <path d="M50 90h140v40a10 10 0 01-10 10H60a10 10 0 01-10-10z" />
      <path d="M10 30h70l30 80 30-80h90" stroke={A} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 100h140" strokeDasharray="6 6" />
    </>
  ),
  oem: (
    <>
      <rect x="30" y="50" width="80" height="70" rx="6" fill={AS} />
      <rect x="30" y="50" width="80" height="70" rx="6" />
      <rect x="130" y="50" width="80" height="70" rx="6" />
      <path d="M50 85h40M150 85h40" />
      <circle cx="170" cy="85" r="18" fill={A} stroke="none" />
      <path d="M110 70h20M110 100h20" />
      <path d="M70 20v30M170 20v30" stroke={A} strokeWidth="4" />
    </>
  ),
  medical: (
    <>
      <circle cx="120" cy="80" r="62" fill={AS} stroke="none" />
      <path d="M108 40h24v28h28v24h-28v28h-24V92H80V68h28z" fill="white" />
      <path d="M108 40h24v28h28v24h-28v28h-24V92H80V68h28z" />
      <path d="M20 140h50l10-20 14 34 12-26 8 12h106" stroke={A} />
    </>
  ),
  datacentre: (
    <>
      <rect x="52" y="12" width="60" height="136" rx="4" fill={AS} />
      <rect x="128" y="12" width="60" height="136" rx="4" fill={AS} />
      <rect x="52" y="12" width="60" height="136" rx="4" />
      <rect x="128" y="12" width="60" height="136" rx="4" />
      <path d="M60 32h44M60 52h44M60 72h44M60 92h44M60 112h44M136 32h44M136 52h44M136 72h44M136 92h44M136 112h44" />
      <path d="M82 148c0 8 76 8 76 0" stroke={A} strokeWidth="4" />
      <path d="M210 40c-6-8 6-12 0-20M224 60c-6-8 6-12 0-20" stroke={A} />
    </>
  ),
  robot: (
    <>
      <rect x="84" y="16" width="72" height="60" rx="22" fill={AS} />
      <rect x="84" y="16" width="72" height="60" rx="22" />
      <circle cx="106" cy="46" r="6" fill="currentColor" />
      <circle cx="134" cy="46" r="6" fill="currentColor" />
      <path d="M120 76v14M88 90h64a8 8 0 018 8v50H80V98a8 8 0 018-8z" />
      <path d="M160 100c30 0 40 20 44 40" stroke={A} strokeWidth="8" strokeLinecap="round" />
      <path d="M196 140l-6 14M204 140l8 12" />
    </>
  ),
  chip: (
    <>
      <rect x="70" y="30" width="100" height="100" rx="10" fill={AS} />
      <rect x="70" y="30" width="100" height="100" rx="10" />
      <rect x="96" y="56" width="48" height="48" rx="4" fill={A} stroke="none" />
      <path d="M90 30V14M110 30V14M130 30V14M150 30V14M90 146v-16M110 146v-16M130 146v-16M150 146v-16M70 50H54M70 70H54M70 90H54M70 110H54M186 50h-16M186 70h-16M186 90h-16M186 110h-16" />
    </>
  ),
  sand: (
    <>
      <path d="M30 130c30-50 60-70 90-70s60 20 90 70z" fill={AS} />
      <path d="M30 130c30-50 60-70 90-70s60 20 90 70z" />
      <circle cx="90" cy="100" r="3" fill="currentColor" />
      <circle cx="120" cy="86" r="3" fill="currentColor" />
      <circle cx="150" cy="104" r="3" fill="currentColor" />
      <circle cx="110" cy="112" r="3" fill="currentColor" />
    </>
  ),
} as const

export type IllustrationName = keyof typeof drawings

export function Illustration({ name, className, title }: { name: IllustrationName; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 240 160"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {drawings[name]}
    </svg>
  )
}


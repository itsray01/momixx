// Home-page hero visual: a cross-section of a silicone-jacketed cable, ringed by
// the Si–O backbone that makes silicone what it is. Crisp vector, no blur, and
// it sits beside the headline rather than behind it, so text contrast is never
// compromised. The only motion is a slow rotation of the outer ring, which is
// disabled for visitors who prefer reduced motion.

const conductors = [
  [0, 0],
  ...Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6
    return [Math.cos(a) * 54, Math.sin(a) * 54]
  }),
]

const backbone = Array(14).fill('Si — O — ').join('')

export function HeroVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 520" className={className} role="img" aria-labelledby="hero-visual-title">
      <title id="hero-visual-title">
        Cross-section of a cable: copper conductors wrapped in a Momixx silicone jacket
      </title>
      <defs>
        <radialGradient id="jacket" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="var(--color-brand-300)" />
          <stop offset="60%" stopColor="var(--color-brand-500)" />
          <stop offset="100%" stopColor="var(--color-brand-800)" />
        </radialGradient>
        <radialGradient id="copper" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#f2c79c" />
          <stop offset="55%" stopColor="#c98a55" />
          <stop offset="100%" stopColor="#8a5530" />
        </radialGradient>
        <path id="ring-path" d="M260 260m-196 0a196 196 0 1 0 392 0a196 196 0 1 0-392 0" />
      </defs>

      {/* guide rings */}
      <g fill="none" stroke="rgba(255,255,255,0.08)">
        <circle cx="260" cy="260" r="236" />
        <circle cx="260" cy="260" r="214" strokeDasharray="2 6" />
      </g>

      {/* Si–O backbone, slowly rotating */}
      <g className="animate-spin-slow" style={{ transformOrigin: '260px 260px' }}>
        <text fontSize="12" letterSpacing="2" fill="var(--color-brand-300)" opacity="0.55" fontFamily="var(--font-display)">
          <textPath href="#ring-path">{backbone}</textPath>
        </text>
      </g>

      {/* jacket */}
      <circle cx="260" cy="260" r="172" fill="url(#jacket)" />
      <circle cx="260" cy="260" r="172" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      {/* insulation and filler */}
      <circle cx="260" cy="260" r="124" fill="#e8eef3" />
      <circle cx="260" cy="260" r="114" fill="var(--color-ink-900)" />
      {/* conductors */}
      <g transform="translate(260 260)">
        {conductors.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="25" fill="#2b3a4f" />
            <circle cx={x} cy={y} r="19" fill="url(#copper)" />
          </g>
        ))}
      </g>
      {/* highlight on jacket */}
      <path d="M150 170a140 140 0 0 1 120-78" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="6" strokeLinecap="round" />

      {/* callouts (hidden on small screens where the text would be tiny) */}
      <g className="max-sm:hidden" fontFamily="var(--font-sans)" fontSize="14">
        <g stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none">
          <path d="M398 168 L452 124 H548" />
          <path d="M366 356 L430 400 H548" />
          <path d="M224 230 L150 64 H20" />
        </g>
        <circle cx="398" cy="168" r="4" fill="white" />
        <circle cx="366" cy="356" r="4" fill="white" />
        <circle cx="224" cy="230" r="4" fill="white" />
        <text x="548" y="94" textAnchor="end" fill="white" fontWeight="600">Momixx silicone jacket</text>
        <text x="548" y="114" textAnchor="end" fill="rgba(255,255,255,0.6)" fontSize="12">Fire-retardant · UL VW-1</text>
        <text x="548" y="390" textAnchor="end" fill="white" fontWeight="600">−60 °C to 250 °C</text>
        <text x="548" y="420" textAnchor="end" fill="rgba(255,255,255,0.6)" fontSize="12">Stays flexible, won’t melt</text>
        <text x="20" y="54" fill="white" fontWeight="600">Copper conductors</text>
        <text x="20" y="84" fill="rgba(255,255,255,0.6)" fontSize="12">Power and data</text>
      </g>
    </svg>
  )
}

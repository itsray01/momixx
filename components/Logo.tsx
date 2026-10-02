// Stand-in for the Orion MoMixx mark. Replace the <svg> with the official logo
// file (ask marketing for the SVG) once available — everything else that uses
// <Logo /> will update automatically.

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M4 4h9l7 9 7-9h9L24.5 20 36 36h-9l-7-9-7 9H4l11.5-16z" fill="currentColor" />
      <path d="M20 15.5l4.5 4.5-4.5 4.5-4.5-4.5z" fill="var(--color-brand-400)" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark className="h-8 w-8" />
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase opacity-70">Orion</span>
        <span className="font-display text-lg font-extrabold tracking-tight">MoMixx</span>
      </span>
    </span>
  )
}

'use client'

// A quiet "back to top" for the footer: glides up, or jumps for visitors who prefer reduced motion.
export function BackToTop({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
        // Keyboard users carry on from the top of the page, not from the footer.
        document.querySelector<HTMLElement>('header a')?.focus({ preventScroll: true })
      }}
      className={`group inline-flex items-center gap-1.5 py-1 hover:text-white ${className}`}
    >
      Back to top
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5">
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

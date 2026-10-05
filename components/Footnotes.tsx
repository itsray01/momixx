// Apple-style footnotes: a claim carries a small number, and the qualifier sits
// in a numbered note at the foot of the page, so headlines stay short while the
// qualification stays on the page. Number notes in the order they first appear.

/**
 * A footnote marker, linking to note `n` at the foot of the page. Inside
 * another link (a card), pass `plain`: links can't be nested.
 */
export function Fn({ n, plain = false }: { n: number; plain?: boolean }) {
  if (plain)
    return (
      <sup aria-label={`Footnote ${n}`} className="ml-0.5 text-[0.55em] font-medium text-zinc-400">
        {n}
      </sup>
    )
  return (
    <sup className="ml-0.5 text-[0.55em] font-medium">
      <a href={`#fn-${n}`} aria-label={`Footnote ${n}`} className="text-zinc-400 no-underline hover:text-white">
        {n}
      </a>
    </sup>
  )
}

/** The notes themselves, shown just above the site footer. */
export function Footnotes({ notes }: { notes: string[] }) {
  if (!notes.length) return null
  return (
    <section aria-label="Footnotes" className="border-t border-white/[0.06] bg-ink-950">
      <ol className="container-page max-w-5xl space-y-2 py-10 text-xs leading-relaxed text-zinc-500">
        {notes.map((note, i) => (
          <li key={note} id={`fn-${i + 1}`} className="flex scroll-mt-28 gap-2">
            <span className="tabular-nums">{i + 1}.</span>
            <span>{note}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

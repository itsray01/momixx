import Image from 'next/image'
import type { Certification } from '@/content/company'

/**
 * The certifications as a register: one row per certificate with its scheme, issuer,
 * number and where to verify it, grouped by what each certifies. A ledger rather than a
 * grid of cards, because the point of the page is that these are checkable records.
 */
const groups: Array<{ id: Certification['group']; label: string }> = [
  { id: 'recycling', label: 'Recycled content' },
  { id: 'quality', label: 'Quality management' },
  { id: 'validation', label: 'Independent validation' },
]

export function CertRegister({ certs }: { certs: Certification[] }) {
  return (
    <div data-reveal="stagger">
      {groups.map((g) => {
        const rows = certs.filter((c) => c.group === g.id)
        if (rows.length === 0) return null
        return (
          <section key={g.id} aria-labelledby={`register-${g.id}`} className="mt-12 first:mt-0">
            <h3 id={`register-${g.id}`} className="flex items-center gap-4 text-sm font-medium text-gold-600">
              {g.label}
              <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-gold-400/60 to-transparent" />
            </h3>
            <ul className="mt-2">
              {rows.map((c) => (
                <li key={c.id} id={c.id} className="group grid scroll-mt-32 gap-5 border-t border-white/10 py-7 first:border-t-0 md:grid-cols-[8.5rem_minmax(0,1fr)_16rem] md:gap-8 lg:grid-cols-[8.5rem_minmax(0,1fr)_17rem_11rem]">
                  <div className="flex min-h-12 flex-col justify-center gap-1.5">
                    {c.logo ? (
                      <>
                        {c.logoHref ? (
                          <a href={c.logoHref} target="_blank" rel="noopener noreferrer" className="inline-block w-fit">
                            <Image src={c.logo} alt={`${c.name} logo`} width={120} height={48} className="logo-mark max-h-16 w-auto max-w-[8rem] object-contain" />
                          </a>
                        ) : (
                          <Image src={c.logo} alt={`${c.name} logo`} width={120} height={48} className="logo-mark max-h-16 w-auto max-w-[8rem] object-contain" />
                        )}
                        {c.logoCredit && <span className="text-[0.625rem] leading-none text-zinc-500">{c.logoCredit}</span>}
                      </>
                    ) : (
                      <span className="rounded-xl border border-gold-400/45 bg-gold-100 px-3 py-1.5 text-base font-semibold whitespace-nowrap tracking-[-0.02em] text-gold-700">{c.short}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-semibold tracking-[-0.02em] text-white">{c.name}</h4>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-zinc-400">{c.plain}</p>
                  </div>
                  <dl className="grid grid-cols-[6rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm">
                    {c.schemeOwner && (
                      <>
                        <dt className="text-zinc-500">Standard</dt>
                        <dd className="text-zinc-300">{c.schemeOwner}</dd>
                      </>
                    )}
                    <dt className="text-zinc-500">{c.group === 'validation' ? 'Checked by' : 'Issued by'}</dt>
                    <dd className="text-zinc-300">{c.issuer}</dd>
                    {c.number && (
                      <>
                        <dt className="text-zinc-500">Certificate</dt>
                        <dd className="text-zinc-300 tabular-nums break-all">{c.number}</dd>
                      </>
                    )}
                    {c.year && (
                      <>
                        <dt className="text-zinc-500">Since</dt>
                        <dd className="text-zinc-300 tabular-nums">{c.year}</dd>
                      </>
                    )}
                  </dl>
                  <div className="flex flex-col gap-2 text-sm md:col-start-3 lg:col-start-4 lg:items-end lg:text-right">
                    {c.verifyUrl && (
                      <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-300 hover:text-brand-200">
                        Verify certificate <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {c.file ? (
                      <a href={c.file} target="_blank" rel="noopener" className="font-medium text-brand-300 hover:text-brand-200">
                        View certificate (PDF) <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <span className="text-zinc-500">{c.group === 'validation' ? 'Statement available on request' : 'Copy available on request'}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

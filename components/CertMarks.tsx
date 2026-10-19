import Image from 'next/image'
import Link from 'next/link'
import { recyclingCertifications } from '@/content/company'

/**
 * The recycled-content certifications in a row: the scheme's own mark where we have
 * it (grey until hovered, then in colour), a gilt badge where we do not. Each links
 * to the register on the sustainability page.
 */
export function CertMarks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-start gap-x-9 gap-y-6 ${className}`} aria-label="Recycled-content certifications">
      {recyclingCertifications.map((c) => (
        <li key={c.id} className="group">
          {/* Every mark sits in the same-height box with the same-height credit line under it, so the row lines up. */}
          <Link href="/sustainability#certificates" className="flex flex-col items-center gap-2" aria-label={`${c.name}: see our certificates`}>
            <span className="flex h-14 items-center">
              {c.logo ? (
                <Image src={c.logo} alt={`${c.name} logo`} width={160} height={64} className="logo-mark max-h-14 w-auto max-w-[9rem] object-contain" />
              ) : (
                <span className="rounded-xl border border-gold-400/45 bg-gold-100 px-3.5 py-2 text-base font-semibold whitespace-nowrap tracking-[-0.02em] text-gold-700 transition-colors group-hover:border-gold-400">
                  {c.short}
                </span>
              )}
            </span>
            <span className="h-3 text-xs leading-none text-zinc-500">{c.logoCredit}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

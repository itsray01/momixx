import Image from 'next/image'
import type { Certification } from '@/content/company'

/** A certification with its plain-English meaning and certificate link. */
export function CertCard({ cert, featured = false, wide = false }: { cert: Certification; featured?: boolean; wide?: boolean }) {
  // `wide`: the only card in its row, laid out across it (badge, words, links) so it never sits alone.
  return (
    <li
      className={`group card lift flex flex-col ${featured ? 'p-8 sm:p-10' : 'p-7'} ${
        wide ? 'col-span-full lg:grid lg:grid-cols-[11rem_minmax(0,1fr)_auto] lg:items-center lg:gap-x-10' : ''
      }`}
    >
      <div className="flex min-h-16 flex-col justify-center gap-1.5">
        {cert.logo ? (
          <>
            {cert.logoHref ? (
              <a href={cert.logoHref} target="_blank" rel="noopener noreferrer" className="inline-block w-fit">
                <Image src={cert.logo} alt={`${cert.name} logo`} width={120} height={64} className="logo-mark max-h-16 w-auto max-w-[9rem] object-contain" />
              </a>
            ) : (
              <Image src={cert.logo} alt={`${cert.name} logo`} width={120} height={64} className="logo-mark max-h-16 w-auto max-w-[9rem] object-contain" />
            )}
            {cert.logoCredit && <span className="text-xs leading-none text-zinc-500">{cert.logoCredit}</span>}
          </>
        ) : (
          <span
            className={`rounded-xl border border-gold-400/45 bg-gold-100 px-3.5 py-2 font-semibold whitespace-nowrap tracking-[-0.02em] text-gold-700 ${featured ? 'text-2xl' : 'text-lg'}`}
          >
            {cert.short}
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${wide ? 'lg:max-w-2xl' : ''}`}>
        <h3 className={`mt-5 font-semibold tracking-[-0.02em] text-white ${featured ? 'text-2xl' : ''} ${wide ? 'lg:mt-0' : ''}`}>{cert.name}</h3>
        <p className="mt-1 text-xs text-zinc-500">
          {cert.schemeOwner && `Standard: ${cert.schemeOwner} · `}
          {cert.issuer}
          {cert.year ? ` · since ${cert.year}` : ''}
          {cert.number ? ` · No. ${cert.number}` : ''}
        </p>
        <p className={`mt-4 flex-1 leading-relaxed text-zinc-400 ${featured ? 'text-base' : 'text-sm'}`}>{cert.plain}</p>
      </div>
      <div className={`mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium ${wide ? 'lg:mt-0 lg:justify-end' : ''}`}>
        {cert.file ? (
          <a href={cert.file} target="_blank" rel="noopener" className="text-brand-300 hover:text-brand-200">
            View certificate (PDF) <span aria-hidden="true">→</span>
          </a>
        ) : (
          <span className="font-normal text-zinc-500">Certificate available on request</span>
        )}
        {cert.verifyUrl && (
          <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="text-brand-300 hover:text-brand-200">
            Verify certificate <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </li>
  )
}

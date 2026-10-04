import Image from 'next/image'
import type { Certification } from '@/content/company'

/** A certification with its plain-English meaning and certificate link. */
export function CertCard({ cert, featured = false }: { cert: Certification; featured?: boolean }) {
  return (
    <li className={`card lift flex flex-col ${featured ? 'p-8 sm:p-10' : 'p-7'}`}>
      <div className="flex h-16 items-center">
        {cert.logo ? (
          <Image src={cert.logo} alt={`${cert.name} logo`} width={120} height={64} className="h-14 w-auto object-contain" />
        ) : (
          <span
            className={`rounded-xl border border-brand-400/30 bg-brand-400/10 px-3.5 py-2 font-semibold tracking-[-0.02em] text-brand-100 ${featured ? 'text-2xl' : 'text-lg'}`}
          >
            {cert.short}
          </span>
        )}
      </div>
      <h3 className={`mt-5 font-semibold tracking-[-0.02em] text-white ${featured ? 'text-2xl' : ''}`}>{cert.name}</h3>
      <p className="mt-1 text-xs text-slate-500">
        {cert.schemeOwner && `Standard: ${cert.schemeOwner} · `}
        {cert.issuer}
        {cert.year ? ` · since ${cert.year}` : ''}
        {cert.number ? ` · No. ${cert.number}` : ''}
      </p>
      <p className={`mt-4 flex-1 leading-relaxed text-slate-400 ${featured ? 'text-base' : 'text-sm'}`}>{cert.plain}</p>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
        {cert.file ? (
          <a href={cert.file} target="_blank" rel="noopener" className="text-brand-300 hover:text-brand-200">
            View certificate (PDF) <span aria-hidden="true">→</span>
          </a>
        ) : (
          <span className="font-normal text-slate-500">Certificate available on request</span>
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

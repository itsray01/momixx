import { CertCard } from '@/components/CertCard'
import { ArrowLink, PageHeader, Section } from '@/components/ui'
import { certifications, formalCertifications } from '@/content/company'
import { board, committees, policies } from '@/content/governance'
import { pageMetadata, site } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Governance',
  description: 'Company information, certifications and policies for MoMixx, headquartered in Singapore.',
  path: '/governance',
})

const validations = certifications.filter((c) => c.group === 'validation')

const companyInfo = [
  { label: 'Registered name', value: [site.legalName] },
  { label: 'Brand', value: [site.name] },
  ...(site.registrationNumber ? [{ label: 'Registration number', value: [`Singapore UEN ${site.registrationNumber}`] }] : []),
  { label: 'Headquarters', value: [site.address.street, `${site.address.locality} ${site.address.postalCode}`] },
  { label: 'Malaysian company', value: [site.plants.perai.company] },
  { label: 'Operations', value: site.locations.map((l) => `${l.name}: ${l.role}`) },
]

// Sections in page order; the optional ones drop out while their lists are empty.
const shown = [
  'information',
  'certifications',
  board.length > 0 && 'board',
  committees.length > 0 && 'committees',
  policies.length > 0 && 'policies',
  'website-policies',
  'company-enquiries',
].filter(Boolean)
const tone = (id: string) => (shown.indexOf(id) % 2 ? 'muted' : 'white')

export default function GovernancePage() {
  const investorEmail = site.investorEmail || site.email

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/governance', label: 'Governance' }]}
        eyebrow="Governance"
        title="Corporate *governance*"
        intro="Company information, certifications and policies."
      />

      <Section id="information" tone={tone('information')} eyebrow="The company" title="Company *information*">
        <dl className="max-w-4xl divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {companyInfo.map((row) => (
            <div key={row.label} className="grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-10">
              <dt className="text-sm text-zinc-400">{row.label}</dt>
              <dd className="text-lg text-white">
                {row.value.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="certifications" tone={tone('certifications')} eyebrow="Certified" title="Certifications">
        <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {formalCertifications.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
        </ul>
        {validations.length > 0 && (
          <ul data-reveal="stagger" className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {validations.map((c) => (
              <CertCard key={c.id} cert={c} />
            ))}
          </ul>
        )}
        <div className="mt-10">
          <ArrowLink href="/sustainability">More on our certifications</ArrowLink>
        </div>
      </Section>

      {board.length > 0 && (
        <Section id="board" tone={tone('board')} eyebrow="Leadership" title="Board of *directors*">
          <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {board.map((d) => (
              <li key={d.name} className="card p-7">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{d.name}</h3>
                <p className="mt-1 text-sm font-medium text-brand-300">
                  {d.role}
                  {d.independent && ' · Independent'}
                </p>
                {d.bio && <p className="mt-4 text-sm leading-relaxed text-zinc-400">{d.bio}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {committees.length > 0 && (
        <Section id="committees" tone={tone('committees')} eyebrow="Oversight" title="Board *committees*">
          <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {committees.map((c) => (
              <li key={c.name} className="card p-7">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{c.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{c.remit}</p>
                <dl className="mt-6 space-y-3 border-t border-white/[0.08] pt-5 text-sm">
                  {c.chair && (
                    <div>
                      <dt className="text-xs text-zinc-500">Chair</dt>
                      <dd className="mt-0.5 text-white">{c.chair}</dd>
                    </div>
                  )}
                  {c.members.length > 0 && (
                    <div>
                      <dt className="text-xs text-zinc-500">Members</dt>
                      <dd className="mt-0.5 text-white">{c.members.join(', ')}</dd>
                    </div>
                  )}
                </dl>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {policies.length > 0 && (
        <Section id="policies" tone={tone('policies')} eyebrow="Policies" title="*Policies*">
          <ul data-reveal="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {policies.map((p) => (
              <li key={p.href} className="card flex flex-col p-7">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{p.summary}</p>
                <a href={p.href} target="_blank" rel="noopener" className="mt-6 self-start text-sm font-medium text-brand-300 hover:text-brand-200">
                  Read the policy <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="website-policies" tone={tone('website-policies')} eyebrow="This website" title="Website *policies*">
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-lg">
          <li>
            <ArrowLink href="/privacy">Privacy notice</ArrowLink>
          </li>
          <li>
            <ArrowLink href="/terms">Terms of use</ArrowLink>
          </li>
        </ul>
      </Section>

      <Section id="company-enquiries" tone={tone('company-enquiries')} eyebrow="Contact" title="Company *enquiries*" className="scroll-mt-28">
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
          For questions about MoMixx as a company, email{' '}
          <a
            href={`mailto:${investorEmail}?subject=${encodeURIComponent('Company enquiry')}`}
            className="font-medium break-words text-white underline decoration-white/20 underline-offset-4 hover:decoration-brand-300"
          >
            {investorEmail}
          </a>
          .
        </p>
      </Section>
    </>
  )
}

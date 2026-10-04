import { LinkCard } from '@/components/LinkCard'
import { RegionMap } from '@/components/RegionMap'
import type { ModelName } from '@/components/three/modelNames'
import { ArrowLink, PageHeader, Section } from '@/components/ui'
import { pageMetadata, site } from '@/lib/site'
import { ContactForm } from './ContactForm'

export const metadata = pageMetadata({
  title: 'Contact us',
  description: `Contact MoMixx about silicone materials, recycled silicone, extrusion equipment or manufacturing. Email ${site.email}.`,
  path: '/contact',
})

const help: Array<{ title: string; body: string; href: string; render: ModelName }> = [
  { title: 'Silicone materials', body: 'Compounds for cables, EVs, seals and cases.', href: '/products#materials', render: 'samples' },
  { title: 'Machines', body: 'Extrusion lines, mixers, winders, ovens and coaters.', href: '/products#equipment', render: 'extruder-vertical' },
  { title: 'Contract manufacturing', body: 'Finished silicone parts, including medical parts.', href: '/products#services', render: 'oem' },
  { title: 'Recycled silicone', body: 'Certified recycled silicone, on request in any of our grades.', href: '/recycled-silicone', render: 'recycle' },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: '/contact', label: 'Contact' }]} eyebrow="Contact" title="Contact *MoMixx*" intro="Tell us about your product or project and the right person on our team will get back to you." />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm formId={site.formspreeId} email={site.email} />
          <div className="space-y-8">
            <div className="card overflow-hidden p-3">
              <RegionMap />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Email</h2>
              <a href={`mailto:${site.email}`} className="mt-1 block text-brand-300 hover:underline">
                {site.email}
              </a>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Headquarters</h2>
              <address className="mt-1 text-slate-400 not-italic">
                {site.address.street}
                <br />
                {site.address.locality} {site.address.postalCode}
              </address>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Manufacturing</h2>
              <ul className="mt-1 space-y-1 text-slate-400">
                {site.locations
                  .filter((l) => l.role !== 'Headquarters')
                  .map((l) => (
                    <li key={l.name}>{l.name}</li>
                  ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <ArrowLink href="/locations#singapore">Singapore</ArrowLink>
              <ArrowLink href="/locations#batu-kawan">Batu Kawan</ArrowLink>
              <ArrowLink href="/locations#perai">Perai</ArrowLink>
            </div>
          </div>
        </div>
      </Section>
      <Section tone="muted" eyebrow="How we can help" title="What can we *help with?*">
        <ul data-reveal="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {help.map((h) => (
            <li key={h.href}>
              <LinkCard href={h.href} title={h.title} body={h.body} render={h.render} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

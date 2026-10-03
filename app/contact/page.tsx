import { PageHeader, Section } from '@/components/ui'
import { pageMetadata, site } from '@/lib/site'
import { ContactForm } from './ContactForm'

export const metadata = pageMetadata({
  title: 'Contact us',
  description: `Contact MoMixx about silicone materials, recycled silicone, extrusion equipment or manufacturing. Email ${site.email}.`,
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: '/contact', label: 'Contact' }]} eyebrow="Contact" title="Contact *MoMixx*" intro="Tell us about your product or project and the right person on our team will get back to you." />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm formId={site.formspreeId} email={site.email} />
          <div className="space-y-8">
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
          </div>
        </div>
      </Section>
    </>
  )
}

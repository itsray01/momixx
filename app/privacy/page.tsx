import Link from 'next/link'
import { PageHeader, Section } from '@/components/ui'
import { pageMetadata, site } from '@/lib/site'

// Draft privacy notice based on what this website actually does. It must be
// reviewed by the company's legal advisers before launch (docs/LAUNCH-CHECKLIST.md).
const updated = '3 October 2026'

export const metadata = pageMetadata({
  title: 'Privacy notice',
  description: `How ${site.legalName} collects, uses and protects personal data sent through this website, and how to contact us about it.`,
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: '/privacy', label: 'Privacy notice' }]} eyebrow="Legal" title="Privacy *notice*" intro={`How we handle personal data sent to us through this website. Last updated ${updated}.`} />
      <Section>
        <div className="article-prose max-w-3xl">
          <h2>Who we are</h2>
          <p>
            This website is run by {site.legalName} (“{site.name}”, “we”), {site.address.street}, {site.address.locality} {site.address.postalCode}. For any
            question about your personal data, email <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Enquiries.</strong> When you use our contact form or email us: your name, company, email address, phone number (if given) and
              your message.
            </li>
            <li>
              <strong>Visitor statistics.</strong> Anonymous, aggregated figures such as page views and loading speed. These do not use cookies and do
              not identify you.
            </li>
            <li>
              <strong>Technical logs.</strong> Our hosting provider keeps short-lived server logs (for example IP addresses and browser type) to keep
              the website secure and working.
            </li>
          </ul>

          <h2>How we use it</h2>
          <p>
            We use your details to reply to your enquiry, to discuss and supply our products and services, and to keep the website secure and
            improve it. We do not sell personal data, and we do not use it for advertising.
          </p>

          <h2>Who we share it with</h2>
          <p>
            We share personal data only with service providers that help us run the website and handle enquiries (website hosting, form delivery
            and email), with companies in our group where needed to answer your enquiry, and where the law requires it. Some of these providers may
            process data outside Singapore and Malaysia; where they do, we take steps to make sure it stays protected to a comparable standard.
          </p>

          <h2>How long we keep it</h2>
          <p>We keep enquiry details only as long as needed to deal with your enquiry and any business relationship that follows, and as required by law.</p>

          <h2>Your choices and rights</h2>
          <p>
            You can ask to see or correct the personal data we hold about you, or withdraw your consent to us using it, by emailing{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>. We will respond as soon as reasonably possible.
          </p>

          <h2>Cookies</h2>
          <p>This website does not use advertising or tracking cookies, so there is no cookie banner. Our visitor statistics are cookie-free.</p>

          <h2>Changes</h2>
          <p>
            We may update this notice. The date at the top shows when it last changed. See also our <Link href="/terms">terms of use</Link>.
          </p>
        </div>
      </Section>
    </>
  )
}

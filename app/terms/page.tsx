import Link from 'next/link'
import { PageHeader, Section } from '@/components/ui'
import { pageMetadata, site } from '@/lib/site'

// Draft terms of use. To be reviewed by the company's legal advisers before
// launch (docs/LAUNCH-CHECKLIST.md), including the forward-looking statements
// wording, which should match the company's listing documents.
const updated = '3 October 2026'

export const metadata = pageMetadata({
  title: 'Terms of use',
  description: `The terms that apply to using the ${site.name} website, including how to read technical information, market data and forward-looking statements.`,
  path: '/terms',
})

export default function TermsPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: '/terms', label: 'Terms of use' }]} eyebrow="Legal" title="Terms of *use*" intro={`The terms that apply when you use this website. Last updated ${updated}.`} />
      <Section>
        <div className="article-prose max-w-3xl">
          <h2>About this website</h2>
          <p>
            This website is run by {site.legalName}
            {site.registrationNumber && ` (UEN ${site.registrationNumber})`} (“{site.name}”, “we”). By using it, you agree to these terms. If you do not agree, please do not
            use the website.
          </p>

          <h2>Information on this website</h2>
          <p>
            The information here is general and for guidance only. Product figures describe typical results, often from our own testing, and are not
            a specification or a guarantee for any particular use. Please ask us for the current technical data sheet and test whether a material
            suits your product before using it. Our contracts and data sheets take priority over anything on this website.
          </p>

          <h2>Market and third-party information</h2>
          <p>
            Market sizes and forecasts on this website are independent estimates published by the third parties named next to them. We have not
            prepared or verified them, and they are not forecasts of {site.name}’s business. Links to other websites are provided for convenience; we
            are not responsible for their content.
          </p>

          <h2>Forward-looking statements</h2>
          <p>
            Some statements on this website describe plans, expectations or developments in our markets. They reflect our current view, involve
            risks and uncertainties, and actual outcomes may differ. We do not undertake to update them. Nothing on this website is an offer of, or
            invitation to buy, any securities.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The content of this website, including text, images, 3D models and the {site.name} name and logo, belongs to us or our licensors. You
            may view and share pages for your own reference, but not copy or reuse the content commercially without our written permission.
          </p>

          <h2>Liability</h2>
          <p>
            We take care to keep this website accurate and available, but we cannot guarantee that it is complete, current or free of errors. To the
            extent the law allows, we are not liable for any loss arising from use of the website or reliance on its content.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of Singapore.</p>

          <h2>Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a>. See also our <Link href="/privacy">privacy notice</Link>.
          </p>
        </div>
      </Section>
    </>
  )
}

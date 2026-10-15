// Company story, milestones and certifications.
//
// Counts shown on the site (number of certifications, recycling certifications)
// are derived from the `certifications` list below. Do not hardcode them in pages.

import { site } from '@/lib/site'

export const milestones: Array<{ year: number; items: string[] }> = [
  {
    year: 2019,
    items: [
      'Research and production centre opened in Malaysia',
      'Developed our first flame-retardant solid silicone (HCR)',
      'Our flame-retardant silicone for charging cables qualified by a leading smartphone brand',
    ],
  },
  { year: 2020, items: ['Developed flame-retardant liquid silicone (LSR)', 'Began developing our vertical cable extrusion line'] },
  { year: 2021, items: ['Our liquid silicone for data cables qualified by a leading smartphone brand', 'First vertical extrusion line installed'] },
  { year: 2022, items: ['Second factory set up for large-volume production', 'Number of vertical extrusion lines installed doubled'] },
  {
    year: 2023,
    items: [
      'Second factory qualified for large-volume production',
      'Further data-cable qualification with a leading smartphone brand',
      'Recycled silicone production expanded',
      'Developed a flame-retardant liquid silicone that cures (sets) at a lower temperature, for a PFAS-free project',
    ],
  },
  {
    year: 2024,
    items: [
      'Volume production of the lower-temperature-curing silicone began',
      'Recycled silicone production certified to the Global Recycled Standard (GRS)',
      'Developed materials that combine silicone and bio-leather',
    ],
  },
  {
    year: 2025,
    items: [
      'Penang factory expanded, with a larger research team',
      'Began making silicone parts for medical-device makers',
      'ISCC PLUS certification for chain of custody of recycled materials',
    ],
  },
  {
    year: 2026,
    items: [
      'Volume production of liquid silicone began in Penang for South-East Asian customers',
      'Batu Kawan, Penang factory’s quality system certified to ISO 13485, the medical-device quality standard',
      'Began making high-precision parts for the medical and semiconductor industries',
    ],
  },
]

export type Certification = {
  id: string
  name: string
  short: string
  /** Who audits and issues the certificate (not the owner of the standard). */
  issuer: string
  /** Who owns and maintains the standard, where different from the issuer. */
  schemeOwner?: string
  covers: string
  plain: string
  year?: number
  /** 'validation' = an independent check that is not a certification (e.g. carbon footprint). Not counted as a certification. */
  group: 'recycling' | 'quality' | 'validation'
  /** Drop the PDF into /public/certificates and set e.g. '/certificates/grs.pdf' */
  file?: string
  /** Drop the logo into /public/images/certs and set e.g. '/images/certs/grs.png' */
  logo?: string
  /** Where the logo links: the scheme's rules (Textile Exchange's, for one) require a link to the standard. */
  logoHref?: string
  /** A credit the scheme's logo rules require next to the logo, e.g. "© Textile Exchange". */
  logoCredit?: string
  /** Certificate or licence number, shown on the card. */
  number?: string
  /** Link to the scheme's public certificate database entry, so anyone can verify it. */
  verifyUrl?: string
}

export const certifications: Certification[] = [
  {
    id: 'grs',
    name: 'Global Recycled Standard',
    short: 'GRS',
    issuer: 'Control Union Certifications B.V.',
    schemeOwner: 'Textile Exchange',
    covers: 'Recycled content (100% post-consumer recycled silicone), chain of custody, and social, environmental and chemical requirements. Batu Kawan, Penang.',
    // Scope certificate to GRS 4.0 (and RCS 2.0), holder Orion Technology Sdn. Bhd., TE-ID TE-00347986, issued 2026-08-24, valid to 2027-08-23.
    number: 'CU1512008MUL-2026-00087898',
    verifyUrl: 'https://www.textileexchange.org/Certificates',
    // Logo as supplied (14 Oct 2026); Textile Exchange's TE-302 asks for the link and the copyright mark.
    logo: '/images/certs/grs.png',
    logoHref: 'https://textileexchange.org/standards/',
    logoCredit: '© Textile Exchange',
    plain: 'Independent audits check our recycled-content claims and the chain of custody from collected waste to finished silicone, along with social, environmental and chemical rules.',
    year: 2024,
    group: 'recycling',
  },
  {
    id: 'rcs',
    name: 'Recycled Claim Standard',
    short: 'RCS',
    issuer: 'Control Union Certifications B.V.',
    schemeOwner: 'Textile Exchange',
    covers: 'Recycled content (100% post-consumer recycled silicone) and chain of custody. Batu Kawan, Penang; on the same scope certificate as GRS.',
    number: 'CU1512008MUL-2026-00087898',
    verifyUrl: 'https://www.textileexchange.org/Certificates',
    // The RCS 100 mark (100% recycled content), as on the certificate's product appendix.
    logo: '/images/certs/rcs.png',
    logoHref: 'https://textileexchange.org/standards/',
    logoCredit: '© Textile Exchange',
    plain: 'Textile Exchange’s standard for verifying recycled content and tracking it through the chain of custody. It is GRS without the social, environmental and chemical requirements, for customers whose programmes ask for RCS.',
    group: 'recycling',
  },
  {
    id: 'iscc-plus',
    name: 'ISCC PLUS',
    short: 'ISCC PLUS',
    issuer: 'Accredited certification body',
    schemeOwner: 'International Sustainability & Carbon Certification (ISCC)',
    covers: 'Chain of custody of recycled and circular raw materials, including mass balance',
    logo: '/images/certs/iscc-plus.png',
    logoHref: 'https://www.iscc-system.org/',
    plain: 'An international scheme that audits the chain of custody of recycled materials. It allows mass balance, where recycled content is allocated in certified records rather than kept physically separate.',
    year: 2025,
    group: 'recycling',
  },
  {
    id: 'scs',
    name: 'SCS Recycled Content Certification',
    short: 'SCS Global',
    issuer: 'SCS Global Services',
    covers: 'Independent verification of recycled-content claims',
    logo: '/images/certs/scs.png',
    logoHref: 'https://www.scsglobalservices.com/',
    plain: 'An independent auditor verifies the recycled-content claims for our recycled silicone.',
    group: 'recycling',
  },
  {
    id: 'carbon',
    name: 'Product carbon footprint validation',
    short: 'Carbon footprint',
    issuer: 'Independent third party',
    covers: 'Product carbon footprint calculation',
    plain: 'An independent third party has checked how we calculate the carbon footprint of our silicone. The validation statement, with its scope and method, is available on request.',
    group: 'validation',
  },
  {
    id: 'iso-13485',
    name: 'ISO 13485 Medical Devices Quality Management',
    short: 'ISO 13485',
    issuer: 'Hawk Eye Certifications Pvt. Ltd. (EGAC-accredited)',
    schemeOwner: 'International Organization for Standardization (ISO)',
    covers:
      'Quality management system at the Batu Kawan, Penang factory: medical-grade injection-moulded parts (including LSR and LIM), compounding and formulation of silicone materials, and fabricated metal tools for the medical industry',
    // ISO 13485:2016, holder Orion Technology Sdn. Bhd., certified 25 June 2026, certificate expires 24 June 2027 (surveillance audit due by 24 May 2027).
    number: 'INT/EGM/2606ON/5521',
    verifyUrl: 'https://www.thehawk-eye.com',
    plain: 'The international quality-management standard for making medical devices and their components. It certifies how we work, not a specific material.',
    year: 2026,
    group: 'quality',
  },
]

/** Certifications only (excludes validations such as the carbon footprint check). */
export const formalCertifications = certifications.filter((c) => c.group !== 'validation')

/** Recycled-content certifications (GRS, ISCC PLUS, SCS). */
export const recyclingCertifications = certifications.filter((c) => c.group === 'recycling')

const listNames = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names.join(''))

/** e.g. "GRS, ISCC PLUS and SCS Global" */
export const recyclingCertificationNames = listNames(recyclingCertifications.map((c) => c.short))

/** Qualifier for "first vertical line" claims where it sits in a footnote, as on the home page. */
export const firstLineFootnote = 'To our knowledge, the first vertical extrusion line built for silicone cable.'

export const companyStats = [
  { value: String(site.foundingYear), label: 'founded in Singapore and Malaysia' },
  { value: '20+', label: 'patents, granted or pending' },
  { value: '1st', label: 'vertical silicone cable extrusion line in the world, to our knowledge' },
  { value: String(formalCertifications.length), label: 'international certifications' },
]

export const patentsSummary =
  'MoMixx holds more than 20 patents, granted or pending; most are granted. They cover machines, manufacturing processes and silicone formulations. Among them are our high-speed vertical extrusion line for liquid silicone, an automated cable-coating system, an anti-stick coating and a process for moulding liquid silicone in several colours at once.'

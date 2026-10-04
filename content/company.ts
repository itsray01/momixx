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
    issuer: 'Accredited certification body',
    schemeOwner: 'Textile Exchange',
    covers: 'Recycled content, chain of custody, and social, environmental and chemical requirements',
    plain: 'Independent audits check our recycled-content claims and the chain of custody from collected waste to finished silicone, along with social, environmental and chemical rules.',
    year: 2024,
    group: 'recycling',
  },
  {
    id: 'iscc-plus',
    name: 'ISCC PLUS',
    short: 'ISCC PLUS',
    issuer: 'Accredited certification body',
    schemeOwner: 'International Sustainability & Carbon Certification (ISCC)',
    covers: 'Chain of custody of recycled and circular raw materials, including mass balance',
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
    issuer: 'Accredited certification body',
    schemeOwner: 'International Organization for Standardization (ISO)',
    covers: 'Quality management system, Batu Kawan, Penang factory',
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

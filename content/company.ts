// Company story, milestones and certifications.

export const milestones: Array<{ year: number; items: string[] }> = [
  { year: 2018, items: ['Research and production centre opened in Malaysia', 'Developed our first fire-safe solid silicone'] },
  { year: 2019, items: ['A leading smartphone brand approved our fire-safe silicone for its charging cables'] },
  { year: 2020, items: ['Developed fire-safe liquid silicone', 'Began building our upright cable machine'] },
  { year: 2021, items: ['A leading smartphone brand approved our liquid silicone for its data cables', 'First upright cable machine installed'] },
  { year: 2022, items: ['Second factory opened for large-volume production', 'Twice as many upright cable machines installed'] },
  {
    year: 2023,
    items: [
      'Second factory approved for large-volume production',
      'Another data-cable approval from a leading smartphone brand',
      'More recycled silicone production',
      'Developed a fire-safe silicone that sets at lower heat, for a project free of “forever chemicals”',
    ],
  },
  {
    year: 2024,
    items: [
      'Began making that lower-heat silicone in volume',
      'Recycled silicone factory certified to the Global Recycled Standard (GRS)',
      'Developed materials that combine silicone and bio-leather',
    ],
  },
  {
    year: 2025,
    items: [
      'Penang factory expanded, with a larger research team',
      'Began making medical devices for other companies',
      'ISCC PLUS certification, which traces recycled materials through the supply chain',
    ],
  },
  {
    year: 2026,
    items: [
      'Began making liquid silicone in volume in Penang for South-East Asian customers',
      'Penang factory certified to ISO 13485, the medical-device quality standard',
      'Began making high-precision parts for the medical and chip-making industries',
    ],
  },
]

export type Certification = {
  id: string
  name: string
  short: string
  issuer: string
  covers: string
  plain: string
  year?: number
  group: 'recycling' | 'quality'
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
    issuer: 'Textile Exchange',
    covers: 'Recycled content, chain of custody, social and environmental practices',
    plain: 'Verifies that our recycled silicone really contains recycled material, and tracks it at every step from source to product.',
    year: 2024,
    group: 'recycling',
  },
  {
    id: 'iscc-plus',
    name: 'ISCC PLUS',
    short: 'ISCC PLUS',
    issuer: 'International Sustainability & Carbon Certification',
    covers: 'Traceability of recycled and circular raw materials through the supply chain',
    plain: 'An international system that follows recycled materials through every company in the supply chain, so customers can trust the claim.',
    year: 2025,
    group: 'recycling',
  },
  {
    id: 'scs',
    name: 'SCS Recycled Content Certification',
    short: 'SCS Global',
    issuer: 'SCS Global Services',
    covers: 'Independent verification of recycled-content claims',
    plain: 'An independent auditor confirms the percentage of recycled content in our recycled silicone.',
    group: 'recycling',
  },
  {
    id: 'carbon',
    name: 'Carbon Footprint Validation',
    short: 'Carbon footprint',
    issuer: 'Third-party validation',
    covers: 'Product carbon footprint',
    plain: 'The carbon footprint of our silicone has been independently validated.',
    group: 'recycling',
  },
  {
    id: 'iso-13485',
    name: 'ISO 13485 Medical Devices Quality Management',
    short: 'ISO 13485',
    issuer: 'International Organization for Standardization',
    covers: 'Penang Batu Kawan plant',
    plain: 'The international quality standard for making medical devices and their components.',
    year: 2026,
    group: 'quality',
  },
]

export const companyStats = [
  { value: '2018', label: 'founded in Singapore and Malaysia' },
  { value: '20+', label: 'patents granted or pending' },
  { value: '1st', label: 'upright silicone cable machine in the world' },
  { value: '4', label: 'international certifications' },
]

export const patentsSummary =
  'Our team holds more than 20 patents, most granted and some still being reviewed. They cover machines, ways of making things and silicone recipes. Among them are our fast, upright cable machine, an automatic cable-coating system, a non-stick coating and a way to mould silicone in several colours at once.'

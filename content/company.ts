// Company story, milestones and certifications.

export const milestones: Array<{ year: number; items: string[] }> = [
  { year: 2018, items: ['Silicone R&D and production centre set up in Malaysia', 'Development of fire-retardant solid silicone (HCR)'] },
  { year: 2019, items: ['Fire-retardant power-cable silicone qualified by a leading smartphone brand'] },
  { year: 2020, items: ['Development of fire-retardant liquid silicone (LSR)', 'Development of the vertical extrusion machine'] },
  { year: 2021, items: ['Fire-retardant LSR data-cable silicone qualified by a leading smartphone brand', 'First vertical extrusion machine installed'] },
  { year: 2022, items: ['Second manufacturing facility set up for large-volume production', 'Vertical extrusion machine installations doubled'] },
  {
    year: 2023,
    items: [
      'Second facility qualified for large-volume production',
      'Further LSR data-cable qualification with a leading smartphone brand',
      'Production expanded for recycled silicone',
      'Low-temperature fire-retardant LSR developed for a PFAS-free project',
    ],
  },
  {
    year: 2024,
    items: [
      'Mass production of low-temperature LSR for a PFAS-free project',
      'Recycled silicone facility certified to the Global Recycled Standard (GRS)',
      'Development of silicone and bio-leather materials',
    ],
  },
  {
    year: 2025,
    items: [
      'Penang Batu Kawan plant expanded with in-depth R&D',
      'Entry into medical device OEM manufacturing',
      'ISCC PLUS certification for supply-chain traceability',
    ],
  },
  {
    year: 2026,
    items: [
      'Mass production of LSR at Penang Batu Kawan to meet ASEAN demand',
      'ISO 13485 certification for Penang Batu Kawan plant',
      'Expansion into high-precision components for medical and semiconductor',
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
    plain: 'An international system that follows circular and recycled materials through complex supply chains so customers can trust the claim.',
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
  { value: '1st', label: 'vertical silicone data-cable extrusion line in the world' },
  { value: '4', label: 'international certifications' },
]

export const patentsSummary =
  'Our team holds more than 20 patents, most granted and some under review. They cover machines, manufacturing processes and material recipes, including the high-speed liquid-silicone vertical extrusion machine, an automated cable-coating system, an anti-stick coating and a multi-colour liquid-silicone moulding process.'

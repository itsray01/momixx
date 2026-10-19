// Pages added to follow the site map (Who we are / Green / Markets / Products).
// Each page is a short intro and a list of sections, one per item in the site map,
// rendered by components/TopicPage.tsx at the page's `path`.
//
// Sections marked `holding: true` carry general holding copy until MoMixx supplies
// the detail; they show a small "Details to follow" label. Replace the body and
// remove `holding` when the real content arrives.
//
// Claims rules: no figures, customers or certifications here that are not already
// approved elsewhere on the site. Holding copy describes the technology in general
// terms and does not claim MoMixx performance.

import type { ModelName } from '@/components/three/modelNames'
import { illustrations, type Picture } from './illustrations'

export type TopicSection = {
  /** Anchor on the page, e.g. /products/conductive#charging-ports */
  id: string
  title: string
  body: string[]
  /** Short list under the text. */
  points?: string[]
  /** Material grades to list from content/products.ts, by model code (e.g. 'M4'). */
  grades?: string[]
  /** Products to link, by slug. */
  products?: string[]
  links?: Array<{ href: string; label: string }>
  holding?: boolean
}

export type Topic = {
  path: string
  /** Breadcrumb trail above the title (the page itself is added last). */
  parent: { href: string; label: string }
  label: string
  eyebrow: string
  /** Page heading; *asterisks* mark the serif accent. */
  title: string
  intro: string
  seoTitle: string
  description: string
  render: ModelName
  /** An AI illustration shown at the top of the page. */
  picture?: Picture
  sections: TopicSection[]
  related?: Array<{ href: string; label: string }>
  cta?: { title: string; body: string }
}

const products = { href: '/products', label: 'Products' }
const green = { href: '/sustainability', label: 'Green' }

export const topics: Topic[] = [
  // ───────────────────────────── Products: silicone materials ─────────────────────────────
  {
    path: '/products/momixx',
    parent: products,
    label: 'MoMixx grades',
    eyebrow: 'Silicone materials',
    title: 'MoMixx *premium grades*',
    intro:
      'Our premium silicone range, each grade engineered for one job: flame-retardant cable jackets, PFAS-free straps and seals, high-temperature EV cables, self-bonding cases and waterproof seals.',
    seoTitle: 'MoMixx premium silicone grades and specifications',
    description: 'The MoMixx premium silicone range: flame-retardant, PFAS-free, high-temperature, self-bonding and sealing grades, with UL information and specifications.',
    render: 'samples',
    sections: [
      {
        id: 'premium-products',
        title: 'Premium products',
        body: ['Five families, each named for its use. Every grade is available in liquid (LSR) or solid (HCR) form, or both, and can be supplied with recycled content on request.'],
        products: ['momixx-mm', 'momixx-high-density', 'momixx-move', 'momixx-procase', 'momixx-seal'],
      },
      {
        id: 'ul',
        title: 'UL',
        body: [
          'MM grades are designed for cables that pass the UL VW-1 flame test, which is carried out on the finished cable.',
          'Details of the UL recognition for each grade will be listed here.',
        ],
        products: ['momixx-mm'],
        holding: true,
      },
      {
        id: 'specification',
        title: 'Specification',
        body: ['Every grade in the range, with its form and main property. Datasheets are available on request.'],
        grades: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16'],
      },
    ],
    related: [
      { href: '/recycled-silicone', label: 'Recycled silicone' },
      { href: '/products/momixx-high-density', label: 'PFAS-free silicone (MHD)' },
    ],
  },
  {
    path: '/products/cost-effective',
    parent: products,
    label: 'Cost-effective grades',
    eyebrow: 'Silicone materials',
    title: 'Cost-effective *silicone*',
    intro: 'Silicone grades for applications where performance must be matched to budget: power cables and flexible cables made in high volume.',
    seoTitle: 'Cost-effective silicone for power and flexible cables',
    description: 'MoMixx cost-effective silicone grades for power cables and flexible cables.',
    render: 'compound',
    sections: [
      {
        id: 'power',
        title: 'Power',
        body: ['Silicone for power cords and power cables, where heat resistance and flame retardancy matter most.'],
        holding: true,
      },
      {
        id: 'flexible',
        title: 'Flexible',
        body: ['Soft silicone for cables that bend and move in use, from appliance leads to cables inside moving equipment.'],
        holding: true,
      },
    ],
    related: [{ href: '/products/momixx', label: 'MoMixx premium grades' }],
  },
  {
    path: '/products/high-strength',
    parent: products,
    label: 'High-strength grades',
    eyebrow: 'Silicone materials',
    title: 'High-strength *silicone*',
    intro: 'Silicone with high tensile strength (how hard it can be pulled before it breaks), for parts and cable jackets that are stretched, pulled or handled hard.',
    seoTitle: 'High tensile strength silicone grades',
    description: 'MoMixx high-strength silicone: flame-retardant grades with high tensile strength, in solid (HCR) and liquid (LSR) form.',
    render: 'compound',
    sections: [
      {
        id: 'grades',
        title: 'High-strength grades',
        body: ['Two of our flame-retardant cable grades combine flame retardancy with high tensile strength.'],
        grades: ['M4', 'M7'],
        products: ['momixx-mm'],
      },
      {
        id: 'applications',
        title: 'Where it is used',
        body: ['Cable jackets that are pulled during assembly and use, and moulded parts that must resist tearing.'],
        holding: true,
      },
    ],
  },
  {
    path: '/products/magnetic',
    parent: products,
    label: 'Magnetic grades',
    eyebrow: 'Silicone materials',
    title: 'Magnetic *silicone*',
    intro: 'Silicone filled with magnetic particles, so a soft, flexible part can hold to metal or to itself: magnetic cable organisers, closures and accessories.',
    seoTitle: 'Magnetic silicone grades (HCR and LSR)',
    description: 'MoMixx magnetic silicone in solid (HCR) and liquid (LSR) form, for magnetic cables, closures and accessories.',
    render: 'data-cable',
    picture: illustrations.magneticCoil,
    sections: [
      {
        id: 'grades',
        title: 'Magnetic grades',
        body: ['Our magnetic grades are part of the MM series, in solid and liquid form.'],
        grades: ['M11', 'M12'],
        products: ['momixx-mm'],
      },
      {
        id: 'applications',
        title: 'Where it is used',
        body: ['Magnetic cables that coil and hold neatly, magnetic straps and closures, and accessories that attach to devices.'],
        holding: true,
      },
    ],
  },
  {
    path: '/products/conductive',
    parent: products,
    label: 'Conductive grades',
    eyebrow: 'Silicone materials',
    title: 'Conductive *silicone*',
    intro: 'Silicone that carries electric current or dissipates static while staying soft and flexible.',
    seoTitle: 'Conductive silicone for charging ports and interiors',
    description: 'MoMixx conductive silicone for charging ports and vehicle interiors.',
    render: 'compound',
    picture: illustrations.conductiveParts,
    sections: [
      {
        id: 'charging-ports',
        title: 'Charging ports',
        body: ['Conductive silicone can seal and shield a charging port while keeping an electrical path where one is needed.'],
        holding: true,
      },
      {
        id: 'interiors',
        title: 'Interiors',
        body: ['Soft conductive surfaces for controls and touch points inside vehicles and devices.'],
        holding: true,
      },
    ],
    related: [{ href: '/applications/electric-vehicles', label: 'Automotive' }],
  },

  // ───────────────────────────── Products: other ranges ─────────────────────────────
  {
    path: '/products/coatings',
    parent: products,
    label: 'Silicone coatings',
    eyebrow: 'Silicone-based coatings',
    title: 'Silicone-based *coatings*',
    intro: 'Thin silicone coatings that give a surface a soft feel, keep dust off and resist stains, applied to cables, cases and other parts.',
    seoTitle: 'Silicone-based coatings: thin-wall and flexible',
    description: 'MoMixx silicone-based coatings: thin-wall and flexible coatings for cables, cases and parts.',
    render: 'coated-cable',
    picture: illustrations.coatedCable,
    sections: [
      {
        id: 'thin-wall',
        title: 'Thin wall',
        body: ['A thin, even coating that adds a finish without adding bulk.'],
        holding: true,
      },
      {
        id: 'flexible',
        title: 'Flexible',
        body: ['Coatings that bend with the part beneath them, for cables and soft products.'],
        holding: true,
      },
      {
        id: 'how-applied',
        title: 'How we apply it',
        body: ['Our dip-coating machine applies a thin, precisely controlled coating. Compared with spray coating, it releases up to 20 times less volatile organic compounds (VOCs, the solvent fumes that pollute air).'],
        links: [{ href: '/products/machines#dip-coating-machine', label: 'Dip-coating machine' }],
      },
    ],
  },
  {
    path: '/products/yarn-leather',
    parent: products,
    label: 'Yarn & leather',
    eyebrow: 'Yarn and leather',
    title: 'Silicone *yarn and leather*',
    intro: 'Silicone for textiles: yarn coated with silicone, and materials that combine silicone with bio-leather.',
    seoTitle: 'Silicone yarn and silicone leather',
    description: 'MoMixx silicone yarn, and materials that combine silicone with bio-leather, for fashion and textiles.',
    render: 'watchband',
    picture: illustrations.yarnLeather,
    sections: [
      {
        id: 'silicone-yarn',
        title: 'Silicone yarn',
        body: ['Yarn coated with silicone, for fabrics that are soft, durable and easy to clean.'],
        holding: true,
      },
      {
        id: 'silio',
        title: 'Silio',
        body: ['In 2024 we developed materials that combine silicone and bio-leather. Details of the Silio range will be listed here.'],
        holding: true,
      },
    ],
    related: [{ href: '/applications/fashion', label: 'Fashion' }],
  },
  {
    path: '/products/precision-components',
    parent: products,
    label: 'Precision components',
    eyebrow: 'Precision components',
    title: 'Precision *components*',
    intro: 'Finished silicone parts, moulded to tight tolerances at our factories, including our ISO 13485-certified factory in Batu Kawan, Penang.',
    seoTitle: 'Precision silicone components: watch bands, seals, thermal pads',
    description: 'MoMixx precision silicone components: double-shot watch bands, seals and thermal pads.',
    render: 'oem',
    picture: illustrations.thermalPads,
    sections: [
      {
        id: 'watch-bands',
        title: 'Watch bands (double shot)',
        body: ['Double-shot moulding forms two materials in one cycle, such as two colours of silicone, or silicone over a rigid core, for straps with a premium finish.'],
        products: ['momixx-high-density'],
        holding: true,
      },
      {
        id: 'seals',
        title: 'Seals',
        body: ['Gaskets and seals that keep water and dust out of electronics, made from our MMS sealing silicone.'],
        products: ['momixx-seal'],
      },
      {
        id: 'thermal-pads',
        title: 'Thermal pads',
        body: ['Soft silicone pads that fill the gap between a hot component and its heat sink, carrying heat away.'],
        holding: true,
      },
      {
        id: 'contract-manufacturing',
        title: 'Made to order',
        body: ['We also develop and make finished parts for other brands, and parts for medical devices and chip-making equipment.'],
        links: [
          { href: '/products/manufacturing#odm-oem', label: 'Contract manufacturing' },
          { href: '/products/manufacturing#medical-precision-components', label: 'Medical and precision parts' },
        ],
      },
    ],
  },
  {
    path: '/products/carbon-footprint',
    parent: products,
    label: 'Carbon footprint',
    eyebrow: 'Carbon footprint',
    title: 'Carbon footprint *data*',
    intro: 'How we measure the carbon footprint of our silicone, and the reports we can share with customers.',
    seoTitle: 'Silicone carbon footprint system and reports',
    description: 'The MoMixx carbon footprint system and product and process reports for customers.',
    render: 'recycle',
    sections: [
      {
        id: 'system',
        title: 'System',
        body: ['We calculate the greenhouse gases released in making our silicone, and an independent third party has checked the calculation.'],
        links: [{ href: '/carbon-footprint', label: 'Our carbon footprint' }],
      },
      {
        id: 'report',
        title: 'Product and process report',
        body: ['Carbon footprint reports for our products and processes. The validation statement, with its scope and method, is available on request.'],
        holding: true,
      },
    ],
  },

  // ───────────────────────────── Green ─────────────────────────────
  {
    path: '/carbon-footprint',
    parent: green,
    label: 'Carbon footprint',
    eyebrow: 'Green',
    title: 'Our carbon *footprint*',
    intro: 'We calculate the greenhouse gases released in making our silicone, an independent third party has checked the calculation, and we work to bring the figure down.',
    seoTitle: 'Carbon footprint of MoMixx silicone',
    description: 'How MoMixx measures and reduces the carbon footprint of its silicone: an independently checked calculation, recycled silicone, solar power and energy-saving machines.',
    render: 'recycle',
    sections: [
      {
        id: 'how-we-started',
        title: 'How we started',
        body: ['Making new silicon is the largest source of emissions in producing new silicone. Recycled silicone, rebuilt from scrap, avoids that step.'],
        holding: true,
      },
      {
        id: 'what-we-do',
        title: 'What we do',
        body: ['We cut our footprint with recycled raw material, cleaner power and machines designed to use less energy.'],
        points: [
          'Recycled silicone, rebuilt from scrap, avoids making new silicon',
          'Solar panels at our factories supply part of our electricity',
          'Our curing ovens use about 30% less electricity than a standard curing oven',
          'Our mixer uses the roughly 4% of liquid silicone that standard mixers leave in each bucket',
          'Dip coating releases up to 20 times less VOCs (solvent fumes) than spray coating',
        ],
      },
      {
        id: 'control-and-monitor',
        title: 'How we control and monitor',
        body: ['An independent third party has checked how we calculate the carbon footprint of our silicone. The validation statement, with its scope and method, is available on request.'],
        links: [{ href: '/sustainability#certificates', label: 'Certifications and validation' }],
      },
      {
        id: 'what-we-deliver',
        title: 'What we deliver',
        body: ['Carbon footprint information for the silicone we supply, for customers reporting on their own supply chains.'],
        links: [{ href: '/products/carbon-footprint', label: 'Carbon footprint reports' }],
        holding: true,
      },
      {
        id: 'next',
        title: 'Next big thing',
        body: ['What comes next for our carbon work will be shared here.'],
        holding: true,
      },
    ],
    related: [
      { href: '/recycled-silicone', label: 'Recycled silicone' },
      { href: '/insights/silicone-carbon-footprint', label: 'Silicone’s carbon footprint, explained' },
    ],
    cta: { title: 'Carbon *documentation*', body: 'Request our carbon validation statement or carbon footprint information for your order.' },
  },
]

/**
 * The Products part of the site map, in three groups. Feeds the Products menu
 * and the sections of the /products overview.
 */
export const productGroups: Array<{
  id: string
  title: string
  intro: string
  links: Array<{ href: string; label: string; desc: string; model: ModelName }>
}> = [
  {
    id: 'materials',
    title: 'Silicone materials',
    intro: 'Silicone compounds, each engineered for a specific purpose, from certified recycled silicone to flame-retardant, magnetic, conductive and PFAS-free grades.',
    links: [
      { href: '/recycled-silicone', label: 'Recycled silicone', desc: 'Certified, and performs like new', model: 'recycle' },
      { href: '/products/momixx', label: 'MoMixx premium grades', desc: 'Premium products, UL and specifications', model: 'samples' },
      { href: '/products/cost-effective', label: 'Cost-effective grades', desc: 'Power and flexible cables', model: 'compound' },
      { href: '/products/high-strength', label: 'High strength', desc: 'High tensile strength grades', model: 'crimson' },
      { href: '/products/magnetic', label: 'Magnetic', desc: 'Magnetic silicone grades', model: 'data-cable' },
      { href: '/products/conductive', label: 'Conductive', desc: 'For charging ports and interiors', model: 'seal' },
      { href: '/products/momixx-high-density', label: 'PFAS-free', desc: 'A silicone alternative to FKM', model: 'watchband' },
    ],
  },
  {
    id: 'coatings',
    title: 'Coatings and textiles',
    intro: 'Silicone as a finish and as a fabric: thin coatings for cables and cases, silicone yarn, and silicone combined with bio-leather.',
    links: [
      { href: '/products/coatings', label: 'Silicone-based coatings', desc: 'Thin-wall and flexible', model: 'coated-cable' },
      { href: '/products/yarn-leather', label: 'Yarn and leather', desc: 'Silicone yarn and Silio', model: 'cable-hero' },
    ],
  },
  {
    id: 'components',
    title: 'Components and automation',
    intro: 'Finished parts made to tight tolerances, the machines we design and build, and carbon footprint reporting.',
    links: [
      { href: '/products/precision-components', label: 'Precision components', desc: 'Watch bands, seals and thermal pads', model: 'oem' },
      { href: '/products/manufacturing', label: 'Contract manufacturing', desc: 'Parts made to order, including medical', model: 'medical' },
      { href: '/products/machines', label: 'Automation', desc: 'Extrusion, mixer, oven, LCM and tooling', model: 'extruder-vertical' },
      { href: '/products/carbon-footprint', label: 'Carbon footprint', desc: 'System, and product and process reports', model: 'sand' },
    ],
  },
]

export function getTopic(path: string) {
  const t = topics.find((x) => x.path === path)
  if (!t) throw new Error(`No topic page for ${path}`)
  return t
}

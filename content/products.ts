// Product catalogue. Each entry becomes its own page at /products/<slug>,
// its own tab in the product navigation, and an entry in the sitemap.
//
// To add a product: copy an entry, give it a unique slug, and fill in the
// fields. Only `slug`, `name`, `category`, `tagline` and `summary` are required.
//
// Claims rules: temperatures, twist counts and other test figures come from
// MoMixx's own testing and must say so. Spec labels on the extrusion lines must
// match the keys in components/three/extruderParts.ts (specPart).

import type { ModelName } from '@/components/three/modelNames'
import { recyclingCertificationNames, recyclingCertifications } from './company'

export type ProductCategory = 'materials' | 'equipment' | 'services'

export const categoryLabels: Record<ProductCategory, string> = {
  materials: 'Materials',
  equipment: 'Machines',
  services: 'Services',
}

export const categoryIntros: Record<ProductCategory, string> = {
  materials:
    'Silicone compounds, each made for a specific job: stopping a cable from burning, sealing out water, bonding to plastic without a primer, or replacing fluorinated rubbers that contain PFAS (“forever chemicals”). We also make certified recycled silicone and a clear PCTG plastic that complies with US FDA food-contact rules.',
  equipment:
    'Machines we design and build ourselves to make silicone products faster, with less energy and less waste. We use them in our own factories and sell them to customers.',
  services:
    'We develop and make finished parts for other brands, from colour-matched consumer products to parts for medical devices and semiconductor equipment.',
}

export type Stat = { value: string; label: string }

export type Comparison = {
  title: string
  note?: string
  otherLabel: string
  rows: Array<{
    metric: string
    unit: string
    momixx: number
    other: number
    momixxText?: string
    otherText?: string
    better: 'higher' | 'lower'
    /** Shown instead of the calculated advantage line. */
    advantageText?: string
  }>
}

export type Product = {
  slug: string
  name: string
  tabLabel?: string
  category: ProductCategory
  tagline: string
  summary: string
  benefits?: Array<{ title: string; body: string }>
  /** A short numbered flow, shown in a "How it works" section after the overview. */
  steps?: Array<{ title: string; body: string }>
  uses?: string[]
  stats?: Stat[]
  models?: Array<{ model: string; type: string; properties: string }>
  processing?: string
  specs?: Array<{ label: string; value: string }>
  comparison?: Comparison
  applications?: string[]
  /** Which 3D model represents this product (see components/three/models.tsx). */
  illustration?: ModelName
  /** A rotating clip in /public/videos (name without extension), shown instead of the still render. */
  video?: string
  /** Path under /public, e.g. /images/products/vertical-extruder.jpg */
  image?: string
  /** A real product photo shown in the overview, e.g. from the original site. */
  photo?: { src: string; alt: string; width: number; height: number; caption: string }
  recycledOption?: boolean
}

export const products: Product[] = [
  // ───────────────────────────── Materials ─────────────────────────────
  {
    slug: 'momixx-mm',
    name: 'MoMixx (MM) Series',
    tabLabel: 'MM · Cables',
    category: 'materials',
    tagline: 'Flame-retardant silicone for phone and laptop cables.',
    summary:
      'Our flagship cable silicone. It forms the soft outer jacket of USB-C and charging cables. Compared with TPE, the thermoplastic most cable jackets use, it is softer and more flexible, and in MoMixx testing it withstood twice as many twisting cycles and much higher temperatures. It is flame-retardant: it stops burning once the flame is removed.',
    benefits: [
      {
        title: 'Flame-retardant',
        body: 'Stops burning once the flame is removed. MM grades are designed for cables that pass the UL VW-1 flame test, which is carried out on the finished cable.',
      },
      {
        title: 'Lasts longer',
        body: 'In MoMixx twisting tests, MM cable jackets lasted about twice as long as a standard TPE cable.',
      },
      {
        title: 'Soft and supple',
        body: 'Low hardness and almost no “memory” (it does not hold a bent shape), so cables lie flat instead of kinking.',
      },
    ],
    uses: ['USB-C data cables', 'Phone and laptop chargers', 'Network cables', 'Noise-reducing and magnetic parts'],
    stats: [
      { value: '10,000', label: 'twisting cycles withstood in MoMixx testing' },
      { value: '250 °C', label: 'highest temperature withstood in MoMixx testing' },
      { value: 'VW-1', label: 'cable flame test MM grades are designed to pass' },
    ],
    models: [
      { model: 'M3', type: 'HCR', properties: 'Flame-retardant' },
      { model: 'M4', type: 'HCR', properties: 'Flame-retardant, high tensile strength' },
      { model: 'M5', type: 'LSR', properties: 'Flame-retardant' },
      { model: 'M6', type: 'LSR', properties: 'Highly flame-retardant' },
      { model: 'M7', type: 'LSR', properties: 'Flame-retardant, high tensile strength' },
      { model: 'M8', type: 'LSR', properties: 'Flame-retardant, cures (sets) at a lower temperature' },
      { model: 'M9', type: 'LSR', properties: 'Flame-retardant, with a bitter additive that discourages chewing' },
      { model: 'M10', type: 'HCR', properties: 'Noise-reducing' },
      { model: 'M11', type: 'HCR', properties: 'Magnetic' },
      { model: 'M12', type: 'LSR', properties: 'Magnetic' },
    ],
    processing: 'Extrusion (for cable jackets), injection moulding or compression moulding',
    comparison: {
      title: 'MM silicone vs a standard TPE cable',
      note: 'MoMixx test results, not rated operating temperatures. The heat figures are the highest temperatures each material withstood in our tests. Catalogue ratings for continuous use are lower: about 180 °C for a standard silicone cable and 105 °C for a TPE cable (LAPP ÖLFLEX catalogue). In a long heat-ageing test, MM silicone passed 60 days at 158 °C; the TPE reference passed 7 days at 121 °C.',
      otherLabel: 'Standard TPE',
      rows: [
        { metric: 'Twisting test', unit: 'cycles', momixx: 10000, other: 5000, better: 'higher' },
        { metric: 'Elongation (stretch before breaking)', unit: '%', momixx: 400, other: 250, momixxText: '>400', otherText: '>250', better: 'higher' },
        { metric: 'Highest temperature withstood in testing', unit: '°C', momixx: 250, other: 170, better: 'higher' },
      ],
    },
    applications: ['consumer-electronics', 'ai-data-centres'],
    illustration: 'data-cable',
    photo: { src: '/images/products/momixx-mm-cable.webp', alt: 'USB-C data cable with a white silicone jacket', width: 410, height: 318, caption: 'Silicone data cable' },
    recycledOption: true,
  },
  {
    slug: 'momixx-high-density',
    name: 'MoMixx High Density (MHD)',
    tabLabel: 'MHD · PFAS-free',
    category: 'materials',
    tagline: 'A PFAS-free silicone alternative to fluorinated rubber (FKM).',
    summary:
      'Premium watch straps and some car parts are often made from fluorinated rubber (FKM). FKM is a PFAS, one of the “forever chemicals” the EU is working to restrict. MHD is a dense, silky silicone with a similar look, feel and toughness, made without fluorine.',
    benefits: [
      { title: 'PFAS-free', body: 'Made without fluorine, so it is not a PFAS under the definition used in the EU restriction proposal.' },
      { title: 'Premium feel', body: 'A soft, smooth, dense feel similar to premium FKM watch straps.' },
      {
        title: 'Similar performance',
        body: 'Similar strength and durability to FKM and HNBR rubbers in many uses. FKM still resists fuels and oils better, so check chemical resistance for your application.',
      },
    ],
    uses: [
      'Smartwatch and fitness straps',
      'Seals and cable parts in electric cars, where fuel and oil resistance is not critical',
      'Medical and food-contact parts, subject to testing for each use',
    ],
    stats: [
      { value: 'PFAS-free', label: 'made without fluorine' },
      { value: '2', label: 'forms: liquid (LSR) and solid (HCR)' },
    ],
    models: [
      { model: 'M1', type: 'LSR', properties: 'High density, premium feel' },
      { model: 'M2', type: 'HCR', properties: 'High density, premium feel' },
    ],
    processing: 'Injection or compression moulding',
    applications: ['consumer-electronics', 'electric-vehicles', 'medical'],
    illustration: 'watchband',
  },
  {
    slug: 'momixx-move',
    name: 'MoMixx Move (MV)',
    tabLabel: 'MV · EV',
    category: 'materials',
    tagline: 'Heat-resistant silicone for high-voltage EV cables.',
    summary:
      'Electric cars carry high power through hot, cramped spaces. In MoMixx testing, MV silicone kept working from −60 °C to 250 °C, beyond the roughly 180–200 °C rating typical of standard silicone cable. It is also much softer and more flexible than XLPO, the cross-linked plastic usually used, so cables can be routed through tighter spaces.',
    benefits: [
      { title: 'Wide temperature range', body: 'Stayed flexible from −60 °C to 250 °C in MoMixx testing.' },
      { title: 'Easier to route', body: 'Lower hardness means tighter bends and simpler wiring layouts.' },
      { title: 'Tested beyond normal use', body: 'Tested by MoMixx under conditions harsher than normal electric-car operation.' },
    ],
    uses: ['High-voltage power cables in electric cars', 'Charging cables', 'Battery, motor and inverter wiring'],
    stats: [
      { value: '−60 to 250 °C', label: 'working range in MoMixx testing' },
      { value: '60 days', label: 'heat-ageing test passed at 158 °C' },
    ],
    models: [{ model: 'M13', type: 'HCR', properties: 'High-temperature' }],
    processing: 'Extrusion (for cable jackets)',
    comparison: {
      title: 'MV silicone vs XLPO car-cable plastic',
      note: 'MoMixx test results. Highest temperature is what each material withstood in our tests, not a rated operating temperature. Hardness is the middle of each range on the Shore A scale (lower is softer): MV 65–75, XLPO 85–95. In a long heat-ageing test, MV passed 60 days at 158 °C; the XLPO reference passed 7 days at 136 °C.',
      otherLabel: 'XLPO',
      rows: [
        { metric: 'Highest temperature withstood in testing', unit: '°C', momixx: 250, other: 150, better: 'higher' },
        { metric: 'Hardness, Shore A (lower is more flexible)', unit: 'score', momixx: 70, other: 90, momixxText: '65–75', otherText: '85–95', better: 'lower' },
      ],
    },
    applications: ['electric-vehicles'],
    illustration: 'ev-cable',
  },
  {
    slug: 'momixx-procase',
    name: 'MoMixx ProCase (MPC)',
    tabLabel: 'MPC · Cases',
    category: 'materials',
    tagline: 'Self-bonding silicone for phone and tablet cases.',
    summary:
      'Silicone normally needs a chemical primer before it will bond to plastic. MPC bonds to the hard plastic shell of a protective case by itself. That removes a production step, along with its chemicals and a common source of defects.',
    benefits: [
      { title: 'No primer', body: 'Bonds directly to plastic, removing a manufacturing step.' },
      { title: 'Cleaner process', body: 'Fewer chemicals and less handling on the production line.' },
      { title: 'Tough finish', body: 'Works with our dip coating for a smooth, scratch-resistant surface.' },
    ],
    uses: ['Phone cases', 'Tablet cases', 'Products that combine silicone and plastic (over-moulding)'],
    models: [{ model: 'M14', type: 'LSR', properties: 'Self-bonding to plastic' }],
    processing: 'Injection or compression moulding',
    applications: ['consumer-electronics'],
    illustration: 'phone-case',
  },
  {
    slug: 'momixx-seal',
    name: 'MoMixx Seal (MMS)',
    tabLabel: 'MMS · Seals',
    category: 'materials',
    tagline: 'Sealing silicone for waterproof electronics.',
    summary:
      'MMS silicone is made for the gaskets and seals that keep water and dust out of electronics. It is designed for seals in devices rated IP68: dust-tight and protected against continuous immersion in water. The IP rating applies to the finished device, which is tested as a whole.',
    uses: ['Device gaskets', 'Connector seals', 'Outdoor and industrial enclosures'],
    stats: [{ value: 'IP68', label: 'device rating MMS seals are designed for' }],
    models: [
      { model: 'M15', type: 'LSR', properties: 'Waterproof sealing' },
      { model: 'M16', type: 'HCR', properties: 'Waterproof sealing' },
    ],
    processing: 'Injection or compression moulding',
    applications: ['consumer-electronics', 'robotics', 'ai-data-centres'],
    illustration: 'seal',
  },
  {
    slug: 'selix',
    name: 'Selix',
    category: 'materials',
    tagline: 'Self-bonding and high-density silicone grades.',
    summary:
      'Selix grades combine two of our technologies: silicone that bonds to other materials without a primer, and high-density silicone with a premium feel. They are used for moulded parts.',
    models: [
      { model: 'S2', type: 'LSR', properties: 'Self-bonding' },
      { model: 'S3', type: 'LSR', properties: 'High density, premium feel' },
    ],
    processing: 'Injection or compression moulding',
    applications: ['consumer-electronics', 'medical'],
    illustration: 'compound',
  },
  {
    slug: 'crimson',
    name: 'Crimson',
    category: 'materials',
    tagline: 'High-density and flame-retardant grades in liquid and solid form.',
    summary:
      'Crimson offers our high-density and flame-retardant silicones in both liquid (LSR) and solid (HCR) form, so customers can choose the grade that suits their moulding or extrusion process.',
    models: [
      { model: 'C1', type: 'HCR', properties: 'High density, premium feel' },
      { model: 'C2', type: 'LSR', properties: 'High density, premium feel' },
      { model: 'C3', type: 'HCR', properties: 'Flame-retardant' },
      { model: 'C4', type: 'LSR', properties: 'Flame-retardant' },
    ],
    processing: 'Injection moulding, compression moulding or extrusion',
    applications: ['consumer-electronics', 'electric-vehicles'],
    illustration: 'compound',
  },
  {
    slug: 'recycled-silicone',
    name: 'Recycled Silicone',
    tabLabel: 'Recycled',
    category: 'materials',
    tagline: 'Certified recycled silicone that performs like new.',
    summary: `We turn factory offcuts (post-industrial, PIR) and used silicone products (post-consumer, PCR) back into new, high-quality silicone. Because we recycle chemically, the result performs like new material. Our recycled content is certified under ${recyclingCertificationNames}, with certified chain-of-custody records from collected waste to finished silicone.`,
    benefits: [
      { title: 'Performs like new', body: 'Rebuilt from its basic building blocks, so it performs like new silicone, not a ground-up filler.' },
      {
        title: 'Certified chain of custody',
        body: 'Independent audits cover our recycled content from collected waste to finished silicone. Ask us which chain-of-custody model applies to your order.',
      },
      {
        title: 'Lower footprint',
        body: 'Keeps silicone out of landfill and skips the energy-intensive step of making new silicon. Published studies show lower emissions than new silicone.',
      },
    ],
    uses: ['Cables with recycled content', 'Products with recycled-content targets', 'Any MoMixx silicone, on request'],
    stats: [
      { value: String(recyclingCertifications.length), label: 'recycled-content certifications' },
      { value: '5', label: 'steps from scrap to new silicone' },
    ],
    applications: ['consumer-electronics', 'electric-vehicles'],
    illustration: 'recycle',
  },
  {
    slug: 'pctg',
    name: 'PCTG Clear Plastic',
    tabLabel: 'PCTG',
    category: 'materials',
    tagline: 'A crystal-clear, tough co-polyester for food-contact products.',
    summary:
      'As well as silicone, we supply a tailored PCTG co-polyester: a glass-clear, tough plastic that resists many chemicals and complies with US FDA food-contact regulations.',
    uses: ['Water and sports bottles', 'Cosmetic containers', 'Clear housings and containers'],
    stats: [{ value: 'FDA', label: 'compliant for food contact' }],
    processing: 'Injection moulding',
    illustration: 'bottle',
  },

  // ───────────────────────────── Equipment ─────────────────────────────
  {
    slug: 'vertical-extruder',
    name: 'Vertical Extrusion Line',
    tabLabel: 'Vertical Extruder',
    category: 'equipment',
    tagline: 'Our patented vertical line for silicone cable: to our knowledge, the first of its kind.',
    summary:
      'Most silicone cable lines run horizontally and are fed by hand. We developed a vertical line that is automated from mixing the liquid silicone to inspecting the finished cable. It runs at up to 100 metres a minute, and its customers include a Fortune Global 500 company.',
    benefits: [
      { title: 'Fast', body: 'Up to 100 metres a minute, more than three times our horizontal line (30 metres a minute).' },
      {
        title: 'Precise',
        body: 'Over 90% concentricity (how evenly the jacket surrounds the wire), with jackets as thin as 0.30 mm.',
      },
      { title: 'Automated', body: 'Built-in liquid silicone mixing replaces hand-feeding solid silicone from a roll mill.' },
    ],
    stats: [
      { value: '100 m/min', label: 'line speed' },
      { value: '>90%', label: 'concentricity (jacket evenness)' },
      { value: '0.30 mm', label: 'thinnest jacket' },
    ],
    // Labels must match specPart in components/three/extruderParts.ts.
    specs: [
      { label: 'Screw speed', value: 'Up to 35 rpm' },
      { label: 'Thinnest layer', value: '0.30 mm jacket' },
      { label: 'Vacuum', value: 'Up to 70 kPa' },
      { label: 'Speed', value: 'Up to 100 m/min' },
      { label: 'Thickest cable', value: 'Up to 10.0 mm diameter' },
      { label: 'Evenness', value: 'Over 90% concentricity' },
      { label: 'Silicone used', value: 'Feed up to 150 kg/h (without crosshead)' },
    ],
    applications: ['consumer-electronics', 'electric-vehicles'],
    illustration: 'extruder-vertical',
  },
  {
    slug: 'horizontal-extruder',
    name: 'Horizontal Extrusion Line',
    tabLabel: 'Horizontal Extruder',
    category: 'equipment',
    tagline: 'A precise, flexible line for silicone cable jackets.',
    summary:
      'Our horizontal line controls the silicone feed precisely and uses a high-precision crosshead (the head that forms the silicone around the wire) to make cable jackets of very even thickness. Our own team installs and maintains it.',
    steps: [
      { title: 'Feed', body: 'The silicone feed is controlled precisely, at screw speeds of up to 35 rpm.' },
      { title: 'Form', body: 'A high-precision crosshead forms the silicone around the wire.' },
      { title: 'Even jacket', body: 'Jackets as thin as 0.30 mm, with over 90% concentricity.' },
      { title: 'Installed and serviced', body: 'Our own team installs and maintains the line.' },
    ],
    stats: [
      { value: '30 m/min', label: 'line speed' },
      { value: '>90%', label: 'concentricity (jacket evenness)' },
    ],
    specs: [
      { label: 'Screw speed', value: 'Up to 35 rpm' },
      { label: 'Vacuum', value: 'Up to 70 kPa' },
      { label: 'Speed', value: 'Up to 30 m/min' },
      { label: 'Thickest cable', value: 'Up to 10.0 mm diameter' },
      { label: 'Evenness', value: 'Over 90% concentricity' },
      { label: 'Thinnest layer', value: '0.30 mm jacket' },
    ],
    applications: ['consumer-electronics'],
    illustration: 'extruder-horizontal',
    video: 'extruder-horizontal',
  },
  {
    slug: 'lsr-mixer',
    name: 'Low-Waste Silicone Mixer',
    tabLabel: 'Mixer',
    category: 'equipment',
    tagline: 'Mixes liquid silicone evenly and empties each bucket.',
    summary:
      'Liquid silicone comes in two parts that must be mixed in equal amounts (1:1). In our experience, standard mixers leave about 4% of each bucket unused. Ours monitors the level closely and keeps pumping until the bucket is empty, then feeds the silicone straight into our vertical extrusion line.',
    steps: [
      { title: 'Two parts', body: 'Liquid silicone arrives as two parts that must be mixed 1:1.' },
      { title: 'Watch the level', body: 'The mixer monitors the level in each bucket closely.' },
      { title: 'Empty the bucket', body: 'It keeps pumping until the bucket is empty. In our experience, standard mixers leave about 4%.' },
      { title: 'Straight to the line', body: 'The mixed silicone feeds straight into our vertical extrusion line.' },
    ],
    stats: [{ value: '~4%', label: 'of each bucket no longer wasted' }],
    applications: ['consumer-electronics'],
    illustration: 'mixer',
    video: 'mixer',
  },
  {
    slug: 'autowinder',
    name: 'Camera-Guided Autowinder',
    tabLabel: 'Autowinder',
    category: 'equipment',
    tagline: 'A camera-guided machine that winds cable evenly onto spools.',
    summary:
      'Cable wound unevenly onto a spool can be stretched or damaged later in production. Our autowinder uses a camera and closed-loop control (continuous automatic correction) to adjust the cable position as it winds, so spools are wound evenly.',
    steps: [
      { title: 'Watch', body: 'A camera follows the cable as it winds onto the spool.' },
      { title: 'Correct', body: 'Closed-loop control adjusts the cable’s position continuously.' },
      { title: 'Even spools', body: 'Spools wound evenly, so the cable isn’t stretched or damaged later in production.' },
    ],
    applications: ['consumer-electronics'],
    illustration: 'winder',
    video: 'winder',
  },
  {
    slug: 'energy-saving-oven',
    name: 'Energy-Saving Curing Oven',
    tabLabel: 'Oven',
    category: 'equipment',
    tagline: 'Uses about 30% less electricity and halves temperature variation.',
    summary:
      'Once silicone is on a cable, it is cured (set) in an oven. Our oven has a smaller heated space and new heating and sensing modules. It uses about 30% less electricity than a standard curing oven and holds its temperature within ±5 °C instead of ±10 °C, so quality is more consistent.',
    stats: [
      { value: '30%', label: 'less electricity than a standard curing oven' },
      { value: '±5 °C', label: 'temperature control (standard: ±10 °C)' },
    ],
    steps: [
      { title: 'Cure', body: 'Once silicone is on the cable, the oven cures (sets) it.' },
      { title: 'Smaller heated space', body: 'Less space to heat, with new heating modules.' },
      { title: 'Sense and adjust', body: 'New sensing modules keep the temperature steady.' },
    ],
    comparison: {
      title: 'Our curing oven against a standard one',
      note: 'Electricity use is shown with a standard curing oven as 100.',
      otherLabel: 'Standard curing oven',
      rows: [
        { metric: 'Electricity use', unit: 'relative', momixx: 70, other: 100, momixxText: '~70', otherText: '100', better: 'lower', advantageText: 'About 30% less electricity' },
        { metric: 'Temperature variation', unit: '±\u00a0°C', momixx: 5, other: 10, momixxText: '±5', otherText: '±10', better: 'lower', advantageText: 'Half the temperature variation' },
      ],
    },
    illustration: 'oven',
    video: 'oven',
  },
  {
    slug: 'dip-coating-machine',
    name: 'Dip-Coating Machine',
    tabLabel: 'Dip Coating',
    category: 'equipment',
    tagline: 'A cleaner way to give silicone a smooth, dust-free finish.',
    summary:
      'Bare silicone attracts dust. Our machine dips cables in a thin, precisely controlled coating that feels soft, resists stains and lasts. Compared with spray coating, it releases up to 20 times less volatile organic compounds (VOCs, the solvent fumes that pollute air).',
    stats: [{ value: 'Up to 20×', label: 'lower VOC emissions than spray coating' }],
    steps: [
      { title: 'Dip', body: 'Cables pass through a thin, precisely controlled coating.' },
      { title: 'Finish', body: 'The coating feels soft, resists stains and keeps dust off.' },
      { title: 'Cleaner air', body: 'Up to 20 times lower VOC emissions than spray coating.' },
    ],
    comparison: {
      title: 'Dip coating against spray coating',
      note: 'VOC emissions are shown with our dip coating as 1.',
      otherLabel: 'Spray coating',
      rows: [{ metric: 'VOC emissions', unit: 'relative', momixx: 1, other: 20, momixxText: '1', otherText: 'up to 20', better: 'lower', advantageText: 'Up to 20× lower VOC emissions' }],
    },
    applications: ['consumer-electronics'],
    illustration: 'coating',
    video: 'coating',
  },

  // ───────────────────────────── Services ─────────────────────────────
  {
    slug: 'odm-oem',
    name: 'Contract Manufacturing',
    tabLabel: 'Contract manufacturing',
    category: 'services',
    tagline: 'From formulation to finished part, under one roof.',
    summary:
      'We develop and make finished silicone parts for other brands (known in the industry as ODM or OEM manufacturing). We match any colour, add properties such as flame retardancy, finish the surface, and produce in large volumes at our factories in Asia.',
    benefits: [
      {
        title: 'Exact colour',
        body: 'Matched to within ΔE94 0.50 of the target colour, a difference most people cannot see, even for vivid or translucent shades.',
      },
      { title: 'Made to measure', body: 'Formulations tuned for flame retardancy, chemical resistance or a particular feel.' },
      { title: 'Finishing', body: 'Dip coating for cables and cases, with an F-grade pencil-hardness surface.' },
    ],
    steps: [
      { title: 'Formulate', body: 'We tune the silicone for the job: flame retardancy, chemical resistance or a particular feel.' },
      { title: 'Match the colour', body: 'Matched to within ΔE94 0.50 of your target, even for vivid or translucent shades.' },
      { title: 'Finish', body: 'Dip coating for cables and cases, with an F-grade pencil-hardness surface.' },
      { title: 'Produce', body: 'Made in large volumes at our factories in Asia.' },
    ],
    uses: ['Phone and computer accessories', 'Wearables', 'Bio-leather and silicone composites'],
    applications: ['consumer-electronics'],
    illustration: 'oem',
  },
  {
    slug: 'medical-precision-components',
    name: 'Medical & Precision Components',
    tabLabel: 'Medical & Precision',
    category: 'services',
    tagline: 'ISO 13485-certified manufacturing for medical and semiconductor parts.',
    summary:
      'Our factory in Batu Kawan, Penang, is certified to ISO 13485, the international quality-management standard for medical-device manufacturing. We have made silicone parts for medical-device makers since 2025, and in 2026 began making high-precision parts for the medical and semiconductor industries.',
    stats: [
      { value: 'ISO 13485', label: 'certified quality system, Batu Kawan, Penang (2026)' },
      { value: '2025', label: 'first silicone parts for medical-device makers' },
    ],
    uses: ['Medical device parts', 'Parts for semiconductor equipment', 'High-purity moulded parts'],
    applications: ['medical', 'semiconductor'],
    illustration: 'medical',
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function productsByCategory(category: ProductCategory) {
  return products.filter((p) => p.category === category)
}

/**
 * Search-result titles: short and keyword-first (about 55 characters at most,
 * before " | MoMixx"). The on-page heading stays the product name.
 */
export const productSeoTitles: Record<string, string> = {
  'momixx-mm': 'Flame-retardant silicone for USB-C cables (MM)',
  'momixx-high-density': 'PFAS-free silicone to replace FKM rubber (MHD)',
  'momixx-move': 'Silicone for high-voltage EV cables (MV)',
  'momixx-procase': 'Self-bonding silicone for phone cases (MPC)',
  'momixx-seal': 'Silicone for waterproof electronics seals (MMS)',
  selix: 'Selix self-bonding and high-density silicone',
  crimson: 'Crimson flame-retardant high-density silicone',
  'recycled-silicone': 'Certified recycled silicone (GRS, ISCC PLUS)',
  pctg: 'PCTG clear co-polyester for food-contact products',
  'vertical-extruder': 'Vertical silicone cable extrusion line',
  'horizontal-extruder': 'Horizontal silicone cable extrusion line',
  'lsr-mixer': 'Low-waste liquid silicone (LSR) mixer',
  autowinder: 'Camera-guided cable autowinder',
  'energy-saving-oven': 'Energy-saving silicone curing oven',
  'dip-coating-machine': 'Dip-coating machine for silicone finishes',
  'odm-oem': 'Silicone contract manufacturing (ODM / OEM)',
  'medical-precision-components': 'ISO 13485 medical and precision silicone parts',
}

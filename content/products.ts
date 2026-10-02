// Product catalogue. Each entry becomes its own page at /products/<slug>,
// its own tab in the product navigation, and an entry in the sitemap.
//
// To add a product: copy an entry, give it a unique slug, and fill in the
// fields. Only `slug`, `name`, `category`, `tagline` and `summary` are required.

import type { ModelName } from '@/components/three/modelNames'

export type ProductCategory = 'materials' | 'equipment' | 'services'

export const categoryLabels: Record<ProductCategory, string> = {
  materials: 'Materials',
  equipment: 'Manufacturing equipment',
  services: 'Services',
}

export const categoryIntros: Record<ProductCategory, string> = {
  materials:
    'Ready-to-use silicone compounds, each tuned for a job: stopping a cable from catching fire, sealing out water, bonding to plastic without glue, or replacing PFAS-containing rubbers. Plus certified recycled silicone and a specialty PCTG resin.',
  equipment:
    'Machines we design and build in-house to process silicone faster, with less energy and less waste. We use them in our own plants and supply them to customers.',
  services:
    'We co-develop and manufacture finished parts for customers, from colour-matched consumer products to medical and semiconductor components.',
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
  uses?: string[]
  stats?: Stat[]
  models?: Array<{ model: string; type: string; properties: string }>
  processing?: string
  specs?: Array<{ label: string; value: string }>
  comparison?: Comparison
  applications?: string[]
  /** Which 3D model represents this product (see components/three/models.tsx). */
  illustration?: ModelName
  /** Path under /public, e.g. /images/products/vertical-extruder.jpg */
  image?: string
  recycledOption?: boolean
}

export const products: Product[] = [
  // ───────────────────────────── Materials ─────────────────────────────
  {
    slug: 'momixx-mm',
    name: 'Momixx (MM) Series',
    tabLabel: 'MM · Cables',
    category: 'materials',
    tagline: 'Fire-retardant silicone for phone and laptop cables.',
    summary:
      'Our flagship series. MM silicone forms the outer jacket of USB-C data cables and chargers. It is softer and more flexible than the plastic normally used (TPE), survives twice as many twists, handles heat up to 250 °C where TPE starts to soften at around 170 °C, and stops burning on its own when the flame is removed.',
    benefits: [
      {
        title: 'Safer',
        body: 'Self-extinguishes when exposed to flame and passes the UL VW-1 cable burn test.',
      },
      {
        title: 'Lasts longer',
        body: 'Survives 10,000 twisting cycles in testing, about double a high-grade TPE cable.',
      },
      {
        title: 'Feels better',
        body: 'Soft and supple, with almost no “memory”, so cables lie flat instead of kinking.',
      },
    ],
    uses: ['USB-C data cables', 'Phone and laptop chargers', 'Network cables', 'Noise-reducing and magnetic parts'],
    stats: [
      { value: '10,000', label: 'twist cycles survived' },
      { value: '250 °C', label: 'heat resistance' },
      { value: 'VW-1', label: 'flame-retardant rating' },
    ],
    models: [
      { model: 'M3', type: 'HCR', properties: 'Fire retardant' },
      { model: 'M4', type: 'HCR', properties: 'Fire retardant, high tensile strength' },
      { model: 'M5', type: 'LSR', properties: 'Fire retardant' },
      { model: 'M6', type: 'LSR', properties: 'High fire retardant' },
      { model: 'M7', type: 'LSR', properties: 'Fire retardant, high tensile strength' },
      { model: 'M8', type: 'LSR', properties: 'Fire retardant, low curing temperature' },
      { model: 'M9', type: 'LSR', properties: 'Fire retardant, bitterant (child-safety taste deterrent)' },
      { model: 'M10', type: 'HCR', properties: 'Noise reduction' },
      { model: 'M11', type: 'HCR', properties: 'Magnetic' },
      { model: 'M12', type: 'LSR', properties: 'Magnetic' },
    ],
    processing: 'Extrusion, injection or compression moulding',
    comparison: {
      title: 'Momixx MM silicone vs high-grade TPE (data cable)',
      note: 'In heat-ageing tests, MM silicone passed 60 days at 158 °C; the TPE reference passed 7 days at 121 °C.',
      otherLabel: 'High-grade TPE',
      rows: [
        { metric: 'Twisting test', unit: 'cycles', momixx: 10000, other: 5000, better: 'higher' },
        { metric: 'Elongation (stretch before breaking)', unit: '%', momixx: 400, other: 250, momixxText: '>400', otherText: '>250', better: 'higher' },
        { metric: 'Heat withstand', unit: '°C', momixx: 250, other: 170, better: 'higher' },
      ],
    },
    applications: ['consumer-electronics', 'ai-data-centres'],
    illustration: 'cable',
    recycledOption: true,
  },
  {
    slug: 'momixx-high-density',
    name: 'Momixx High Density (MHD)',
    tabLabel: 'MHD · PFAS-free',
    category: 'materials',
    tagline: 'A PFAS-free replacement for fluorinated rubber.',
    summary:
      'Premium watch straps and EV components have traditionally used fluororubber (FKM), which contains PFAS “forever chemicals” that the EU is moving to restrict. MHD is a dense, silky silicone that matches FKM’s look, feel and durability without the fluorine.',
    benefits: [
      { title: 'PFAS-free', body: 'No fluorine chemistry, ready for upcoming EU restrictions.' },
      { title: 'Premium feel', body: 'Soft-touch hand feel comparable to FKM watch straps.' },
      { title: 'Equal performance', body: 'Similar mechanical strength, chemical resistance and reliability to FKM and HNBR.' },
    ],
    uses: ['Smartwatch and fitness straps', 'EV seals and cable parts', 'Medical and food-contact parts'],
    stats: [
      { value: '0', label: 'PFAS / fluorine content' },
      { value: '2', label: 'grades: LSR and HCR' },
    ],
    models: [
      { model: 'M1', type: 'LSR', properties: 'High density' },
      { model: 'M2', type: 'HCR', properties: 'High density' },
    ],
    processing: 'Injection or compression moulding',
    applications: ['consumer-electronics', 'electric-vehicles', 'medical'],
    illustration: 'watchband',
  },
  {
    slug: 'momixx-move',
    name: 'Momixx Move (MV)',
    tabLabel: 'MV · EV',
    category: 'materials',
    tagline: 'High-temperature silicone for electric-vehicle cables.',
    summary:
      'EV cables carry high power through hot, cramped spaces. MV silicone works from −60 °C to 250 °C and is far more flexible than the cross-linked plastic (XLPO) commonly used, so cables can be routed in tighter spaces with less wiring.',
    benefits: [
      { title: 'Wide temperature range', body: 'Stays flexible from −60 °C up to 250 °C.' },
      { title: 'Easier to route', body: 'Lower hardness means tighter bends and simpler wiring layouts.' },
      { title: 'Tested beyond real life', body: 'Validated under conditions harsher than an EV actually sees.' },
    ],
    uses: ['EV high-voltage power cables', 'Charging cables', 'Battery and motor wiring'],
    stats: [
      { value: '−60 to 250 °C', label: 'operating range' },
      { value: '60 days', label: 'ageing test at 158 °C' },
    ],
    models: [{ model: 'M13', type: 'HCR', properties: 'High temperature rating' }],
    processing: 'Extrusion',
    comparison: {
      title: 'Momixx MV silicone vs XLPO (automotive cable)',
      note: 'Hardness shown at the midpoint of each range (MV 65–75, XLPO 85–95). In heat-ageing tests, MV passed 60 days at 158 °C; the XLPO reference passed 7 days at 136 °C.',
      otherLabel: 'XLPO',
      rows: [
        { metric: 'Maximum temperature', unit: '°C', momixx: 250, other: 150, better: 'higher' },
        { metric: 'Hardness (lower = more flexible)', unit: 'Shore A', momixx: 70, other: 90, momixxText: '65–75', otherText: '85–95', better: 'lower' },
      ],
    },
    applications: ['electric-vehicles'],
    illustration: 'ev-cable',
  },
  {
    slug: 'momixx-procase',
    name: 'Momixx ProCase (MPC)',
    tabLabel: 'MPC · Cases',
    category: 'materials',
    tagline: 'Self-bonding silicone for phone and tablet cases.',
    summary:
      'Silicone usually needs a chemical primer to stick to plastic. MPC bonds to the plastic shell of a protective case by itself, removing a whole production step, its chemicals and its defects.',
    benefits: [
      { title: 'No primer', body: 'Bonds directly to plastic, removing a manufacturing step.' },
      { title: 'Cleaner process', body: 'Fewer chemicals and less handling on the production line.' },
      { title: 'Tough finish', body: 'Pairs with our dip-coating for a smooth, scratch-resistant surface.' },
    ],
    uses: ['Smartphone cases', 'Tablet cases', 'Over-moulded consumer products'],
    models: [{ model: 'M14', type: 'LSR', properties: 'Self-bonding' }],
    processing: 'Injection or compression moulding',
    applications: ['consumer-electronics'],
    illustration: 'phone-case',
  },
  {
    slug: 'momixx-seal',
    name: 'Momixx Seal (MMS)',
    tabLabel: 'MMS · Seals',
    category: 'materials',
    tagline: 'Waterproof seals rated to IP68.',
    summary:
      'MMS silicone is formulated for gaskets and seals that keep water and dust out of electronics, meeting the industrial IP68 standard (protected against continuous immersion).',
    uses: ['Device gaskets', 'Connector seals', 'Outdoor and industrial enclosures'],
    stats: [{ value: 'IP68', label: 'waterproof rating' }],
    models: [
      { model: 'M15', type: 'LSR', properties: 'Excellent waterproofing' },
      { model: 'M16', type: 'HCR', properties: 'Excellent waterproofing' },
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
      'Selix grades combine our self-bonding and high-density technologies for moulded parts that must bond to other materials or deliver a premium, dense feel.',
    models: [
      { model: 'S2', type: 'LSR', properties: 'Self-bonding' },
      { model: 'S3', type: 'LSR', properties: 'High density' },
    ],
    processing: 'Injection or compression moulding',
    applications: ['consumer-electronics', 'medical'],
    illustration: 'compound',
  },
  {
    slug: 'crimson',
    name: 'Crimson',
    category: 'materials',
    tagline: 'High-density and fire-retardant grades in liquid and solid form.',
    summary:
      'Crimson offers our high-density and fire-retardant chemistries in both liquid (LSR) and solid (HCR) form, so customers can pick the grade that suits their moulding process.',
    models: [
      { model: 'C1', type: 'HCR', properties: 'High density' },
      { model: 'C2', type: 'LSR', properties: 'High density' },
      { model: 'C3', type: 'HCR', properties: 'Fire retardant' },
      { model: 'C4', type: 'LSR', properties: 'Fire retardant' },
    ],
    processing: 'Injection, compression or extrusion',
    applications: ['consumer-electronics', 'electric-vehicles'],
    illustration: 'compound',
  },
  {
    slug: 'recycled-silicone',
    name: 'Recycled Silicone',
    tabLabel: 'Recycled',
    category: 'materials',
    tagline: 'Certified recycled silicone with the performance of virgin material.',
    summary:
      'We turn factory offcuts and used silicone products back into new, high-grade silicone through chemical recycling. Every batch is traceable to its recycled source and certified under GRS, ISCC PLUS and SCS Global Services.',
    benefits: [
      { title: 'Same performance', body: 'Chemically rebuilt, so it performs like new silicone, not a downgraded filler.' },
      { title: 'Traceable', body: 'Chain-of-custody certified: every batch can be traced to its recycled source.' },
      { title: 'Lower footprint', body: 'Diverts silicone waste from landfill and reduces carbon emissions versus virgin material.' },
    ],
    uses: ['Recycled-content cables', 'Consumer products with sustainability targets', 'Any Momixx grade on request'],
    stats: [
      { value: '3', label: 'international recycling certifications' },
      { value: '5', label: 'step closed-loop process' },
    ],
    applications: ['consumer-electronics', 'electric-vehicles'],
    illustration: 'recycle',
  },
  {
    slug: 'pctg',
    name: 'PCTG Co-polyester',
    tabLabel: 'PCTG',
    category: 'materials',
    tagline: 'A crystal-clear, heat-resistant, food-grade plastic.',
    summary:
      'Beyond silicone, we supply a customised PCTG co-polyester resin. It is glass-clear, tough, resists heat and chemicals, and complies with US FDA food-contact standards.',
    uses: ['Water and sports bottles', 'Cosmetic containers', 'Clear housings and containers'],
    stats: [{ value: 'FDA', label: 'food-grade compliant' }],
    processing: 'Injection moulding',
    illustration: 'bottle',
  },

  // ───────────────────────────── Equipment ─────────────────────────────
  {
    slug: 'vertical-extruder',
    name: 'Vertical Extrusion Line',
    tabLabel: 'Vertical Extruder',
    category: 'equipment',
    tagline: 'Our patented, world-first vertical line for silicone cables.',
    summary:
      'Conventional silicone cable lines run horizontally and are fed by hand. We invented a vertical line, fully automated from material mixing to inspection, that coats cables with liquid silicone at up to 100 metres per minute. It is supplied to customers including a Fortune Global 500 company.',
    benefits: [
      { title: 'Fast', body: 'Up to 100 m/min, more than three times our horizontal line.' },
      { title: 'Precise', body: 'Over 90% concentricity and jackets as thin as 0.30 mm.' },
      { title: 'Automated', body: 'Built-in liquid silicone mixing replaces manual roll-mill feeding.' },
    ],
    stats: [
      { value: '100 m/min', label: 'line speed' },
      { value: '>90%', label: 'cable concentricity' },
      { value: '0.30 mm', label: 'minimum jacket thickness' },
    ],
    specs: [
      { label: 'Screw speed', value: 'Max 35 rpm' },
      { label: 'Jacket thickness', value: 'Min 0.30 mm' },
      { label: 'Vacuum pressure', value: 'Up to 70 kPa' },
      { label: 'Line speed', value: 'Up to 100 m/min' },
      { label: 'Cable outer diameter', value: 'Up to 10.0 mm' },
      { label: 'Cable concentricity', value: '> 90%' },
      { label: 'Material feed', value: 'Max 150 kg/hour (without crosshead)' },
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
      'Our horizontal line uses precise material-supply control and a high-precision crosshead to produce silicone cable jackets of very even thickness, backed by our own installation and maintenance team.',
    stats: [
      { value: '30 m/min', label: 'line speed' },
      { value: '>90%', label: 'cable concentricity' },
    ],
    specs: [
      { label: 'Screw speed', value: 'Max 35 rpm' },
      { label: 'Vacuum pressure', value: 'Up to 70 kPa' },
      { label: 'Line speed', value: 'Up to 30 m/min' },
      { label: 'Cable outer diameter', value: 'Up to 10.0 mm' },
      { label: 'Cable concentricity', value: '> 90%' },
      { label: 'Jacket thickness', value: 'Min 0.30 mm' },
    ],
    applications: ['consumer-electronics'],
    illustration: 'extruder-horizontal',
  },
  {
    slug: 'lsr-mixer',
    name: 'Low-Waste LSR Mixer',
    tabLabel: 'LSR Mixer',
    category: 'equipment',
    tagline: 'Mixes liquid silicone evenly and leaves almost nothing behind.',
    summary:
      'Liquid silicone comes in two parts that must be mixed 1:1. Standard mixers leave around 4% of every bucket unused. Ours monitors the level precisely and keeps pumping until the bucket is empty, feeding our vertical line directly.',
    stats: [{ value: '~4%', label: 'material waste per bucket avoided' }],
    applications: ['consumer-electronics'],
    illustration: 'mixer',
  },
  {
    slug: 'autowinder',
    name: 'Vision-Guided Autowinder',
    tabLabel: 'Autowinder',
    category: 'equipment',
    tagline: 'A camera-guided winder that spools cable perfectly.',
    summary:
      'Badly wound spools cause tension changes and defects later in production. Our autowinder uses a camera and closed-loop control to correct the cable position continuously, so every spool is wound neatly.',
    applications: ['consumer-electronics'],
    illustration: 'winder',
  },
  {
    slug: 'energy-saving-oven',
    name: 'Energy-Saving Curing Oven',
    tabLabel: 'Oven',
    category: 'equipment',
    tagline: 'Uses 30% less electricity with twice the temperature precision.',
    summary:
      'Silicone cable jackets are cured in ovens. Ours has a smaller heating space and new heating and sensing modules, cutting electricity use by 30% and tightening temperature control from ±10 °C to ±5 °C for more consistent quality.',
    stats: [
      { value: '30%', label: 'less electricity' },
      { value: '±5 °C', label: 'temperature tolerance' },
    ],
    illustration: 'oven',
  },
  {
    slug: 'dip-coating-machine',
    name: 'Dip-Coating Machine',
    tabLabel: 'Dip Coating',
    category: 'equipment',
    tagline: 'A cleaner way to give silicone cables a smooth, dust-free finish.',
    summary:
      'Bare silicone attracts dust. Our dip-coating line applies a thin, precisely controlled surface coating that feels soft, resists stains and lasts. Compared with conventional spray coating, it releases up to 20 times less volatile organic compounds (VOCs).',
    stats: [{ value: '20×', label: 'lower VOC emissions than spray coating' }],
    applications: ['consumer-electronics'],
    illustration: 'coating',
  },

  // ───────────────────────────── Services ─────────────────────────────
  {
    slug: 'odm-oem',
    name: 'ODM / OEM Manufacturing',
    tabLabel: 'ODM / OEM',
    category: 'services',
    tagline: 'From formulation to finished part, under one roof.',
    summary:
      'We develop and manufacture finished silicone parts for brands: matching any colour, adding fire-retardant or chemical-resistant properties, applying surface treatments, and producing at volume in Malaysia and China.',
    benefits: [
      { title: 'Exact colour', body: 'Colour matched to within dE94 0.50 of the target, even for vivid or translucent shades.' },
      { title: 'Custom properties', body: 'Formulations tuned for fire retardancy, chemical resistance or feel.' },
      { title: 'Finishing', body: 'Dip coating for cables and cases; F-grade surface hardness.' },
    ],
    uses: ['Consumer electronics accessories', 'Wearables', 'Bio-leather and silicone composites'],
    applications: ['consumer-electronics'],
    illustration: 'oem',
  },
  {
    slug: 'medical-precision-components',
    name: 'Medical & Precision Components',
    tabLabel: 'Medical & Precision',
    category: 'services',
    tagline: 'ISO 13485 certified manufacturing for medical and semiconductor parts.',
    summary:
      'Our Batu Kawan plant in Penang is ISO 13485 certified, the international quality standard for medical devices. We entered medical device OEM in 2025 and in 2026 expanded into high-precision components for the medical and semiconductor industries.',
    stats: [
      { value: 'ISO 13485', label: 'medical device quality' },
      { value: '2025', label: 'entered medical OEM' },
    ],
    uses: ['Medical device components', 'Semiconductor equipment components', 'High-purity moulded parts'],
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

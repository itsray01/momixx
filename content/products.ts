// Product catalogue. Each entry becomes its own page at /products/<slug>,
// its own tab in the product navigation, and an entry in the sitemap.
//
// To add a product: copy an entry, give it a unique slug, and fill in the
// fields. Only `slug`, `name`, `category`, `tagline` and `summary` are required.

import type { ModelName } from '@/components/three/modelNames'

export type ProductCategory = 'materials' | 'equipment' | 'services'

export const categoryLabels: Record<ProductCategory, string> = {
  materials: 'Materials',
  equipment: 'Machines',
  services: 'Services',
}

export const categoryIntros: Record<ProductCategory, string> = {
  materials:
    'Silicone made for a specific job: stopping a cable from catching fire, keeping water out, sticking to plastic without glue, or replacing rubbers that contain “forever chemicals”. We also make certified recycled silicone and a clear, food-safe plastic.',
  equipment:
    'Machines we design and build ourselves to make silicone products faster, with less energy and less waste. We use them in our own factories and sell them to customers.',
  services:
    'We develop and make finished parts for other brands, from colour-matched consumer products to parts for medical devices and chip-making machines.',
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
  /** A real product photo shown in the overview, e.g. from the original site. */
  photo?: { src: string; alt: string; width: number; height: number; caption: string }
  recycledOption?: boolean
}

export const products: Product[] = [
  // ───────────────────────────── Materials ─────────────────────────────
  {
    slug: 'momixx-mm',
    name: 'Momixx (MM) Series',
    tabLabel: 'MM · Cables',
    category: 'materials',
    tagline: 'Fire-safe silicone for phone and laptop cables.',
    summary:
      'Our best-known silicone. It is the soft outer layer of USB-C and charging cables. Compared with the plastic most cables use, it is softer, survives twice as much twisting and copes with far more heat. If it catches fire, it puts itself out.',
    benefits: [
      {
        title: 'Safer',
        body: 'Puts itself out once the flame is taken away, and passes the standard US cable fire test (UL VW-1).',
      },
      {
        title: 'Lasts longer',
        body: 'Survived 10,000 twists in testing, about twice as many as a good plastic cable.',
      },
      {
        title: 'Feels better',
        body: 'Soft and supple, so cables lie flat instead of kinking.',
      },
    ],
    uses: ['USB-C data cables', 'Phone and laptop chargers', 'Network cables', 'Parts that cut noise or hold magnets'],
    stats: [
      { value: '10,000', label: 'twists survived in testing' },
      { value: '250 °C', label: 'heat it can handle' },
      { value: 'Fire-safe', label: 'passes the UL VW-1 cable fire test' },
    ],
    models: [
      { model: 'M3', type: 'HCR', properties: 'Fire-safe' },
      { model: 'M4', type: 'HCR', properties: 'Fire-safe, extra strong' },
      { model: 'M5', type: 'LSR', properties: 'Fire-safe' },
      { model: 'M6', type: 'LSR', properties: 'Extra fire-safe' },
      { model: 'M7', type: 'LSR', properties: 'Fire-safe, extra strong' },
      { model: 'M8', type: 'LSR', properties: 'Fire-safe, sets at a lower heat' },
      { model: 'M9', type: 'LSR', properties: 'Fire-safe, tastes bitter so children won’t chew it' },
      { model: 'M10', type: 'HCR', properties: 'Cuts noise' },
      { model: 'M11', type: 'HCR', properties: 'Magnetic' },
      { model: 'M12', type: 'LSR', properties: 'Magnetic' },
    ],
    processing: 'Made into cables, or shaped in moulds',
    comparison: {
      title: 'MM silicone vs a good plastic cable',
      note: 'In a long heat test, MM silicone lasted 60 days at 158 °C. The plastic (TPE) lasted 7 days at 121 °C.',
      otherLabel: 'Plastic',
      rows: [
        { metric: 'Twisting test', unit: 'twists', momixx: 10000, other: 5000, better: 'higher' },
        { metric: 'Stretch before it breaks', unit: '%', momixx: 400, other: 250, momixxText: '>400', otherText: '>250', better: 'higher' },
        { metric: 'Heat it can handle', unit: '°C', momixx: 250, other: 170, better: 'higher' },
      ],
    },
    applications: ['consumer-electronics', 'ai-data-centres'],
    illustration: 'cable',
    photo: { src: '/images/products/momixx-mm-cable.webp', alt: 'USB-C data cable with a white silicone jacket', width: 410, height: 318, caption: 'Silicone data cable' },
    recycledOption: true,
  },
  {
    slug: 'momixx-high-density',
    name: 'Momixx High Density (MHD)',
    tabLabel: 'MHD · PFAS-free',
    category: 'materials',
    tagline: 'A silicone that replaces rubbers containing “forever chemicals”.',
    summary:
      'Premium watch straps and some car parts are usually made from a fluorinated rubber. It contains PFAS, the “forever chemicals” the EU is moving to restrict. MHD is a dense, silky silicone with the same look, feel and toughness, and no PFAS.',
    benefits: [
      { title: 'PFAS-free', body: 'No fluorine at all, so it is ready for the coming EU rules.' },
      { title: 'Premium feel', body: 'As soft and smooth to the touch as a high-end watch strap.' },
      { title: 'Just as tough', body: 'As strong, durable and chemical-resistant as the rubbers it replaces.' },
    ],
    uses: ['Smartwatch and fitness straps', 'Seals and cable parts in electric cars', 'Medical and food-contact parts'],
    stats: [
      { value: '0', label: 'PFAS (“forever chemicals”)' },
      { value: '2', label: 'forms: liquid and solid' },
    ],
    models: [
      { model: 'M1', type: 'LSR', properties: 'Dense, premium feel' },
      { model: 'M2', type: 'HCR', properties: 'Dense, premium feel' },
    ],
    processing: 'Shaped in moulds',
    applications: ['consumer-electronics', 'electric-vehicles', 'medical'],
    illustration: 'watchband',
  },
  {
    slug: 'momixx-move',
    name: 'Momixx Move (MV)',
    tabLabel: 'MV · EV',
    category: 'materials',
    tagline: 'Heat-proof silicone for electric-car cables.',
    summary:
      'Electric cars carry a lot of power through hot, cramped spaces. MV silicone keeps working from −60 °C to 250 °C. It is also much more bendy than the plastic usually used, so cables fit into tighter spaces.',
    benefits: [
      { title: 'Handles heat and cold', body: 'Stays flexible from −60 °C up to 250 °C.' },
      { title: 'Easier to fit', body: 'Softer cables bend more tightly, so the wiring is simpler.' },
      { title: 'Tested beyond real life', body: 'Tested in conditions harsher than a car ever sees.' },
    ],
    uses: ['High-power cables in electric cars', 'Charging cables', 'Battery and motor wiring'],
    stats: [
      { value: '−60 to 250 °C', label: 'working temperature range' },
      { value: '60 days', label: 'heat test passed at 158 °C' },
    ],
    models: [{ model: 'M13', type: 'HCR', properties: 'Handles high heat' }],
    processing: 'Made into cables',
    comparison: {
      title: 'MV silicone vs standard car-cable plastic',
      note: 'Hardness is the middle of each range (MV 65–75, plastic 85–95, on the Shore A scale). In a long heat test, MV lasted 60 days at 158 °C. The plastic (XLPO) lasted 7 days at 136 °C.',
      otherLabel: 'Plastic',
      rows: [
        { metric: 'Highest temperature', unit: '°C', momixx: 250, other: 150, better: 'higher' },
        { metric: 'Hardness (lower is more bendy)', unit: 'score', momixx: 70, other: 90, momixxText: '65–75', otherText: '85–95', better: 'lower' },
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
    tagline: 'Silicone that sticks to phone and tablet cases by itself.',
    summary:
      'Silicone normally needs a chemical primer before it will stick to plastic. MPC sticks to the hard shell of a phone case on its own. That removes a whole production step, along with its chemicals and its faults.',
    benefits: [
      { title: 'No primer', body: 'Sticks straight to plastic, so there is one less step.' },
      { title: 'Cleaner', body: 'Fewer chemicals and less handling in the factory.' },
      { title: 'Tough finish', body: 'Works with our dip coating for a smooth, scratch-resistant surface.' },
    ],
    uses: ['Phone cases', 'Tablet cases', 'Products that combine silicone and plastic'],
    models: [{ model: 'M14', type: 'LSR', properties: 'Sticks to plastic by itself' }],
    processing: 'Shaped in moulds',
    applications: ['consumer-electronics'],
    illustration: 'phone-case',
  },
  {
    slug: 'momixx-seal',
    name: 'Momixx Seal (MMS)',
    tabLabel: 'MMS · Seals',
    category: 'materials',
    tagline: 'Waterproof seals for electronics.',
    summary:
      'MMS silicone is made for the seals that keep water and dust out of electronics. It meets IP68, the top rating for devices that can stay underwater.',
    uses: ['Seals inside devices', 'Connector seals', 'Outdoor and industrial housings'],
    stats: [{ value: 'IP68', label: 'waterproof rating: safe underwater' }],
    models: [
      { model: 'M15', type: 'LSR', properties: 'Waterproof' },
      { model: 'M16', type: 'HCR', properties: 'Waterproof' },
    ],
    processing: 'Shaped in moulds',
    applications: ['consumer-electronics', 'robotics', 'ai-data-centres'],
    illustration: 'seal',
  },
  {
    slug: 'selix',
    name: 'Selix',
    category: 'materials',
    tagline: 'Silicone that sticks to other materials, or feels dense and premium.',
    summary:
      'Selix brings together two of our technologies: silicone that sticks to other materials by itself, and dense silicone with a premium feel. It is used for moulded parts.',
    models: [
      { model: 'S2', type: 'LSR', properties: 'Sticks to other materials' },
      { model: 'S3', type: 'LSR', properties: 'Dense, premium feel' },
    ],
    processing: 'Shaped in moulds',
    applications: ['consumer-electronics', 'medical'],
    illustration: 'compound',
  },
  {
    slug: 'crimson',
    name: 'Crimson',
    category: 'materials',
    tagline: 'Dense and fire-safe silicone, in liquid or solid form.',
    summary:
      'Crimson offers our dense and fire-safe silicones in both liquid and solid form, so customers can choose whichever suits the way they make their parts.',
    models: [
      { model: 'C1', type: 'HCR', properties: 'Dense, premium feel' },
      { model: 'C2', type: 'LSR', properties: 'Dense, premium feel' },
      { model: 'C3', type: 'HCR', properties: 'Fire-safe' },
      { model: 'C4', type: 'LSR', properties: 'Fire-safe' },
    ],
    processing: 'Shaped in moulds, or made into cables',
    applications: ['consumer-electronics', 'electric-vehicles'],
    illustration: 'compound',
  },
  {
    slug: 'recycled-silicone',
    name: 'Recycled Silicone',
    tabLabel: 'Recycled',
    category: 'materials',
    tagline: 'Certified recycled silicone that performs like new.',
    summary:
      'We turn factory scraps and used silicone products back into new, high-quality silicone. We recycle it chemically, so it performs like brand-new material. Every batch can be traced back to its recycled source, and it is certified under three international schemes: GRS, ISCC PLUS and SCS.',
    benefits: [
      { title: 'Works like new', body: 'Rebuilt from its basic building blocks, so it performs like new silicone, not a cheap filler.' },
      { title: 'Traceable', body: 'Independently certified, so every batch can be traced to the waste it came from.' },
      { title: 'Lower footprint', body: 'Keeps silicone out of landfill and cuts carbon emissions compared with new material.' },
    ],
    uses: ['Cables with recycled content', 'Products with sustainability targets', 'Any Momixx silicone, on request'],
    stats: [
      { value: '3', label: 'international recycling certifications' },
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
    tagline: 'A crystal-clear, heat-resistant, food-safe plastic.',
    summary:
      'As well as silicone, we supply a tailored clear plastic called PCTG. It is glass-clear and tough, handles heat and chemicals, and meets US food-safety rules (FDA).',
    uses: ['Water and sports bottles', 'Cosmetic containers', 'Clear cases and containers'],
    stats: [{ value: 'FDA', label: 'approved for food contact' }],
    processing: 'Shaped in moulds',
    illustration: 'bottle',
  },

  // ───────────────────────────── Equipment ─────────────────────────────
  {
    slug: 'vertical-extruder',
    name: 'Vertical Extrusion Line',
    tabLabel: 'Vertical Extruder',
    category: 'equipment',
    tagline: 'Our patented, world-first machine for making silicone cables.',
    summary:
      'Most silicone cable machines run sideways and are loaded by hand. We invented one that runs upright and is fully automatic, from mixing the silicone to checking the finished cable. It makes up to 100 metres of cable a minute, and a Fortune Global 500 company is among its customers.',
    benefits: [
      { title: 'Fast', body: 'Up to 100 metres a minute, more than three times our sideways machine.' },
      { title: 'Precise', body: 'The silicone layer is even all the way round, and can be as thin as 0.3 mm.' },
      { title: 'Automatic', body: 'It mixes the liquid silicone itself, so nobody has to feed it by hand.' },
    ],
    stats: [
      { value: '100 m', label: 'of cable made every minute' },
      { value: '>90%', label: 'even all the way round' },
      { value: '0.3 mm', label: 'thinnest silicone layer' },
    ],
    specs: [
      { label: 'Screw speed', value: 'Up to 35 turns a minute' },
      { label: 'Thinnest layer', value: '0.30 mm' },
      { label: 'Vacuum', value: 'Up to 70 kPa' },
      { label: 'Speed', value: 'Up to 100 m a minute' },
      { label: 'Thickest cable', value: '10 mm across' },
      { label: 'Evenness', value: 'Over 90%' },
      { label: 'Silicone used', value: 'Up to 150 kg an hour' },
    ],
    applications: ['consumer-electronics', 'electric-vehicles'],
    illustration: 'extruder-vertical',
  },
  {
    slug: 'horizontal-extruder',
    name: 'Horizontal Extrusion Line',
    tabLabel: 'Horizontal Extruder',
    category: 'equipment',
    tagline: 'A precise, flexible machine for making silicone cables.',
    summary:
      'Our horizontal machine controls exactly how much silicone goes in, and wraps it around the wire very evenly. Our own team installs and looks after it.',
    stats: [
      { value: '30 m', label: 'of cable made every minute' },
      { value: '>90%', label: 'even all the way round' },
    ],
    specs: [
      { label: 'Screw speed', value: 'Up to 35 turns a minute' },
      { label: 'Vacuum', value: 'Up to 70 kPa' },
      { label: 'Speed', value: 'Up to 30 m a minute' },
      { label: 'Thickest cable', value: '10 mm across' },
      { label: 'Evenness', value: 'Over 90%' },
      { label: 'Thinnest layer', value: '0.30 mm' },
    ],
    applications: ['consumer-electronics'],
    illustration: 'extruder-horizontal',
  },
  {
    slug: 'lsr-mixer',
    name: 'Low-Waste Silicone Mixer',
    tabLabel: 'Mixer',
    category: 'equipment',
    tagline: 'Mixes liquid silicone evenly and leaves almost nothing behind.',
    summary:
      'Liquid silicone comes in two parts that must be mixed half and half. Standard mixers leave about 4% of every bucket unused. Ours tracks the level closely and keeps pumping until the bucket is empty, then feeds the silicone straight into our cable machine.',
    stats: [{ value: '~4%', label: 'of each bucket no longer wasted' }],
    applications: ['consumer-electronics'],
    illustration: 'mixer',
  },
  {
    slug: 'autowinder',
    name: 'Camera-Guided Autowinder',
    tabLabel: 'Autowinder',
    category: 'equipment',
    tagline: 'A camera-guided machine that winds cable neatly onto spools.',
    summary:
      'Cable wound unevenly onto a spool can stretch or get damaged later. Our autowinder uses a camera to watch the cable and adjusts its position all the time, so every spool is wound neatly.',
    applications: ['consumer-electronics'],
    illustration: 'winder',
  },
  {
    slug: 'energy-saving-oven',
    name: 'Energy-Saving Curing Oven',
    tabLabel: 'Oven',
    category: 'equipment',
    tagline: 'Uses 30% less electricity and holds its temperature twice as steadily.',
    summary:
      'Once silicone is on a cable, it is baked in an oven to set it. Our oven has a smaller heated space and better heaters and sensors. It uses 30% less electricity and stays within 5 °C of the target, instead of 10 °C, so quality is more consistent.',
    stats: [
      { value: '30%', label: 'less electricity' },
      { value: '±5 °C', label: 'temperature accuracy' },
    ],
    illustration: 'oven',
  },
  {
    slug: 'dip-coating-machine',
    name: 'Dip-Coating Machine',
    tabLabel: 'Dip Coating',
    category: 'equipment',
    tagline: 'A cleaner way to give silicone a smooth, dust-free finish.',
    summary:
      'Bare silicone attracts dust. Our machine dips cables in a thin coating that feels soft, resists stains and lasts. Compared with spraying, it releases up to 20 times less of the fumes that pollute the air.',
    stats: [{ value: '20×', label: 'fewer polluting fumes than spraying' }],
    applications: ['consumer-electronics'],
    illustration: 'coating',
  },

  // ───────────────────────────── Services ─────────────────────────────
  {
    slug: 'odm-oem',
    name: 'Contract Manufacturing',
    tabLabel: 'Contract manufacturing',
    category: 'services',
    tagline: 'From the recipe to the finished part, all in one place.',
    summary:
      'We develop and make finished silicone parts for other brands (in the industry this is called ODM or OEM manufacturing). We match any colour, add properties like fire safety, finish the surface, and produce in large volumes at our factories in Asia.',
    benefits: [
      { title: 'Exact colour', body: 'Matched so closely that most people cannot see the difference, even for bright or see-through shades.' },
      { title: 'Made to measure', body: 'Silicone tuned for fire safety, chemical resistance or a particular feel.' },
      { title: 'Finishing', body: 'Smooth, hard-wearing coatings for cables and cases.' },
    ],
    uses: ['Phone and computer accessories', 'Wearables', 'Bio-leather and silicone blends'],
    applications: ['consumer-electronics'],
    illustration: 'oem',
  },
  {
    slug: 'medical-precision-components',
    name: 'Medical & Precision Components',
    tabLabel: 'Medical & Precision',
    category: 'services',
    tagline: 'Certified manufacturing for medical and chip-making parts.',
    summary:
      'Our factory in Batu Kawan, Penang, holds ISO 13485, the international quality standard for making medical devices. We began making medical devices for other companies in 2025. In 2026 we started making high-precision parts for the medical and chip-making industries.',
    stats: [
      { value: 'ISO 13485', label: 'medical-device quality standard' },
      { value: '2025', label: 'started making medical devices' },
    ],
    uses: ['Medical device parts', 'Parts for chip-making machines', 'Ultra-clean moulded parts'],
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

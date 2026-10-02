// Where silicone is used, and where Momixx fits. Each entry becomes its own
// page at /applications/<slug> with an addressable-market panel.

import type { ModelName } from '@/components/three/modelNames'

export type Maturity = 'In mass production' | 'Certified & scaling' | 'Emerging opportunity'

export type Application = {
  slug: string
  name: string
  tabLabel: string
  tagline: string
  intro: string
  maturity: Maturity
  maturityNote: string
  whySilicone: Array<{ title: string; body: string }>
  ourRole: Array<{ title: string; body: string }>
  examples: string[]
  products: string[]
  /** ids from content/markets.ts */
  markets: string[]
  faqs: Array<{ q: string; a: string }>
  /** Which 3D model represents this application. */
  illustration: ModelName
}

export const applications: Application[] = [
  {
    slug: 'consumer-electronics',
    name: 'Phones, Cables & Wearables',
    tabLabel: 'Phones & Cables',
    tagline: 'The soft, fire-safe silicone inside the cables you use every day.',
    intro:
      'Every phone, laptop and earbud needs a cable, and the EU now requires USB-C on most new devices. Premium brands are switching cable jackets from plastic to silicone because it feels softer, tangles less, lasts longer and handles heat better. Momixx has supplied fire-retardant silicone for data and power cables to leading smartphone brands since 2019.',
    maturity: 'In mass production',
    maturityNote: 'Qualified with leading smartphone brands since 2019; mass production in Malaysia and China.',
    whySilicone: [
      { title: 'Soft and tangle-free', body: 'Silicone has low hardness and almost no memory, so cables lie flat instead of kinking.' },
      { title: 'Lasts longer', body: 'Our silicone cables survive 10,000 twists in testing, about double a high-grade plastic cable.' },
      { title: 'Safer with heat', body: 'Withstands 250 °C, where common TPE plastic softens at around 170 °C and can short-circuit.' },
    ],
    ourRole: [
      { title: 'Cable silicone', body: 'MM series fire-retardant compounds for USB-C data and power cables.' },
      { title: 'Cases and straps', body: 'Self-bonding silicone for phone cases and PFAS-free high-density silicone for watch straps.' },
      { title: 'Machines', body: 'Our patented vertical extrusion line produces silicone cable at up to 100 m/min.' },
    ],
    examples: ['USB-C charging and data cables', 'Laptop power cords', 'Phone and tablet cases', 'Smartwatch straps', 'Waterproof gaskets (IP68)'],
    products: ['momixx-mm', 'momixx-procase', 'momixx-high-density', 'momixx-seal', 'vertical-extruder', 'odm-oem'],
    markets: ['usb-cables', 'lsr'],
    faqs: [
      {
        q: 'Why are silicone phone cables better than plastic ones?',
        a: 'Silicone is softer and more flexible than the TPE plastic used in most cables, so it tangles less and survives far more bending. It also withstands much higher temperatures (around 250 °C versus 170 °C for TPE) and, in fire-retardant grades like Momixx MM, stops burning when the flame is removed.',
      },
      {
        q: 'Does Momixx make cables?',
        a: 'Momixx makes the silicone material that forms the cable jacket, and the machines that apply it. Cable makers and electronics brands use our material and equipment in their own cables.',
      },
    ],
    illustration: 'cable',
  },
  {
    slug: 'electric-vehicles',
    name: 'Electric Vehicles',
    tabLabel: 'Electric Vehicles',
    tagline: 'Heat-proof, flexible silicone for high-voltage EV cables.',
    intro:
      'Electric vehicles move large amounts of power through hot, tightly packed spaces. Their cables must stay flexible in freezing winters, survive heat near batteries and motors, and never catch fire. Silicone does all three, and our PFAS-free grades also prepare carmakers for tightening chemical rules in Europe.',
    maturity: 'Certified & scaling',
    maturityNote: 'Materials tested to standards stricter than real EV operating conditions.',
    whySilicone: [
      { title: 'Extreme temperatures', body: 'Works from −60 °C to 250 °C, where XLPO plastic tops out at about 150 °C.' },
      { title: 'Tighter routing', body: 'Softer cables bend more easily, simplifying wiring layouts in compact EVs.' },
      { title: 'PFAS-free', body: 'High-density silicone can replace fluorinated rubbers (FKM) that face EU restrictions.' },
    ],
    ourRole: [
      { title: 'EV cable silicone', body: 'MV series for high-voltage power and charging cables.' },
      { title: 'FKM replacement', body: 'MHD high-density silicone as a PFAS-free alternative for seals and parts.' },
      { title: 'Recycled option', body: 'Certified recycled silicone for carmakers with recycled-content targets.' },
    ],
    examples: ['High-voltage battery cables', 'Charging cables', 'Motor and inverter wiring', 'Seals and gaskets'],
    products: ['momixx-move', 'momixx-high-density', 'recycled-silicone', 'crimson'],
    markets: ['ev-cables', 'silicone'],
    faqs: [
      {
        q: 'Why is silicone used in electric vehicle cables?',
        a: 'EV cables need to carry high power safely across a very wide temperature range. Silicone stays flexible from about −60 °C to 250 °C, resists ageing, and can be made fire-retardant, so it is well suited to high-voltage and charging cables.',
      },
      {
        q: 'What does PFAS-free mean for EV parts?',
        a: 'PFAS are “forever chemicals” found in fluorinated rubbers such as FKM. The EU is working on broad restrictions. Momixx high-density silicone offers similar performance without fluorine, helping manufacturers prepare.',
      },
    ],
    illustration: 'ev-cable',
  },
  {
    slug: 'medical',
    name: 'Medical & Healthcare',
    tabLabel: 'Medical',
    tagline: 'Clean, body-safe silicone, made under medical-device quality standards.',
    intro:
      'Silicone is one of the most widely used materials in medicine because it is stable, flexible and well tolerated by the body. It is used in tubing, seals, wearable monitors and many device components. Our Batu Kawan plant in Penang is certified to ISO 13485, the international quality standard for medical devices.',
    maturity: 'Certified & scaling',
    maturityNote: 'Entered medical device OEM in 2025; ISO 13485 certified in 2026.',
    whySilicone: [
      { title: 'Body-friendly', body: 'Medical-grade silicone is chemically stable and widely used in contact with skin and the body.' },
      { title: 'Sterilisable', body: 'Withstands repeated high-temperature sterilisation without breaking down.' },
      { title: 'Precise', body: 'Liquid silicone can be moulded into small, intricate parts with tight tolerances.' },
    ],
    ourRole: [
      { title: 'ISO 13485 plant', body: 'Medical-grade quality management at our Penang Batu Kawan facility.' },
      { title: 'Medical device OEM', body: 'Manufacturing silicone components for medical device brands since 2025.' },
      { title: 'High-purity materials', body: 'High-density grades with strict cleanliness and purity control.' },
    ],
    examples: ['Wearable health monitors', 'Device seals and valves', 'Tubing and connectors', 'Soft-touch grips'],
    products: ['medical-precision-components', 'momixx-high-density', 'selix'],
    markets: ['medical-silicone', 'lsr'],
    faqs: [
      {
        q: 'Why is silicone used in medical devices?',
        a: 'Medical-grade silicone is chemically stable, flexible, can be sterilised repeatedly, and is widely accepted for contact with skin and the body. That makes it a common choice for tubing, seals, wearables and device components.',
      },
      {
        q: 'What is ISO 13485?',
        a: 'ISO 13485 is the international quality management standard for organisations that design or manufacture medical devices and their components. Momixx’s Penang Batu Kawan plant is certified to it.',
      },
    ],
    illustration: 'medical',
  },
  {
    slug: 'ai-data-centres',
    name: 'AI Data Centres',
    tabLabel: 'AI Data Centres',
    tagline: 'Heat-tolerant materials for the buildings that power AI.',
    intro:
      'AI computing packs far more power into each server rack than traditional computing, which means more heat, more power cabling and more cooling. Materials that keep working at high temperatures are becoming essential. Silicone is used in high-temperature cables, seals and thermal materials, and our network-cable silicone withstands up to 250 °C.',
    maturity: 'Emerging opportunity',
    maturityNote: 'Applying our high-temperature cable and sealing materials to a fast-growing market.',
    whySilicone: [
      { title: 'Runs hot, stays safe', body: 'Silicone cable jackets withstand up to 250 °C and can be made fire-retardant.' },
      { title: 'Ages slowly', body: 'Excellent long-term heat ageing for equipment that runs 24/7.' },
      { title: 'Seals out liquid', body: 'Waterproof silicone gaskets suit liquid-cooled server systems.' },
    ],
    ourRole: [
      { title: 'Network & power cable silicone', body: 'High-temperature, fire-retardant compounds for cabling.' },
      { title: 'Seals', body: 'IP68-rated waterproof silicone for enclosures and connectors.' },
      { title: 'Scale', body: 'High-speed extrusion and two manufacturing bases to serve volume demand.' },
    ],
    examples: ['High-temperature network cables', 'Power cabling', 'Liquid-cooling seals', 'Connector gaskets'],
    products: ['momixx-mm', 'momixx-seal', 'vertical-extruder'],
    markets: ['data-centre-cabling'],
    faqs: [
      {
        q: 'How is silicone used in data centres?',
        a: 'Silicone appears in high-temperature and fire-retardant cable jackets, gaskets and seals (including in liquid-cooled systems), and thermal interface materials that help move heat away from chips.',
      },
    ],
    illustration: 'datacentre',
  },
  {
    slug: 'robotics',
    name: 'Robotics & Humanoids',
    tabLabel: 'Robots & Humanoids',
    tagline: 'Soft, durable silicone for robots that move like us.',
    intro:
      'Robots, and especially humanoid robots, bend and flex constantly. Their internal cables must survive millions of movements, their joints need seals, and their hands and outer shells increasingly use soft, skin-like materials for safe contact with people. Silicone is a natural fit for all three.',
    maturity: 'Emerging opportunity',
    maturityNote: 'Applying our high-flex cable, sealing and soft-touch materials to a new market.',
    whySilicone: [
      { title: 'Flexes endlessly', body: 'Silicone cables tolerate repeated twisting and bending far better than plastics.' },
      { title: 'Skin-like touch', body: 'Soft, high-density silicone gives grippers and robot “skin” a safe, natural feel.' },
      { title: 'Protects joints', body: 'Seals keep dust and water out of motors and sensors.' },
    ],
    ourRole: [
      { title: 'High-flex cables', body: 'MM silicone survives 10,000 twisting cycles in testing, about double high-grade TPE.' },
      { title: 'Soft-touch materials', body: 'High-density and self-bonding grades for grippers and covers.' },
      { title: 'Precision parts', body: 'Moulded components from our Penang plant.' },
    ],
    examples: ['Joint and arm cabling', 'Gripper pads and fingertips', 'Soft outer covers', 'Motor and sensor seals'],
    products: ['momixx-mm', 'momixx-high-density', 'momixx-seal', 'medical-precision-components'],
    markets: ['humanoid-robots'],
    faqs: [
      {
        q: 'Why do robots use silicone?',
        a: 'Robots need cables that survive constant movement, seals that protect joints and electronics, and soft surfaces that are safe to touch. Silicone’s flexibility, durability and skin-like feel make it a common choice for all three.',
      },
    ],
    illustration: 'robot',
  },
  {
    slug: 'semiconductor',
    name: 'Semiconductor Components',
    tabLabel: 'Semiconductor',
    tagline: 'High-precision parts for the machines that make chips.',
    intro:
      'Chip-making equipment needs extremely clean, precise and heat-resistant components. In 2026 we expanded our Batu Kawan plant in Penang, a major semiconductor hub, into high-precision components for the semiconductor and medical industries.',
    maturity: 'Certified & scaling',
    maturityNote: 'Precision component capability added at our Penang plant in 2026.',
    whySilicone: [
      { title: 'Clean', body: 'High-purity materials with tight contamination control.' },
      { title: 'Heat-stable', body: 'Performs reliably across high process temperatures.' },
      { title: 'Precise', body: 'Moulded to tight tolerances for equipment parts.' },
    ],
    ourRole: [
      { title: 'Penang location', body: 'Based in one of Asia’s leading semiconductor clusters.' },
      { title: 'Precision moulding', body: 'High-precision component manufacturing added in 2026.' },
      { title: 'Quality systems', body: 'Shared quality infrastructure with our ISO 13485 medical operations.' },
    ],
    examples: ['Equipment seals and O-rings', 'Precision moulded parts', 'Protective and handling components'],
    products: ['medical-precision-components'],
    markets: ['semiconductor-equipment'],
    faqs: [
      {
        q: 'Is silicone the same as silicon used in chips?',
        a: 'No. Silicon is the element used to make computer chips. Silicone is a flexible material made from silicon, oxygen, carbon and hydrogen. Momixx makes silicone, including parts used in the equipment that makes silicon chips.',
      },
    ],
    illustration: 'chip',
  },
]

export function getApplication(slug: string) {
  return applications.find((a) => a.slug === slug)
}

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
      'Every phone, laptop and pair of earbuds needs a cable, and the EU now requires USB-C on most new devices. Premium brands are moving from plastic to silicone cables because silicone feels softer, tangles less, lasts longer and copes better with heat. Since 2019, leading smartphone brands have used Momixx fire-safe silicone in their cables.',
    maturity: 'In mass production',
    maturityNote: 'Approved by leading smartphone brands since 2019 and made in volume at our factories in Asia.',
    whySilicone: [
      { title: 'Soft and tangle-free', body: 'Silicone is soft and doesn’t hold a shape, so cables lie flat instead of kinking.' },
      { title: 'Lasts longer', body: 'Our silicone cables survived 10,000 twists in testing, about twice as many as a good plastic cable.' },
      { title: 'Safer with heat', body: 'Copes with 250 °C. The plastic most cables use softens at about 170 °C, which can cause a short circuit.' },
    ],
    ourRole: [
      { title: 'Cable silicone', body: 'Our MM range: fire-safe silicone for USB-C and charging cables.' },
      { title: 'Cases and straps', body: 'Silicone that sticks to phone cases by itself, and watch-strap silicone without “forever chemicals”.' },
      { title: 'Machines', body: 'Our patented upright cable machine makes up to 100 metres of silicone cable a minute.' },
    ],
    examples: ['USB-C charging and data cables', 'Laptop power cords', 'Phone and tablet cases', 'Smartwatch straps', 'Waterproof seals'],
    products: ['momixx-mm', 'momixx-procase', 'momixx-high-density', 'momixx-seal', 'vertical-extruder', 'odm-oem'],
    markets: ['usb-cables', 'lsr'],
    faqs: [
      {
        q: 'Why are silicone phone cables better than plastic ones?',
        a: 'Silicone is softer and bendier than the plastic used in most cables, so it tangles less and survives far more bending. It also copes with much more heat: about 250 °C, against 170 °C for the plastic. Fire-safe silicone like Momixx MM puts itself out when the flame is taken away.',
      },
      {
        q: 'Does Momixx make cables?',
        a: 'Momixx makes the silicone that forms the outside of the cable, and the machines that put it there. Cable makers and electronics brands use our silicone and machines to make their own cables.',
      },
    ],
    illustration: 'cable',
  },
  {
    slug: 'electric-vehicles',
    name: 'Electric Vehicles',
    tabLabel: 'Electric Vehicles',
    tagline: 'Heat-proof, flexible silicone for electric-car cables.',
    intro:
      'Electric cars move a lot of power through hot, tightly packed spaces. Their cables must stay flexible in freezing winters, survive the heat near batteries and motors, and never catch fire. Silicone does all three. Our silicones without “forever chemicals” (PFAS) also help carmakers get ready for stricter rules in Europe.',
    maturity: 'Certified & scaling',
    maturityNote: 'Tested in conditions harsher than an electric car ever sees.',
    whySilicone: [
      { title: 'Extreme temperatures', body: 'Works from −60 °C to 250 °C. The plastic usually used tops out at about 150 °C.' },
      { title: 'Easier to fit', body: 'Softer cables bend more easily, so wiring is simpler in tightly packed cars.' },
      { title: 'PFAS-free', body: 'Our dense silicone can replace rubbers containing “forever chemicals”, which the EU is moving to restrict.' },
    ],
    ourRole: [
      { title: 'Car cable silicone', body: 'Our MV range for high-power and charging cables.' },
      { title: 'PFAS-free parts', body: 'Our dense MHD silicone replaces fluorinated rubber in seals and parts.' },
      { title: 'Recycled option', body: 'Certified recycled silicone for carmakers with recycled-content targets.' },
    ],
    examples: ['Battery cables', 'Charging cables', 'Motor wiring', 'Seals'],
    products: ['momixx-move', 'momixx-high-density', 'recycled-silicone', 'crimson'],
    markets: ['ev-cables', 'silicone'],
    faqs: [
      {
        q: 'Why is silicone used in electric vehicle cables?',
        a: 'Electric-car cables carry a lot of power, in freezing cold and fierce heat. Silicone stays flexible from about −60 °C to 250 °C, lasts a long time and can be made fire-safe, so it suits power and charging cables well.',
      },
      {
        q: 'What does PFAS-free mean for car parts?',
        a: 'PFAS are “forever chemicals” that build up in nature. They are found in some rubbers used in cars, and the EU is working on wide restrictions. Momixx’s dense silicone does the same job without them, so carmakers can get ahead of the rules.',
      },
    ],
    illustration: 'ev-cable',
  },
  {
    slug: 'medical',
    name: 'Medical & Healthcare',
    tabLabel: 'Medical',
    tagline: 'Clean, body-safe silicone, made to medical-device quality standards.',
    intro:
      'Silicone is one of the most common materials in medicine. It is stable, flexible and safe for the body, so it is used in tubes, seals, wearable monitors and many device parts. Our factory in Batu Kawan, Penang, holds ISO 13485, the international quality standard for making medical devices.',
    maturity: 'Certified & scaling',
    maturityNote: 'Making medical devices for other companies since 2025, and certified to ISO 13485 in 2026.',
    whySilicone: [
      { title: 'Body-friendly', body: 'Medical-grade silicone doesn’t react with the body, so it is widely used on the skin and inside the body.' },
      { title: 'Easy to sterilise', body: 'It can be cleaned at high heat again and again without breaking down.' },
      { title: 'Precise', body: 'Liquid silicone can be moulded into small, detailed parts that are exactly the right size.' },
    ],
    ourRole: [
      { title: 'Certified factory', body: 'Our Penang factory meets ISO 13485, the medical-device quality standard.' },
      { title: 'Made for medical brands', body: 'Making silicone parts for medical-device companies since 2025.' },
      { title: 'Very clean materials', body: 'Silicone made under strict cleanliness checks.' },
    ],
    examples: ['Wearable health monitors', 'Seals and valves in devices', 'Tubes and connectors', 'Soft-touch grips'],
    products: ['medical-precision-components', 'momixx-high-density', 'selix'],
    markets: ['medical-silicone', 'lsr'],
    faqs: [
      {
        q: 'Why is silicone used in medical devices?',
        a: 'Medical-grade silicone doesn’t react with the body, stays flexible and can be cleaned at high heat again and again. That makes it a common choice for tubes, seals, wearables and device parts.',
      },
      {
        q: 'What is ISO 13485?',
        a: 'ISO 13485 is the international quality standard for companies that design or make medical devices and their parts. Momixx’s factory in Batu Kawan, Penang, is certified to it.',
      },
    ],
    illustration: 'medical',
  },
  {
    slug: 'ai-data-centres',
    name: 'AI Data Centres',
    tabLabel: 'AI Data Centres',
    tagline: 'Heat-proof materials for the buildings that power AI.',
    intro:
      'AI computers use far more power than ordinary servers. That means more heat, more power cables and more cooling, so materials that keep working when hot are becoming essential. Silicone is used in heat-proof cables, seals and cooling pads, and our network-cable silicone copes with up to 250 °C.',
    maturity: 'Emerging opportunity',
    maturityNote: 'Bringing our heat-proof cable and seal silicones to a fast-growing market.',
    whySilicone: [
      { title: 'Runs hot, stays safe', body: 'Silicone cables cope with up to 250 °C and can be made fire-safe.' },
      { title: 'Lasts for years', body: 'Holds up to constant heat in equipment that runs day and night.' },
      { title: 'Keeps liquid out', body: 'Waterproof silicone seals suit servers that are cooled with liquid.' },
    ],
    ourRole: [
      { title: 'Cable silicone', body: 'Heat-proof, fire-safe silicone for network and power cables.' },
      { title: 'Seals', body: 'Waterproof silicone for equipment housings and connectors.' },
      { title: 'Scale', body: 'Fast cable machines and two factories to make large volumes.' },
    ],
    examples: ['Heat-proof network cables', 'Power cables', 'Seals for liquid cooling', 'Connector seals'],
    products: ['momixx-mm', 'momixx-seal', 'vertical-extruder'],
    markets: ['data-centre-cabling'],
    faqs: [
      {
        q: 'How is silicone used in data centres?',
        a: 'Silicone is used in heat-proof, fire-safe cables, in seals (including for liquid cooling), and in soft pads that carry heat away from chips.',
      },
    ],
    illustration: 'datacentre',
  },
  {
    slug: 'robotics',
    name: 'Robotics & Humanoids',
    tabLabel: 'Robots & Humanoids',
    tagline: 'Soft, tough silicone for robots that move like us.',
    intro:
      'Robots, and especially human-shaped robots, bend and flex all the time. The cables inside them must survive millions of movements, their joints need seals, and their hands and outer shells are starting to use soft, skin-like materials so they are safe to touch. Silicone suits all three.',
    maturity: 'Emerging opportunity',
    maturityNote: 'Bringing our bendy cable, seal and soft-touch silicones to a new market.',
    whySilicone: [
      { title: 'Bends endlessly', body: 'Silicone cables cope with repeated twisting and bending far better than plastic.' },
      { title: 'Skin-like touch', body: 'Soft, dense silicone gives robot hands and “skin” a safe, natural feel.' },
      { title: 'Protects joints', body: 'Seals keep dust and water out of motors and sensors.' },
    ],
    ourRole: [
      { title: 'Bendy cables', body: 'MM silicone survived 10,000 twists in testing, about twice as many as a good plastic cable.' },
      { title: 'Soft-touch materials', body: 'Dense silicone, and silicone that sticks to other parts, for hands and covers.' },
      { title: 'Precision parts', body: 'Moulded parts from our Penang factory.' },
    ],
    examples: ['Cables in joints and arms', 'Grip pads and fingertips', 'Soft outer covers', 'Seals for motors and sensors'],
    products: ['momixx-mm', 'momixx-high-density', 'momixx-seal', 'medical-precision-components'],
    markets: ['humanoid-robots'],
    faqs: [
      {
        q: 'Why do robots use silicone?',
        a: 'Robots need cables that survive constant movement, seals that protect their joints and electronics, and soft surfaces that are safe to touch. Silicone is flexible, tough and feels like skin, so it is a common choice for all three.',
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
      'The machines that make computer chips need parts that are extremely clean, precise and heat-proof. In 2026 our factory in Batu Kawan, Penang, a major chip-making hub, started making high-precision parts for the chip-making and medical industries.',
    maturity: 'Certified & scaling',
    maturityNote: 'Our Penang factory started making precision parts in 2026.',
    whySilicone: [
      { title: 'Clean', body: 'Very pure materials, made under strict cleanliness checks.' },
      { title: 'Heat-stable', body: 'Keeps working in the high heat of chip-making.' },
      { title: 'Precise', body: 'Moulded to exactly the right size for machine parts.' },
    ],
    ourRole: [
      { title: 'Penang location', body: 'Based in one of Asia’s leading chip-making regions.' },
      { title: 'Precision moulding', body: 'Making high-precision parts since 2026.' },
      { title: 'Quality checks', body: 'The same quality system as our certified medical work.' },
    ],
    examples: ['Seals and rings for machines', 'Precision moulded parts', 'Protective and handling parts'],
    products: ['medical-precision-components'],
    markets: ['semiconductor-equipment'],
    faqs: [
      {
        q: 'Is silicone the same as the silicon used in chips?',
        a: 'No. Silicon is the element used to make computer chips. Silicone is a flexible material made from silicon, oxygen, carbon and hydrogen. Momixx makes silicone, including parts for the machines that make silicon chips.',
      },
    ],
    illustration: 'chip',
  },
]

export function getApplication(slug: string) {
  return applications.find((a) => a.slug === slug)
}

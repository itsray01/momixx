// Where silicone is used, and where MoMixx fits. Each entry becomes its own
// page at /applications/<slug> with a panel of independent industry estimates
// (industry context only, not MoMixx forecasts).
//
// Claims rules: temperatures and twist counts for MoMixx grades come from
// MoMixx testing and must say so; typical silicone cable is rated to about
// 180–200 °C. Keep the "10,000 twisting cycles" figure to one mention here
// (consumer electronics) plus the MM product page.

import type { LucideIcon } from 'lucide-react'
import {
  Cable,
  ClipboardCheck,
  Clock,
  Cog,
  CircleDot,
  Crosshair,
  Droplets,
  Factory,
  Filter,
  Hand,
  HeartPulse,
  Leaf,
  MapPin,
  Recycle,
  RefreshCcw,
  Repeat,
  Route,
  Shield,
  Smartphone,
  Thermometer,
} from 'lucide-react'
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
  whySilicone: Array<{ title: string; body: string; icon?: LucideIcon }>
  ourRole: Array<{ title: string; body: string; icon?: LucideIcon }>
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
    tagline: 'The soft, flame-retardant silicone inside everyday charging cables.',
    intro:
      'Every phone, laptop and pair of earbuds needs a cable, and the EU now requires USB-C on most new devices. Many premium brands use silicone cable jackets because silicone feels softer, tangles less, lasts longer and handles heat better than common plastics. Since 2019, MoMixx flame-retardant silicone has been qualified by a leading smartphone brand for its cables.',
    maturity: 'In mass production',
    maturityNote: 'Qualified by a leading smartphone brand since 2019 and made in volume at our factories in Asia.',
    whySilicone: [
      { icon: Cable, title: 'Soft and tangle-free', body: 'Silicone has low hardness and almost no “memory” (it does not hold a bent shape), so cables lie flat instead of kinking.' },
      { icon: Repeat, title: 'Lasts longer', body: 'In MoMixx testing, MM silicone cable jackets withstood 10,000 twisting cycles, about twice as many as a standard TPE cable.' },
      {
        icon: Thermometer,
        title: 'Handles heat',
        body: 'Standard silicone cable is typically rated to about 180–200 °C, against about 105 °C for a TPE cable (LAPP catalogue). In MoMixx testing, MM silicone withstood 250 °C.',
      },
    ],
    ourRole: [
      { icon: Cable, title: 'Cable silicone', body: 'Our MM range: flame-retardant silicone for USB-C data and charging cables.' },
      { icon: Smartphone, title: 'Cases and straps', body: 'Self-bonding silicone for phone cases, and PFAS-free high-density silicone for watch straps.' },
      { icon: Cog, title: 'Machines', body: 'Our patented vertical extrusion line makes silicone cable at up to 100 metres a minute.' },
    ],
    examples: ['USB-C charging and data cables', 'Laptop power cords', 'Phone and tablet cases', 'Smartwatch straps', 'Seals for IP68-rated devices'],
    products: ['momixx-mm', 'momixx-procase', 'momixx-high-density', 'momixx-seal', 'vertical-extruder', 'odm-oem'],
    markets: ['usb-cables', 'lsr'],
    faqs: [
      {
        q: 'Why are silicone phone cables better than plastic ones?',
        a: 'Silicone is softer and more flexible than TPE, the plastic used in most cable jackets, so it tangles less and survives far more bending. It is also rated for higher temperatures: standard silicone cable is typically rated to about 180–200 °C, against about 105 °C for TPE cable. Flame-retardant grades such as MoMixx MM stop burning once the flame is removed.',
      },
      {
        q: 'Does MoMixx make cables?',
        a: 'MoMixx makes the silicone that forms the outside of the cable, and the machines that apply it. Cable makers and electronics brands use our silicone and machines to make their own cables.',
      },
    ],
    illustration: 'data-cable',
  },
  {
    slug: 'electric-vehicles',
    name: 'Electric Vehicles',
    tabLabel: 'Electric Vehicles',
    tagline: 'Heat-resistant, flexible silicone for high-voltage EV cables.',
    intro:
      'Electric cars move a lot of power through hot, tightly packed spaces. Their high-voltage cables must stay flexible in freezing winters, cope with the heat near batteries, motors and inverters, and resist fire. Flame-retardant silicone meets all three needs. Our PFAS-free silicones also help carmakers prepare for possible EU restrictions on “forever chemicals”.',
    maturity: 'Certified & scaling',
    maturityNote: 'MV silicone has been tested by MoMixx under conditions harsher than normal electric-car operation.',
    whySilicone: [
      {
        icon: Thermometer,
        title: 'Wide temperature range',
        body: 'In MoMixx testing, MV silicone worked from −60 °C to 250 °C. In the same tests, XLPO, the plastic usually used, withstood about 150 °C.',
      },
      { icon: Route, title: 'Easier to route', body: 'Softer cables bend more tightly, which simplifies wiring in compact cars.' },
      { icon: Leaf, title: 'PFAS-free', body: 'High-density silicone can replace fluorinated rubber (FKM) in many seals and parts where fuel and oil resistance is not critical.' },
    ],
    ourRole: [
      { icon: Cable, title: 'EV cable silicone', body: 'Our MV range for high-voltage power and charging cables.' },
      { icon: Leaf, title: 'FKM alternative', body: 'MHD high-density silicone as a PFAS-free option for seals and parts.' },
      { icon: Recycle, title: 'Recycled option', body: 'Certified recycled silicone for carmakers with recycled-content targets.' },
    ],
    examples: ['High-voltage battery cables', 'Charging cables', 'Motor and inverter wiring', 'Seals and gaskets'],
    products: ['momixx-move', 'momixx-high-density', 'recycled-silicone', 'crimson'],
    markets: ['ev-cables', 'silicone'],
    faqs: [
      {
        q: 'Why is silicone used in electric vehicle cables?',
        a: 'Electric-car cables carry high power in freezing cold and fierce heat. Silicone stays flexible across a wide temperature range (standard silicone cable is typically rated to about 180–200 °C), lasts a long time and can be made flame-retardant, so it suits high-voltage and charging cables.',
      },
      {
        q: 'What does PFAS-free mean for car parts?',
        a: 'PFAS are “forever chemicals” that build up in nature. They include fluorinated rubbers such as FKM, used in some car seals, and the EU is working on a broad restriction. MoMixx high-density silicone offers a similar feel and toughness without fluorine, although FKM remains the better choice for parts exposed to fuel and oil.',
      },
    ],
    illustration: 'ev-cable',
  },
  {
    slug: 'medical',
    name: 'Medical & Healthcare',
    tabLabel: 'Medical',
    tagline: 'Silicone parts made under an ISO 13485-certified quality system.',
    intro:
      'Silicone is one of the most widely used materials in medicine because it is stable, flexible and well tolerated by the body. It is used in tubing, seals, wearable monitors and many device parts. The quality system at our factory in Batu Kawan, Penang, is certified to ISO 13485.',
    maturity: 'Certified & scaling',
    maturityNote: 'Making silicone parts for medical-device makers since 2025; Batu Kawan, Penang factory certified to ISO 13485 in 2026.',
    whySilicone: [
      {
        icon: HeartPulse,
        title: 'Well tolerated',
        body: 'Medical-grade silicone is chemically stable and widely used on the skin and inside the body. Each finished device still needs its own biocompatibility testing, usually under ISO 10993.',
      },
      { icon: RefreshCcw, title: 'Sterilisable', body: 'It can be sterilised at high temperature again and again without breaking down.' },
      { icon: Crosshair, title: 'Precise', body: 'Liquid silicone can be moulded into small, detailed parts with tight tolerances.' },
    ],
    ourRole: [
      { icon: ClipboardCheck, title: 'Certified quality system', body: 'Our Batu Kawan, Penang factory’s quality system is certified to ISO 13485.' },
      { icon: Factory, title: 'Parts for medical brands', body: 'Making silicone parts for medical-device makers since 2025.' },
      { icon: Filter, title: 'High-purity materials', body: 'High-density grades made under strict cleanliness and purity controls.' },
    ],
    examples: ['Wearable health monitors', 'Seals and valves in devices', 'Tubing and connectors', 'Soft-touch grips'],
    products: ['medical-precision-components', 'momixx-high-density', 'selix'],
    markets: ['medical-silicone', 'lsr'],
    faqs: [
      {
        q: 'Why is silicone used in medical devices?',
        a: 'Medical-grade silicone is chemically stable, flexible, can be sterilised repeatedly and is widely accepted for contact with skin and the body. That makes it a common choice for tubing, seals, wearables and device parts. Safety is confirmed for each finished device, usually with ISO 10993 testing.',
      },
      {
        q: 'What is ISO 13485?',
        a: 'ISO 13485 is the international quality-management standard for organisations that design or make medical devices and their parts. It certifies how a company works, not a material or product. The quality system at MoMixx’s factory in Batu Kawan, Penang, is certified to it.',
      },
    ],
    illustration: 'medical',
  },
  {
    slug: 'ai-data-centres',
    name: 'AI Data Centres',
    tabLabel: 'AI Data Centres',
    tagline: 'Heat-resistant materials for the buildings that power AI.',
    intro:
      'AI computing packs far more power into each server rack than traditional computing. That means more heat, more power cabling and more cooling, so materials that keep working when hot are becoming essential. Silicone is used in high-temperature cables, seals and thermal interface materials: the soft pads and gels that carry heat away from chips.',
    maturity: 'Emerging opportunity',
    maturityNote: 'A new market for MoMixx: we are offering our existing high-temperature cable and sealing materials.',
    whySilicone: [
      {
        icon: Thermometer,
        title: 'Runs hot, stays safe',
        body: 'Silicone cable is typically rated to about 180–200 °C, well above common plastic cable, and can be made flame-retardant.',
      },
      { icon: Clock, title: 'Ages slowly', body: 'Holds up to constant heat in equipment that runs 24 hours a day.' },
      { icon: Droplets, title: 'Keeps liquid out', body: 'Waterproof silicone seals suit servers cooled with liquid.' },
    ],
    ourRole: [
      { icon: Cable, title: 'Cable silicone', body: 'High-temperature, flame-retardant MM silicone for network and power cables.' },
      { icon: CircleDot, title: 'Seals', body: 'MMS silicone for seals in waterproof enclosures and connectors.' },
      { icon: Factory, title: 'Scale', body: 'High-speed extrusion lines and two factories for volume orders.' },
    ],
    examples: ['High-temperature network cables', 'Power cables', 'Seals for liquid cooling', 'Connector seals'],
    products: ['momixx-mm', 'momixx-seal', 'vertical-extruder'],
    markets: ['data-centre-cabling'],
    faqs: [
      {
        q: 'How is silicone used in data centres?',
        a: 'Silicone is used in high-temperature and flame-retardant cables, in seals (including for liquid cooling), and in thermal interface materials: soft pads and gels that carry heat away from chips.',
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
      'Robots, and especially humanoid robots, bend and flex all the time. The cables inside them twist and bend constantly, their joints need seals, and their hands and outer shells increasingly use soft, skin-like materials so they are safe to touch. Silicone suits all three.',
    maturity: 'Emerging opportunity',
    maturityNote: 'A new market for MoMixx: we are offering our flexible cable, sealing and soft-touch materials.',
    whySilicone: [
      { icon: Repeat, title: 'Flexes repeatedly', body: 'Silicone cable jackets tolerate repeated twisting and bending better than many plastics.' },
      { icon: Hand, title: 'Skin-like touch', body: 'Soft, high-density silicone gives robot hands and “skin” a natural feel and is easy to clean.' },
      { icon: Shield, title: 'Protects joints', body: 'Seals keep dust and water out of motors and sensors.' },
    ],
    ourRole: [
      {
        icon: Cable,
        title: 'Flexible cables',
        body: 'MM cable silicone has been tested for twisting in our lab. Robot cables have their own flex-life requirements, so each cable design should be tested for the robot it goes into.',
      },
      { icon: Hand, title: 'Soft-touch materials', body: 'High-density and self-bonding grades for grippers and covers.' },
      { icon: Crosshair, title: 'Precision parts', body: 'Moulded parts from our Batu Kawan, Penang factory.' },
    ],
    examples: ['Cables in joints and arms', 'Grip pads and fingertips', 'Soft outer covers', 'Seals for motors and sensors'],
    products: ['momixx-mm', 'momixx-high-density', 'momixx-seal', 'medical-precision-components'],
    markets: ['humanoid-robots'],
    faqs: [
      {
        q: 'Why do robots use silicone?',
        a: 'Robots need cables that survive constant movement, seals that protect their joints and electronics, and soft surfaces that are safe to touch. Silicone is flexible, durable and has a skin-like feel, so it is a common choice for all three.',
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
      'The machines that make computer chips need parts that are extremely clean, precise and heat-resistant. In 2026 our factory in Batu Kawan, Penang, a major semiconductor hub, began making high-precision parts for the semiconductor and medical industries.',
    maturity: 'Certified & scaling',
    maturityNote: 'Precision parts made at our Batu Kawan, Penang factory since 2026, under the same quality system as our ISO 13485-certified medical work.',
    whySilicone: [
      { icon: Filter, title: 'Clean', body: 'High-purity materials made under tight contamination control.' },
      { icon: Thermometer, title: 'Heat-stable', body: 'Keeps working at the high temperatures used in chip-making.' },
      { icon: Crosshair, title: 'Precise', body: 'Moulded to tight tolerances for equipment parts.' },
    ],
    ourRole: [
      { icon: MapPin, title: 'Penang location', body: 'Based in one of Asia’s leading semiconductor regions.' },
      { icon: Crosshair, title: 'Precision moulding', body: 'Making high-precision parts since 2026.' },
      { icon: ClipboardCheck, title: 'Quality system', body: 'The same quality system as our ISO 13485-certified medical work.' },
    ],
    examples: ['Equipment seals and O-rings', 'Precision moulded parts', 'Protective and handling parts'],
    products: ['medical-precision-components'],
    markets: ['semiconductor-equipment'],
    faqs: [
      {
        q: 'Is silicone the same as the silicon used in chips?',
        a: 'No. Silicon is the element used to make computer chips. Silicone is a flexible material made from silicon, oxygen, carbon and hydrogen. MoMixx makes silicone, including parts for the machines that make silicon chips.',
      },
    ],
    illustration: 'chip',
  },
]

export function getApplication(slug: string) {
  return applications.find((a) => a.slug === slug)
}

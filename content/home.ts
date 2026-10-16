// Home page content, built around the four strengths HQ asked the page to lead with:
// recycling, performance, process-level visibility and customer access, each linked
// to its evidence.
//
// PENDING CLAIMS: anything marked `pending` is waiting for HQ's evidence (who verified
// it, when, what it covers). Pending content shows on preview deployments with an
// "Awaiting confirmation" label and is left out of the live site automatically
// (see `showPending` in lib/site.ts). Remove `pending` once the evidence is in hand.

import type { LucideIcon } from 'lucide-react'
import { Factory, Filter, FlaskConical, RotateCcw, Smartphone, Truck } from 'lucide-react'

export const hero = {
  headline: { lines: ['Advanced silicone.', 'Lower carbon.'], accent: 'Greater possibilities.' },
  intro:
    'MoMixx combines silicone recycling, advanced materials engineering and transparent manufacturing to help customers make high-performance products with a lower carbon footprint.',
}

/** Recycled vs new silicone. Awaiting the assessment details (product, verifier, date, boundary). */
export const carbonHeadline = {
  pending: true,
  unit: 'kg CO₂e per kg of material',
  rows: [
    { label: 'New silicone (benchmark)', text: 'More than 5', bar: 5.4, ours: false },
    { label: 'MoMixx recycled silicone', text: 'Less than 3', bar: 3, ours: true },
  ],
  note: 'Figures apply to the assessed materials and defined lifecycle boundaries. Product-specific footprint information and assessment details are available on request.',
}

export type Pillar = {
  id: string
  title: string
  /** Approved text, shown everywhere. */
  body?: string
  /** Text awaiting evidence: previews only. */
  pendingBody?: string
  /** The whole pillar awaits evidence: previews only. */
  pending?: boolean
  links: Array<{ href: string; label: string; pending?: boolean }>
}

export const pillars: Pillar[] = [
  {
    id: 'recycling',
    title: 'Certified recycling',
    body: 'Our recycled content is certified under GRS, RCS, ISCC PLUS and SCS Global Services, with certified chain-of-custody records from collected waste to finished silicone.',
    links: [
      { href: '/sustainability#certificates', label: 'Our certificates' },
      { href: '/recycled-silicone#what-we-do', label: 'How we recycle' },
    ],
  },
  {
    id: 'performance',
    title: 'Performs like new',
    body: 'We recycle chemically: silicone waste is broken down to its basic building blocks and rebuilt, so the new silicone performs like new rather than as a weaker filler. Any MoMixx silicone can be supplied with recycled content on request.',
    pendingBody: 'Test results comparing our recycled and new silicone will be published here.',
    links: [
      { href: '/recycled-silicone#what-we-deliver', label: 'What we deliver' },
      { href: '/products/momixx', label: 'Our grades' },
    ],
  },
  {
    id: 'visibility',
    title: 'Process-level visibility',
    body: 'An independent third party has checked how we calculate the carbon footprint of our silicone.',
    pendingBody:
      'Our AI-enabled monitoring system captures energy use across every production process, together with transport and shipment, and independent audits check the data down to individual processes.',
    links: [{ href: '/carbon-footprint#control-and-monitor', label: 'How we control and monitor' }],
  },
  {
    id: 'access',
    title: 'Open to customers',
    pending: true,
    body: 'Customers are welcome to visit our factory and review production at the process level, with documented quality controls and traceable material flows.',
    links: [{ href: '/contact?topic=Factory%20visit', label: 'Request a factory visit' }],
  },
]

/** The circular loop: silicone waste from factories and end users, back into production. */
export const loop: Array<{ title: string; icon: LucideIcon }> = [
  { title: 'Collect', icon: Truck },
  { title: 'Recover', icon: Filter },
  { title: 'Reprocess', icon: FlaskConical },
  { title: 'Manufacture', icon: Factory },
  { title: 'Use', icon: Smartphone },
  { title: 'Return', icon: RotateCcw },
]

export const circular = {
  body: 'We turn recovered silicone into a valuable resource. Our recycling process takes silicone waste from factories and from used products and rebuilds it into new silicone. Working with customers and collection partners, we aim to bring silicone waste back into production and reduce reliance on new raw materials.',
  /** Net zero is presented as a vision only, and only once HQ approves the wording. */
  pendingVision: 'It is part of our long-term vision of net zero.',
}

export const platform = {
  intro:
    'Green silicone is the foundation of our application-driven platform. We combine recycled materials with formulation and processing expertise, and develop each solution around the customer’s performance requirements, with opportunities to reduce its material carbon footprint.',
}

/** Awaiting two or three real examples (with photos) from HQ. */
export const social = {
  pending: true,
  body: 'Social responsibility is a cornerstone of our culture. Progress depends on how we treat our people, work with our partners and contribute to the communities around us. Responsible manufacturing means caring for both the environment and the people who make our business possible.',
}

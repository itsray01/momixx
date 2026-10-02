// The parts of the Momixx vertical extrusion line shown in the interactive 3D
// explorer, in the order the cable travels. Plain data (no Three.js), so the
// server-rendered fallback and the part list can use it too.

type Vec3 = [number, number, number]

export type ExtruderPart = {
  id: string
  name: string
  short: string
  body: string
  /** Product page for this part, if it is sold on its own. */
  href?: string
  /** Where the camera flies to, and what it looks at. */
  camera: { position: Vec3; target: Vec3 }
  /** Where the numbered marker sits in 3D. */
  anchor: Vec3
}

export const extruderParts: ExtruderPart[] = [
  {
    id: 'payoff',
    name: 'Pay-off and preheat',
    short: 'Feeds and warms the wire',
    body: 'Bare conductor unwinds from the pay-off reel at a steady tension, then passes through a preheat oven that conditions it before it is coated.',
    camera: { position: [-2.7, 2.2, 4.6], target: [-3.7, 1.0, 0] },
    anchor: [-4.25, 1.95, 0],
  },
  {
    id: 'mixer',
    name: 'LSR mixer',
    short: 'Mixes liquid silicone 1:1',
    body: 'Liquid silicone comes in two parts. The mixer blends parts A and B evenly at 1:1 and pumps the mix straight into the extruder, so there is no roll mill and no hand feeding. Precise level monitoring keeps pumping until the bucket is empty, avoiding the roughly 4% usually left behind.',
    href: '/products/lsr-mixer',
    camera: { position: [-1.2, 2.6, 3.6], target: [-2.75, 1.2, -0.9] },
    anchor: [-2.75, 2.35, -0.9],
  },
  {
    id: 'extruder',
    name: 'Extruder and crosshead',
    short: 'Forms the silicone jacket',
    body: 'A screw pushes the silicone into a high-precision crosshead die, where it flows evenly around the wire under vacuum to form the jacket. This is where thickness and concentricity are set.',
    camera: { position: [-0.4, 2.3, 3.6], target: [-1.6, 1.55, 0] },
    anchor: [-0.95, 1.75, 0.35],
  },
  {
    id: 'vertical-oven',
    name: 'Vertical curing oven',
    short: 'Cures the jacket on the way up',
    body: 'The coated cable rises straight up through the curing oven, where heat sets the silicone into a permanent, flexible jacket. Running vertically is what makes this line different from conventional horizontal lines.',
    href: '/products/energy-saving-oven',
    camera: { position: [0.6, 3.9, 6.0], target: [-1.6, 3.4, 0] },
    anchor: [-1.15, 4.3, 0.3],
  },
  {
    id: 'capstan',
    name: 'Horizontal oven and capstan',
    short: 'Completes curing, sets the speed',
    body: 'A second, horizontal oven finishes the cure. The capstan then pulls the cable at a constant speed, and an accumulator buffers cable so the line keeps running smoothly.',
    camera: { position: [1.8, 3.6, 6.2], target: [1.5, 2.8, 0] },
    anchor: [2.75, 3.95, 0.3],
  },
  {
    id: 'inspection',
    name: 'Inspection station',
    short: 'Checks every metre',
    body: 'Inline gauges measure the outer diameter and test the insulation with high voltage, while a counter logs the length, so faults are caught as the cable is made, not after.',
    camera: { position: [3.0, 2.1, 3.9], target: [3.45, 1.15, 0] },
    anchor: [3.45, 1.95, 0.35],
  },
  {
    id: 'winder',
    name: 'Autowinder',
    short: 'Spools finished cable',
    body: 'Finished cable is wound onto the take-up spool. A camera vision system watches the cable position and corrects it automatically, so every layer is laid neatly.',
    href: '/products/autowinder',
    camera: { position: [3.7, 2.2, 4.3], target: [4.55, 1.05, 0] },
    anchor: [4.55, 2.15, 0],
  },
]

/** Camera for the whole line. */
export const extruderOverview = { position: [4.4, 5.9, 13.6] as Vec3, target: [0.55, 2.35, 0] as Vec3, fov: 34 }

/** Which part each machine specification (from content/products.ts) belongs to. */
export const specPart: Record<string, string> = {
  'Screw speed': 'extruder',
  'Jacket thickness': 'extruder',
  'Vacuum pressure': 'extruder',
  'Line speed': 'capstan',
  'Cable outer diameter': 'inspection',
  'Cable concentricity': 'inspection',
  'Material feed': 'mixer',
}

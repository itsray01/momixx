// The parts of the Momixx vertical extrusion line shown in the extruder
// explorer, in the order the cable travels. Plain data (no Three.js).

type Vec3 = [number, number, number]

export type ExtruderPart = {
  id: string
  name: string
  short: string
  body: string
  /** Product page for this part, if it is sold on its own. */
  href?: string
  /** Marker position on the machine photo, in percent. Omit for parts not in the photo. */
  photo?: { x: number; y: number }
  /**
   * The part on the 3D model of the machine: where its marker sits, which way it
   * faces (the marker hides when turned away), and where the camera flies to.
   */
  machine?: { anchor: Vec3; normal: Vec3; camera: { position: Vec3; target: Vec3 } }
}

export const extruderParts: ExtruderPart[] = [
  {
    id: 'payoff',
    name: 'Wire feed',
    short: 'Unwinds and warms the wire',
    body: 'Bare wire unwinds from a reel at a steady pull, then passes through a small oven that warms it up before it is coated.',
  },
  {
    id: 'mixer',
    name: 'Silicone mixer',
    short: 'Mixes the liquid silicone',
    body: 'Liquid silicone comes in two parts that must be mixed half and half. The mixer blends them and pumps the mix straight into the machine, so nobody has to feed it by hand. It keeps pumping until the bucket is empty, saving the 4% or so that is usually left behind.',
    href: '/products/lsr-mixer',
  },
  {
    id: 'extruder',
    name: 'Coating head',
    short: 'Wraps silicone around the wire',
    body: 'A turning screw pushes the silicone into the coating head. There it flows evenly around the wire to form the outer layer, with air sucked out so no bubbles get trapped. This is where the layer’s thickness, and how even it is all the way round, are set.',
    photo: { x: 62, y: 45 },
    machine: { anchor: [0.235, 1.36, 0.3], normal: [0.3, 0, 1], camera: { position: [0.85, 1.65, 1.95], target: [0.1, 1.38, 0.1] } },
  },
  {
    id: 'vertical-oven',
    name: 'Upright oven',
    short: 'Sets the silicone on the way up',
    body: 'The coated cable rises straight up through an oven, where heat sets the silicone into a tough, flexible layer. Running upright is what makes this machine different from the usual sideways ones.',
    href: '/products/energy-saving-oven',
  },
  {
    id: 'capstan',
    name: 'Second oven and pulleys',
    short: 'Finishes setting, controls the speed',
    body: 'A second oven finishes setting the silicone. Big pulleys then pull the cable through at a steady speed, and hold a little spare cable so the machine never has to stop.',
    photo: { x: 45, y: 14 },
    machine: { anchor: [-0.05, 2.12, 0.08], normal: [0, 0, 1], camera: { position: [0.55, 2.35, 2.0], target: [-0.05, 2.12, -0.03] } },
  },
  {
    id: 'inspection',
    name: 'Quality check',
    short: 'Checks every metre',
    body: 'Sensors measure the cable’s thickness and test it with high voltage to make sure the silicone has no weak spots. A counter records the length. Faults are caught while the cable is being made, not afterwards.',
    photo: { x: 66, y: 69 },
    machine: { anchor: [0.42, 0.86, 0.3], normal: [0, 0.6, 1], camera: { position: [0.95, 1.35, 1.9], target: [0.35, 0.75, 0.15] } },
  },
  {
    id: 'winder',
    name: 'Autowinder',
    short: 'Winds the finished cable',
    body: 'The finished cable is wound onto a spool. A camera watches where the cable lands and corrects it automatically, so every layer is wound neatly.',
    href: '/products/autowinder',
  },
]

/** Camera for the whole machine in the 3D explorer. */
export const machineOverview = { position: [-1.7, 1.95, 4.9] as Vec3, target: [0.05, 1.15, 0.12] as Vec3, fov: 34 }

/** Camera for the pre-rendered image of the whole line. */
export const extruderOverview = { position: [4.4, 5.9, 13.6] as Vec3, target: [0.55, 2.35, 0] as Vec3, fov: 34 }

/** Which part each machine specification (from content/products.ts) belongs to. */
export const specPart: Record<string, string> = {
  'Screw speed': 'extruder',
  'Thinnest layer': 'extruder',
  Vacuum: 'extruder',
  Speed: 'capstan',
  'Thickest cable': 'inspection',
  Evenness: 'inspection',
  'Silicone used': 'mixer',
}

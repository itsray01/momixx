// Layers of a typical shielded USB-C data cable, outside in, for the
// "anatomy of a silicone cable" infographic. Plain data (no Three.js).

type Vec3 = [number, number, number]

export type CableLayer = {
  id: string
  name: string
  body: string
  momixx?: boolean
  /** Which side of the cable its label sits on, on wide screens (labels alternate, so none collide). */
  side: 'above' | 'below'
}

export const cableLayers: CableLayer[] = [
  {
    id: 'jacket',
    name: 'Silicone outer layer',
    body: 'MoMixx MM flame-retardant silicone. It is soft and supple, and stops burning once the flame is removed. In MoMixx testing it withstood 10,000 twisting cycles and 250 °C.',
    momixx: true,
    side: 'above',
  },
  { id: 'braid', name: 'Metal braid', body: 'Woven metal adds more protection from interference, and makes the cable harder to pull apart.', side: 'below' },
  { id: 'foil', name: 'Foil wrap', body: 'A layer of aluminium foil stops outside signals interfering with the data.', side: 'above' },
  { id: 'insulation', name: 'Wire coating', body: 'Each wire has its own coloured coating, which keeps power and data apart.', side: 'below' },
  { id: 'copper', name: 'Copper wires', body: 'Bundles of fine copper strands carry power and data, and stay flexible.', side: 'above' },
]

/** The jacket's colour, from the cable colours in cableColours.ts (teal stays the home hero's own). */
export const anatomyColour = 'white'

/** How far the layers have been pulled apart (0 = stripped in neat steps, 1 = fully exploded). */
export function layerOffsets(e: number) {
  return { jacket: -0.7 * e, core: 0.85 * e }
}

/**
 * Where each layer's label line meets it, for a given explode amount: on the
 * top of the layer for labels above the cable, on its near underside for labels below.
 */
export function layerAnchors(e: number): Record<string, Vec3> {
  const { jacket, core } = layerOffsets(e)
  return {
    jacket: [-1.95 + jacket, 0.78, 0.08],
    braid: [-0.55, -0.44, 0.42],
    foil: [0.35, 0.52, 0.06],
    insulation: [1.0 + core, -0.31, 0.3],
    copper: [2.05 + core, 0.3, 0.2],
  }
}

/**
 * Camera for the infographic and its pre-rendered image. The width it takes in
 * (`hfov`, degrees) is fixed, so the cable spans the stage at any shape: wide
 * on desktops, taller on phones.
 */
export const anatomyView = { position: [3.1, 2.15, 10.2] as Vec3, target: [0.55, -0.05, 0] as Vec3, hfov: 41 }

/** The pre-rendered image's shape (and the stage's on wide screens). */
export const anatomyAspect = 21 / 9

/** Vertical field of view (what three.js uses) that shows `hfov` across at this aspect ratio. */
export function anatomyFov(aspect: number) {
  const h = (anatomyView.hfov * Math.PI) / 360
  return (Math.atan(Math.tan(h) / aspect) * 360) / Math.PI
}

/** The explode amount shown in the pre-rendered image. */
export const anatomyStillExplode = 0.55

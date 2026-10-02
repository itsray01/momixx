// Layers of a typical shielded USB-C data cable, inside out, for the
// "anatomy of a silicone cable" infographic. Plain data (no Three.js).

type Vec3 = [number, number, number]

export type CableLayer = { id: string; name: string; body: string; momixx?: boolean }

export const cableLayers: CableLayer[] = [
  { id: 'copper', name: 'Copper wires', body: 'Bundles of fine copper strands carry power and data, and stay flexible.' },
  { id: 'insulation', name: 'Wire coating', body: 'Each wire has its own coloured coating, which keeps power and data apart.' },
  { id: 'foil', name: 'Foil wrap', body: 'A layer of aluminium foil stops outside signals interfering with the data.' },
  { id: 'braid', name: 'Metal braid', body: 'Woven metal adds more protection from interference, and makes the cable harder to pull apart.' },
  {
    id: 'jacket',
    name: 'Silicone outer layer',
    body: 'Momixx MM fire-safe silicone. It is soft and supple, survived 10,000 twists in our tests, copes with 250 °C and puts itself out if it catches fire.',
    momixx: true,
  },
]

/** How far the layers have been pulled apart (0 = stripped in neat steps, 1 = fully exploded). */
export function layerOffsets(e: number) {
  return { jacket: -0.7 * e, core: 0.85 * e }
}

/** Where each layer's numbered marker sits for a given explode amount. */
export function layerAnchors(e: number): Record<string, Vec3> {
  const { jacket, core } = layerOffsets(e)
  return {
    copper: [2.0 + core, 0.12, 0.25],
    insulation: [1.05 + core, 0.38, 0.2],
    foil: [0.3, 0.56, 0.1],
    braid: [-0.5, 0.64, 0.1],
    jacket: [-1.9 + jacket, 0.8, 0.1],
  }
}

/** Camera for the infographic and its pre-rendered image (4:3). */
export const anatomyView = { position: [3.3, 2.9, 9.8] as Vec3, target: [0.35, 0, 0] as Vec3, fov: 32 }

/** The explode amount shown in the pre-rendered image. */
export const anatomyStillExplode = 0.55

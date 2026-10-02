// Layers of a typical shielded USB-C data cable, inside out, for the
// "anatomy of a silicone cable" infographic. Plain data (no Three.js).

type Vec3 = [number, number, number]

export type CableLayer = { id: string; name: string; body: string; momixx?: boolean }

export const cableLayers: CableLayer[] = [
  { id: 'copper', name: 'Copper conductors', body: 'Fine stranded copper carries power and data, and stays flexible.' },
  { id: 'insulation', name: 'Wire insulation', body: 'Each wire is insulated and colour-coded, keeping power and data signals apart.' },
  { id: 'foil', name: 'Foil shield', body: 'A wrap of aluminium foil blocks electrical interference.' },
  { id: 'braid', name: 'Braided shield', body: 'A woven metal braid adds shielding and pull strength.' },
  {
    id: 'jacket',
    name: 'Silicone jacket',
    body: 'Momixx MM fire-retardant silicone: soft and supple, 10,000 twist cycles in our testing, heat-resistant to 250 °C and self-extinguishing (UL VW-1).',
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

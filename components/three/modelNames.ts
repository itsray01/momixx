// Names of the 3D models in models.tsx. Kept in a plain module so server code
// (and the render script) can read the list without loading Three.js.
export const modelNames = [
  'cable',
  'ev-cable',
  'watchband',
  'phone-case',
  'seal',
  'compound',
  'recycle',
  'bottle',
  'extruder-vertical',
  'extruder-horizontal',
  'mixer',
  'winder',
  'oven',
  'coating',
  'oem',
  'medical',
  'datacentre',
  'robot',
  'chip',
  'sand',
  'molecule',
  'samples',
  'globe',
] as const

export type ModelName = (typeof modelNames)[number]

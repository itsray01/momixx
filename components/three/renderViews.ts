// Camera framing for models whose pre-rendered image must match a live view
// exactly (so numbered markers line up, or the still and the 3D cross-fade
// without a jump). Others use the default 4:3 studio shot.
import { anatomyView } from './cableLayers'
import { extruderOverview } from './extruderParts'
import { heroCamera } from './heroProgress'
import type { ModelName } from './modelNames'

type View = {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
  /** Height of the shadow-catching floor; omit for a model that floats with no floor. */
  floor?: number
  /** Image size in pixels (default 1200 × 900). */
  size?: [number, number]
  /** Fade distant parts into the page background, as the live scene does. */
  fog?: [number, number]
}

export const defaultView: View = { position: [0, 0.9, 10], target: [0, 0, 0], fov: 30, floor: -2.1 }

export const renderViews: Partial<Record<ModelName, View>> = {
  'extruder-line': { ...extruderOverview, floor: 0.001 },
  'cable-anatomy': { ...anatomyView, floor: -1.25 },
  // The home hero's right-hand column (about 4:5) at the start of the scroll.
  'cable-hero': { ...heroCamera, size: [960, 1200], fog: [9, 16] },
}

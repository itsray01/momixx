// Camera framing for models whose pre-rendered image must match a live,
// interactive view exactly (so numbered markers line up). Others use the default.
import { anatomyView } from './cableLayers'
import { extruderOverview } from './extruderParts'
import type { ModelName } from './modelNames'

type View = { position: [number, number, number]; target: [number, number, number]; fov: number; floor: number }

export const renderViews: Partial<Record<ModelName, View>> = {
  'extruder-line': { ...extruderOverview, floor: 0.001 },
  'cable-anatomy': { ...anatomyView, floor: -1.25 },
}

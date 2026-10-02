import type { ModelName } from '@/components/three/modelNames'
import type { SceneVariant } from './scenes'

// Every illustration has a matching 3D model of the same name; the vertical
// extruder gets the animated line.
export function sceneFor(illustration: ModelName | undefined): SceneVariant {
  if (!illustration) return 'samples'
  if (illustration === 'extruder-vertical') return 'extrusion'
  return illustration
}

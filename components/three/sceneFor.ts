import type { ModelName } from '@/components/three/modelNames'
import type { SceneVariant } from './scenes'

// Every illustration has a matching 3D model of the same name.
export function sceneFor(illustration: ModelName | undefined): SceneVariant {
  return illustration ?? 'samples'
}

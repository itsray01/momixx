import type { IllustrationName } from '@/components/Illustration'
import type { SceneVariant } from './scenes'

// Which 3D scene to show for a product or application, based on its illustration.
const map: Partial<Record<IllustrationName, SceneVariant>> = {
  cable: 'cable',
  'ev-cable': 'ev-cable',
  datacentre: 'cable',
  robot: 'cable',
  'extruder-vertical': 'extrusion',
  'extruder-horizontal': 'extrusion',
  coating: 'extrusion',
  oven: 'extrusion',
  mixer: 'extrusion',
  winder: 'extrusion',
  recycle: 'loop',
}

export function sceneFor(illustration: IllustrationName | undefined): SceneVariant {
  return (illustration && map[illustration]) || 'samples'
}

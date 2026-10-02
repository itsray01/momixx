// Projects the numbered markers of the interactive 3D models onto their
// pre-rendered images (4:3), so the no-WebGL fallback markers sit exactly where
// they do in 3D. Re-run after moving a marker or changing a camera.
//
//   node scripts/extruder-hotspots.mjs     (Node 22.18+, which runs .ts imports)
import { writeFileSync } from 'node:fs'
import * as THREE from 'three'
import { anatomyStillExplode, anatomyView, cableLayers, layerAnchors } from '../components/three/cableLayers.ts'
import { extruderOverview, extruderParts } from '../components/three/extruderParts.ts'

function project(view, points) {
  const camera = new THREE.PerspectiveCamera(view.fov, 4 / 3, 0.1, 100)
  camera.position.set(...view.position)
  camera.lookAt(...view.target)
  camera.updateMatrixWorld()
  return Object.fromEntries(
    Object.entries(points).map(([id, p]) => {
      const v = new THREE.Vector3(...p).project(camera)
      return [id, { x: +(((v.x + 1) / 2) * 100).toFixed(1), y: +(((1 - v.y) / 2) * 100).toFixed(1) }]
    }),
  )
}

const extruder = project(extruderOverview, Object.fromEntries(extruderParts.map((p) => [p.id, p.anchor])))
writeFileSync('components/three/extruderHotspots.json', JSON.stringify(extruder, null, 2) + '\n')

const anchors = layerAnchors(anatomyStillExplode)
const cable = project(anatomyView, Object.fromEntries(cableLayers.map((l) => [l.id, anchors[l.id]])))
writeFileSync('components/three/cableHotspots.json', JSON.stringify(cable, null, 2) + '\n')
console.log({ extruder, cable })

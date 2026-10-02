// Projects each explorer part's 3D marker position onto the pre-rendered
// overview image (public/renders/extruder-line.webp, 4:3), so the markers on the
// no-WebGL fallback sit in the same place as in 3D.
//
//   node scripts/extruder-hotspots.mjs     (Node 22.18+, which runs .ts imports)
import { writeFileSync } from 'node:fs'
import * as THREE from 'three'
import { extruderOverview, extruderParts } from '../components/three/extruderParts.ts'

const camera = new THREE.PerspectiveCamera(extruderOverview.fov, 4 / 3, 0.1, 100)
camera.position.set(...extruderOverview.position)
camera.lookAt(...extruderOverview.target)
camera.updateMatrixWorld()

const out = {}
for (const p of extruderParts) {
  const v = new THREE.Vector3(...p.anchor).project(camera)
  out[p.id] = { x: +(((v.x + 1) / 2) * 100).toFixed(1), y: +(((1 - v.y) / 2) * 100).toFixed(1) }
}
writeFileSync('components/three/extruderHotspots.json', JSON.stringify(out, null, 2) + '\n')
console.log(out)

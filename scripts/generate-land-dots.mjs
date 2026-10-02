// Regenerates components/three/landDots.ts: land points for the Locations globe.
//
//   npm install --no-save world-atlas topojson-client d3-geo
//   node scripts/generate-land-dots.mjs
//
// Samples a Fibonacci sphere (evenly spaced points) and keeps those that fall on
// land in Natural Earth's 1:110m map (public domain), skipping Antarctica.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { feature } from 'topojson-client'
import { geoContains } from 'd3-geo'

const require = createRequire(import.meta.url)
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'))
const land = feature(topo, topo.objects.land)
const N = 14000
const golden = Math.PI * (3 - Math.sqrt(5))
const out = []
for (let i = 0; i < N; i++) {
  const lat = (Math.asin(1 - (i / (N - 1)) * 2) * 180) / Math.PI
  const lon = ((((i * golden * 180) / Math.PI) % 360) + 540) % 360 - 180
  if (lat < -60) continue
  if (geoContains(land, [lon, lat])) out.push(Math.round(lat * 10) / 10, Math.round(lon * 10) / 10)
}
writeFileSync(
  'components/three/landDots.ts',
  `// Generated from Natural Earth (public domain) via world-atlas: land points on a
// Fibonacci sphere, as flat [lat, lon, lat, lon, …] pairs. Regenerate rather than edit.
export const landDots = new Float32Array([${out.join(',')}])
`,
)
console.log(`${out.length / 2} land points`)

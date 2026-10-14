// Removes the faint shadow haze from the transparent renders in public/renders/.
//
//   node scripts/dehaze-renders.mjs [file ...]      (default: every .webp in public/renders)
//
// The contact shadows are blurred so widely that a few units of alpha reach every edge of
// the canvas. On the old black site that was invisible; on paper it shows as a grey box
// around each picture. This lifts the floor: alpha at or below LOW goes to 0, alpha from
// HIGH up is untouched, and the ramp between is smooth, so the real shadow under each
// object keeps its soft edge. scripts/render-models.mjs runs the same step on new renders.
import sharp from 'sharp'
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const LOW = 8
const HIGH = 36

/** Alpha remap: a * smoothstep(LOW, HIGH, a). */
export function dehazeAlpha(alpha) {
  if (alpha <= LOW) return 0
  if (alpha >= HIGH) return alpha
  const t = (alpha - LOW) / (HIGH - LOW)
  return Math.round(alpha * t * t * (3 - 2 * t))
}

/** Reads a PNG/WebP buffer, lifts the alpha floor and returns a WebP buffer. */
export async function dehaze(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 3; i < data.length; i += 4) data[i] = dehazeAlpha(data[i])
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 86, alphaQuality: 90 }).toBuffer()
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = 'public/renders'
  const files = process.argv.length > 2 ? process.argv.slice(2) : (await readdir(dir)).filter((f) => f.endsWith('.webp')).map((f) => join(dir, f))
  for (const file of files) {
    await writeFile(file, await dehaze(file))
    console.log('dehazed', file)
  }
}

// Renders every 3D model to a transparent WebP in public/renders/.
//
//   ENABLE_RENDER=1 npm run build && ENABLE_RENDER=1 npm start   (or: npm run dev)
//   node scripts/render-models.mjs [baseUrl] [model ...]
//
// A model can be followed by @colour (cables only), e.g. cable-hero@white,
// which writes cable-hero-white.webp.
//
// Needs Playwright + Chromium with WebGL (software rendering is fine).
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const base = process.argv[2] ?? 'http://localhost:3000'
// The home hero cable's colours: keep in step with components/three/cableColours.ts.
const cableColourIds = ['teal', 'white', 'graphite', 'orange', 'lilac', 'sand', 'sage', 'rose']
const all = [
  ...cableColourIds.flatMap((c) => [`cable-hero@${c}`, `data-cable@${c}`]),
  'data-cable', 'ev-cable', 'watchband', 'phone-case', 'seal', 'compound', 'recycle', 'bottle',
  'extruder-vertical', 'extruder-horizontal', 'mixer', 'winder', 'oven', 'coating', 'oem',
  'medical', 'datacentre', 'robot', 'chip', 'sand', 'molecule', 'samples', 'globe', 'extruder-line', 'cable-anatomy',
]
const names = process.argv.length > 3 ? process.argv.slice(3) : all

await mkdir('public/renders', { recursive: true })
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } })
for (const job of names) {
  const [name, colour] = job.split('@')
  const out = colour ? `${name}-${colour}` : name
  await page.goto(`${base}/render/${name}${colour ? `?colour=${colour}` : ''}`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__renderReady === true, null, { timeout: 180000 })
  // Read the WebGL canvas directly: exact pixels with transparency, nothing overlapping.
  const { dataUrl, width, height } = await page.evaluate(() => {
    const stage = document.querySelector('#stage')
    return { dataUrl: stage.querySelector('canvas').toDataURL('image/png'), width: stage.clientWidth, height: stage.clientHeight }
  })
  const png = Buffer.from(dataUrl.split(',')[1], 'base64')
  await sharp(png).resize(width, height).webp({ quality: 86, alphaQuality: 90 }).toFile(`public/renders/${out}.webp`)
  console.log('rendered', out)
}
await browser.close()

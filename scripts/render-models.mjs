// Renders every 3D model to a transparent WebP in public/renders/.
//
//   ENABLE_RENDER=1 npm run build && ENABLE_RENDER=1 npm start   (or: npm run dev)
//   node scripts/render-models.mjs [baseUrl] [model ...]
//
// Needs Playwright + Chromium with WebGL (software rendering is fine).
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const base = process.argv[2] ?? 'http://localhost:3000'
const all = [
  'cable', 'ev-cable', 'watchband', 'phone-case', 'seal', 'compound', 'recycle', 'bottle',
  'extruder-vertical', 'extruder-horizontal', 'mixer', 'winder', 'oven', 'coating', 'oem',
  'medical', 'datacentre', 'robot', 'chip', 'sand', 'molecule', 'samples', 'globe',
]
const names = process.argv.length > 3 ? process.argv.slice(3) : all

await mkdir('public/renders', { recursive: true })
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
for (const name of names) {
  await page.goto(`${base}/render/${name}`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__renderReady === true, null, { timeout: 60000 })
  // Read the WebGL canvas directly: exact pixels with transparency, nothing overlapping.
  const dataUrl = await page.evaluate(() => document.querySelector('#stage canvas').toDataURL('image/png'))
  const png = Buffer.from(dataUrl.split(',')[1], 'base64')
  await sharp(png).resize(1200, 900).webp({ quality: 86, alphaQuality: 90 }).toFile(`public/renders/${name}.webp`)
  console.log('rendered', name)
}
await browser.close()

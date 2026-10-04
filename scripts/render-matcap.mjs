// Bakes the hero studio's lighting into public/renders/matcap-studio.webp, for the
// hero cable's lite surfaces (see components/three/studioMatcap.ts).
//
//   ENABLE_RENDER=1 npm run build && ENABLE_RENDER=1 npm start   (or: npm run dev)
//   node scripts/render-matcap.mjs [baseUrl]
//
// Renders a sphere three times (matte, glossy reflection, metal) and packs them
// into the red, green and blue channels of one image. Prints each channel's
// brightest value: keep them below 255 (adjust MATCAP_SCALE if not).
import { chromium } from 'playwright'
import sharp from 'sharp'

const base = process.argv[2] ?? 'http://localhost:3000'
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 400, height: 400 } })
const S = 256
// Only the disk inside this radius is sampled; beyond it the edge colour is
// carried outwards, so the cable's silhouettes never pick up the background.
const inner = S * 0.485
const channels = []
for (const kind of ['diffuse', 'specular', 'metal']) {
  await page.goto(`${base}/render/matcap?kind=${kind}`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__renderReady === true, null, { timeout: 180000 })
  const dataUrl = await page.evaluate(() => document.querySelector('#stage canvas').toDataURL('image/png'))
  const grey = await sharp(Buffer.from(dataUrl.split(',')[1], 'base64')).resize(S, S).extractChannel(0).raw().toBuffer()
  const out = Buffer.from(grey)
  let brightest = 0
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = x + 0.5 - S / 2
      const dy = y + 0.5 - S / 2
      const d = Math.hypot(dx, dy)
      if (d <= inner) brightest = Math.max(brightest, grey[y * S + x])
      else {
        const sx = Math.min(S - 1, Math.max(0, Math.floor(S / 2 + (dx / d) * inner)))
        const sy = Math.min(S - 1, Math.max(0, Math.floor(S / 2 + (dy / d) * inner)))
        out[y * S + x] = grey[sy * S + sx]
      }
    }
  }
  console.log(kind, 'brightest', brightest)
  channels.push(out)
}
const rgb = Buffer.alloc(S * S * 3)
for (let i = 0; i < S * S; i++) for (let c = 0; c < 3; c++) rgb[i * 3 + c] = channels[c][i]
await sharp(rgb, { raw: { width: S, height: S, channels: 3 } }).webp({ lossless: true, effort: 6 }).toFile('public/renders/matcap-studio.webp')
console.log('wrote public/renders/matcap-studio.webp')
await browser.close()

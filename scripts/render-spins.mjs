// Renders the machine clips in public/videos/: each model turning once on a paper
// background, 10 seconds at 24 fps, with a poster frame.
//
//   ENABLE_RENDER=1 npm run build && ENABLE_RENDER=1 npm start   (or: npm run dev)
//   node scripts/render-spins.mjs [baseUrl] [model ...]
//
// Needs Playwright + Chromium with WebGL (software rendering is fine) and ffmpeg.
// Frames come from /render/<model>?spin=1 (see app/render/[model]/RenderCanvas.tsx),
// as transparent PNGs with the same studio light and contact shadow as the stills;
// ffmpeg lays them on the page's paper colour and encodes H.264.
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const base = process.argv[2] ?? 'http://localhost:3000'
const all = ['extruder-horizontal', 'mixer', 'winder', 'oven', 'coating']
const names = process.argv.length > 3 ? process.argv.slice(3) : all
const FPS = 24
const SECONDS = 10
const FRAMES = FPS * SECONDS
const PAPER = '#f7f7f4'

await mkdir('public/videos', { recursive: true })
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1000, height: 760 } })
for (const name of names) {
  const dir = await mkdtemp(join(tmpdir(), `spin-${name}-`))
  await page.goto(`${base}/render/${name}?spin=1`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__renderReady === true, null, { timeout: 180000 })
  for (let i = 0; i < FRAMES; i++) {
    const yaw = (i / FRAMES) * Math.PI * 2
    // Set the yaw, then wait for the next frame: useFrame applies the yaw before that frame is drawn.
    const drawn = await page.evaluate((y) => {
      window.__yaw = y
      return window.__frames ?? 0
    }, yaw)
    await page.waitForFunction((n) => (window.__frames ?? 0) >= n + 1, drawn, { timeout: 60000 })
    const dataUrl = await page.evaluate(() => document.querySelector('#stage canvas').toDataURL('image/png'))
    await writeFile(join(dir, `f${String(i).padStart(4, '0')}.png`), Buffer.from(dataUrl.split(',')[1], 'base64'))
    if (i % 24 === 0) console.log(name, `${i}/${FRAMES}`)
  }
  // Paper behind the transparent frames, then H.264 that every browser plays.
  const onPaper = (extra) => ['-y', '-f', 'lavfi', '-i', `color=c=${PAPER}:s=960x720:r=${FPS}`, '-framerate', String(FPS), '-i', join(dir, 'f%04d.png'), '-filter_complex', '[0:v][1:v]overlay=shortest=1,format=yuv420p', ...extra]
  execFileSync('ffmpeg', [...onPaper(['-c:v', 'libx264', '-crf', '22', '-preset', 'slow', '-movflags', '+faststart', `public/videos/${name}.mp4`])], { stdio: 'inherit' })
  execFileSync('ffmpeg', ['-y', '-f', 'lavfi', '-i', `color=c=${PAPER}:s=960x720`, '-i', join(dir, 'f0000.png'), '-filter_complex', '[0:v][1:v]overlay=shortest=1', '-frames:v', '1', '-q:v', '3', `public/videos/${name}-poster.jpg`], { stdio: 'inherit' })
  await rm(dir, { recursive: true, force: true })
  console.log('rendered', name)
}
await browser.close()

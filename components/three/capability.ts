// When to run live 3D: shared by every 3D scene on the site.

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i
type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } }

/**
 * The graphics renderer WebGL reports, or null without WebGL. Asked once per
 * page, in a worker, so starting WebGL never blocks the page. Without a worker
 * (older Safari, for example), or if it errors or stays silent for 3 seconds,
 * the same check runs on the main thread while the browser is idle.
 */
let rendererPromise: Promise<string | null> | undefined

function readRendererNow(): string | null {
  const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl')
  if (!gl) return null
  let name = String(gl.getParameter(gl.RENDERER))
  if (/^webkit webgl$/i.test(name)) {
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    if (info) name = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
  }
  gl.getExtension('WEBGL_lose_context')?.loseContext()
  return name
}

function readRendererWhenIdle(): Promise<string | null> {
  return new Promise((resolve) => {
    const run = () => {
      try {
        resolve(readRendererNow())
      } catch {
        resolve(null)
      }
    }
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 2500 })
    else window.setTimeout(run, 300)
  })
}

/** A worker can create an OffscreenCanvas and ask it for WebGL. */
function workerProbeAvailable() {
  if (typeof Worker !== 'function' || typeof OffscreenCanvas !== 'function') return false
  try {
    return typeof new OffscreenCanvas(1, 1).getContext === 'function'
  } catch {
    return false
  }
}

function probeInWorker(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    let worker: Worker
    try {
      worker = new Worker(new URL('./gpuProbe.worker.ts', import.meta.url))
    } catch (error) {
      reject(error instanceof Error ? error : new Error('graphics check failed'))
      return
    }
    let settled = false
    const finish = (fn: () => void) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      worker.terminate()
      fn()
    }
    const timer = window.setTimeout(() => finish(() => reject(new Error('graphics check timed out'))), 3000)
    worker.onmessage = (event: MessageEvent<unknown>) => {
      const data = event.data
      if (typeof data === 'string' || data === null) finish(() => resolve(data))
      else finish(() => reject(new Error('graphics check returned nothing usable')))
    }
    worker.onerror = (event) => {
      event.preventDefault()
      finish(() => reject(new Error('graphics check failed')))
    }
  })
}

function readRenderer(): Promise<string | null> {
  rendererPromise ??= (async () => {
    if (workerProbeAvailable()) {
      try {
        return await probeInWorker()
      } catch {
        // Older browsers, a blocked worker, or no answer within 3 seconds.
      }
    }
    return readRendererWhenIdle()
  })()
  return rendererPromise
}

const desktopWithMouse = () => window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches
// Only data saver and 2G: browsers often guess "3g" on ordinary Wi-Fi with high latency.
const savingData = (nav: Nav) => !!nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType ?? '')
/** Whether the visitor has asked to save data (or is on 2G): no 3D downloads then. */
export const prefersLowData = () => savingData(navigator as Nav)

/**
 * Live 3D for the optional scenes (the extruder explorer, the cable anatomy)
 * only runs where it will be smooth and worth the download: a desktop-sized
 * screen with a mouse or trackpad, a real GPU, enough memory and no data
 * saver or 2G connection. Everyone else keeps the still image of the model.
 * Waits for the same background graphics check as the home hero.
 */
let capablePromise: Promise<boolean> | undefined
export function canRun3D() {
  capablePromise ??= (async () => {
    try {
      const nav = navigator as Nav
      // On touch screens, dragging a model fights with scrolling.
      if (!desktopWithMouse() || savingData(nav)) return false
      if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false
      const renderer = await readRenderer()
      return renderer !== null && !SOFTWARE.test(renderer)
    } catch {
      return false
    }
  })()
  return capablePromise
}

export type HeroTier = 'high' | 'mid' | 'low'
export type HeroProfile = { run: boolean; tier: HeroTier; reason: string }
let hero: HeroProfile | null = null
const heroListeners = new Set<() => void>()

/** Tells the home hero when the background graphics check has answered. */
export function subscribeHero(onChange: () => void) {
  heroListeners.add(onChange)
  return () => {
    heroListeners.delete(onChange)
  }
}

/**
 * The home hero's cable runs live on every device that can draw WebGL; what
 * changes is how much detail it starts with. `low` is for software rendering
 * (no usable graphics card), `mid` for phones, tablets and low-memory devices,
 * `high` for desktops with a real GPU. The scene then measures itself and
 * lowers its resolution further if it still can't hold a smooth frame rate.
 * The still image stands in without WebGL, with data saver or a 2G connection,
 * and with software rendering on a phone, tablet or small window: there the
 * live cable blocks the main thread for seconds, while a desktop-sized screen
 * with software rendering still runs at the `low` tier. Add ?tier=low|mid|high
 * to try a tier; that still forces the live cable, including on a small screen
 * with software rendering.
 *
 * Null until the background check answers (and on the server). The still image
 * is already on screen, so the page does not jump when this arrives.
 */
export function heroProfile(): HeroProfile | null {
  return hero
}

function publishHero(profile: HeroProfile) {
  if (hero) return
  hero = profile
  heroListeners.forEach((onChange) => onChange())
}

function decideHero(renderer: string | null): HeroProfile {
  const nav = navigator as Nav
  if (renderer === null) return { run: false, tier: 'low', reason: 'WebGL unavailable' }
  let tier: HeroTier = 'high'
  let reason = `GPU: ${renderer}`
  if (SOFTWARE.test(renderer)) {
    tier = 'low'
    reason = `software rendering, no graphics card in use (${renderer})`
  } else if (!desktopWithMouse()) {
    tier = 'mid'
    reason = `phone, tablet or small window · ${renderer}`
  } else if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) {
    tier = 'mid'
    reason = `low memory (${nav.deviceMemory} GB) · ${renderer}`
  }
  const forced = new URLSearchParams(window.location.search).get('tier')
  if (forced === 'low' || forced === 'mid' || forced === 'high') {
    tier = forced
    reason += ` · tier set to ${forced} by ?tier`
  } else if (SOFTWARE.test(renderer) && !desktopWithMouse()) {
    return { run: false, tier: 'low', reason: 'software rendering on a small screen' }
  }
  return { run: true, tier, reason }
}

function startHero() {
  try {
    if (savingData(navigator as Nav)) {
      hero = { run: false, tier: 'low', reason: 'data saver or 2G connection' }
      return
    }
    // As soon as this module loads: the worker no longer blocks the page.
    void readRenderer().then(
      (renderer) => publishHero(decideHero(renderer)),
      () => publishHero({ run: false, tier: 'low', reason: 'error while checking' }),
    )
  } catch {
    hero = { run: false, tier: 'low', reason: 'error while checking' }
  }
}

if (typeof window !== 'undefined') startHero()

/** Runs after the page has loaded and the browser is idle, so 3D never delays first paint. */
export function afterLoadIdle(cb: () => void) {
  let cancelled = false
  let handle = 0
  // Safari has no requestIdleCallback.
  const hasIdle = typeof window.requestIdleCallback === 'function'
  const run = () => {
    if (cancelled) return
    handle = hasIdle ? window.requestIdleCallback(() => !cancelled && cb(), { timeout: 2500 }) : window.setTimeout(() => !cancelled && cb(), 300)
  }
  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
  return () => {
    cancelled = true
    window.removeEventListener('load', run)
    if (hasIdle) window.cancelIdleCallback(handle)
    else window.clearTimeout(handle)
  }
}

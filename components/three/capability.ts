// When to run live 3D: shared by every 3D scene on the site.

let capable: boolean | undefined
let renderer: string | null | undefined

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i
type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } }

/**
 * The graphics renderer WebGL reports, or null without WebGL. Asked once per
 * page: without a graphics card, starting WebGL can take most of a second.
 */
function readRenderer(): string | null {
  if (renderer !== undefined) return renderer
  const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl')
  if (!gl) return (renderer = null)
  let name = String(gl.getParameter(gl.RENDERER))
  if (/^webkit webgl$/i.test(name)) {
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    if (info) name = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
  }
  gl.getExtension('WEBGL_lose_context')?.loseContext()
  return (renderer = name)
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
 */
export function canRun3D() {
  if (capable !== undefined) return capable
  capable = false
  try {
    const nav = navigator as Nav
    // On touch screens, dragging a model fights with scrolling.
    if (!desktopWithMouse() || savingData(nav)) return capable
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return capable
    const renderer = readRenderer()
    capable = renderer !== null && !SOFTWARE.test(renderer)
  } catch {
    capable = false
  }
  return capable
}

export type HeroTier = 'high' | 'mid' | 'low'
export type HeroProfile = { run: boolean; tier: HeroTier; reason: string }
let hero: HeroProfile | undefined

/**
 * The home hero's cable runs live on every device that can draw WebGL; what
 * changes is how much detail it starts with. `low` is for software rendering
 * (no usable graphics card), `mid` for phones, tablets and low-memory devices,
 * `high` for desktops with a real GPU. The scene then measures itself and
 * lowers its resolution further if it still can't hold a smooth frame rate.
 * Only without WebGL, or with data saver or a 2G connection, does the hero
 * fall back to its still image. Add ?tier=low|mid|high to try a tier.
 */
export function heroProfile(): HeroProfile {
  if (hero) return hero
  try {
    const nav = navigator as Nav
    if (savingData(nav)) return (hero = { run: false, tier: 'low', reason: 'data saver or 2G connection' })
    const renderer = readRenderer()
    if (renderer === null) return (hero = { run: false, tier: 'low', reason: 'WebGL unavailable' })
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
    }
    return (hero = { run: true, tier, reason })
  } catch {
    return (hero = { run: false, tier: 'low', reason: 'error while checking' })
  }
}

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

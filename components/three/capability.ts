// When to run live 3D: shared by every 3D scene on the site.

let capable: boolean | undefined
let reason = ''

/**
 * Live 3D only runs where it will be smooth and worth the download: a desktop-
 * sized screen with a mouse or trackpad, a real GPU, enough memory and no
 * data-saver or 2G connection. Phones, tablets and everyone else keep the
 * still image, which shows the same model.
 */
export function canRun3D() {
  if (capable !== undefined) return capable
  capable = false
  try {
    // ?force3d runs live 3D regardless (for testing on machines that would get the still).
    if (new URLSearchParams(window.location.search).has('force3d')) {
      reason = 'forced on with ?force3d'
      return (capable = true)
    }
    // Touch screens and small windows: dragging a model fights with scrolling, and the download costs battery and data.
    if (!window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches) {
      reason = 'small window or touch screen'
      return capable
    }
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } }
    // Only data saver and 2G: browsers often guess "3g" on ordinary Wi-Fi with high latency.
    if (nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType ?? '')) {
      reason = 'data saver or 2G connection'
      return capable
    }
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) {
      reason = `low memory (${nav.deviceMemory} GB)`
      return capable
    }
    const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl')
    if (!gl) {
      reason = 'WebGL unavailable'
      return capable
    }
    let renderer = String(gl.getParameter(gl.RENDERER))
    if (/^webkit webgl$/i.test(renderer)) {
      const info = gl.getExtension('WEBGL_debug_renderer_info')
      if (info) renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    // Software rendering (no GPU available) is far too slow for real-time 3D.
    capable = !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)
    reason = capable ? `GPU: ${renderer}` : `no hardware graphics (${renderer})`
  } catch {
    capable = false
    reason = 'error while checking'
  }
  return capable
}

/** Why live 3D is on or off on this device, for the ?debug3d readout. */
export function why3D() {
  canRun3D()
  return reason
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

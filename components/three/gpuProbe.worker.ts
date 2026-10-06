// Reads the graphics renderer away from the page. Starting WebGL on the main
// thread can freeze a phone that is drawing with software, so the check lives
// here and only the name is sent back.

const canvas = new OffscreenCanvas(1, 1)
const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')

let renderer: string | null = null
if (gl) {
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const unmasked = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : null
  renderer = unmasked ? String(unmasked) : String(gl.getParameter(gl.RENDERER))
  gl.getExtension('WEBGL_lose_context')?.loseContext()
}

// A classic worker: postMessage is on the worker global, not the page.
;(globalThis as unknown as { postMessage(message: string | null): void }).postMessage(renderer)

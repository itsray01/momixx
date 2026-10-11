'use client'

import { useEffect, useRef, useState } from 'react'
import { heroReady } from './three/heroReady'

// Soft beams of light falling on the hero cable from the top right, like a studio spotlight.
//
// One small WebGL shader, neutral grey only. Everyone gets a still CSS glow; on desktops with a
// graphics card the moving beams fade in over it once the hero cable is showing. The beams draw at
// reduced resolution and 30 fps, stop while the hero is off screen, and hold still for visitors
// who prefer reduced motion. Marked data-decor, so it steps aside in hero-lite (no graphics card).

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uT;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float ar = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * ar, uv.y);
  // The light sits just above the top right corner and points down towards the cable.
  vec2 d = p - vec2(0.8 * ar, 1.15);
  float r = length(d);
  float ang = atan(d.x, -d.y);
  float rays = noise(vec2(ang * 14.0, uT * 0.3)) * 0.6 + noise(vec2(ang * 31.0 + 3.0, uT * 0.42)) * 0.4;
  rays = pow(rays, 2.0);
  float cone = smoothstep(0.85, 0.1, abs(ang + 0.22));
  float haze = 0.55 + 0.45 * fbm(p * 2.5 + vec2(uT * 0.03, -uT * 0.05));
  float beams = rays * cone * exp(-r * 1.05) * haze;
  float glow = exp(-r * 2.0) * 0.4 * cone;
  gl_FragColor = vec4(vec3(0.02) + vec3(0.85) * beams + vec3(0.6) * glow, 1.0);
}`

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'
const SCALE = 0.6 // soft light, so 60 % of the screen resolution is plenty
const FRAME_MS = 33 // about 30 fps

function run(canvas: HTMLCanvasElement, onFirstFrame: () => void): () => void {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' })
  if (!gl) return () => {}
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = shader(gl.VERTEX_SHADER, VERT)
  const fs = shader(gl.FRAGMENT_SHADER, FRAG)
  const prog = gl.createProgram()
  if (!vs || !fs || !prog) return () => {}
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.bindAttribLocation(prog, 0, 'a')
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {}
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  const uRes = gl.getUniformLocation(prog, 'uRes')
  const uT = gl.getUniformLocation(prog, 'uT')

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const t0 = performance.now()
  let raf = 0
  let last = -Infinity
  let visible = true
  let first = true
  let lost = false

  const draw = (now: number) => {
    gl.uniform2f(uRes, canvas.width, canvas.height)
    gl.uniform1f(uT, 20 + (now - t0) / 1000)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    if (first) {
      first = false
      onFirstFrame()
    }
  }
  const loop = (now: number) => {
    raf = 0
    if (!visible || lost) return
    if (now - last >= FRAME_MS) {
      last = now
      draw(now)
    }
    if (!reduced.matches) raf = requestAnimationFrame(loop)
  }
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop)
  }
  const resize = () => {
    const k = Math.min(window.devicePixelRatio || 1, 1.5) * SCALE
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * k))
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * k))
    gl.viewport(0, 0, canvas.width, canvas.height)
    last = -Infinity
    kick()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  const io = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting
    if (visible) kick()
  })
  io.observe(canvas)
  const onLost = (e: Event) => {
    e.preventDefault()
    lost = true
  }
  canvas.addEventListener('webglcontextlost', onLost)
  resize()

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    canvas.removeEventListener('webglcontextlost', onLost)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}

export function HeroSpotlight() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // Desktops only; phones and tablets keep the still glow.
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return
    let stop = () => {}
    const start = () => {
      // No graphics card (hero-lite): leave every frame to the cable.
      if (document.documentElement.classList.contains('hero-lite')) return
      stop = run(canvas, () => setLive(true))
    }
    if (heroReady.get()) start()
    else {
      const unsubscribe = heroReady.subscribe(() => {
        unsubscribe()
        start()
      })
      stop = unsubscribe
    }
    return () => stop()
  }, [])

  return (
    <div data-decor="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(55%_75%_at_80%_-12%,rgb(255_255_255/0.13),rgb(255_255_255/0.04)_45%,transparent_75%)]" />
      <canvas ref={ref} className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${live ? 'opacity-100' : 'opacity-0'}`} />
      {/* Keeps the words readable: darker on the text side and under the header. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(5_5_5/0.88)_0%,rgb(5_5_5/0.6)_32%,transparent_58%),linear-gradient(180deg,rgb(5_5_5/0.7)_0%,transparent_16%)]" />
    </div>
  )
}

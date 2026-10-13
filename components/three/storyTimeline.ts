// The cable story's script (desktop): one number, T, from 0 to STORY_STEPS, set by
// scroll. Each stop below holds still for a stretch of scrolling, so every step can
// be read, and the scroll never has to be caught or snapped. Plain data, shared by
// the page (labels and text) and the 3D scene.
//
//   0      the stripped cable, every label shown
//   1 – 5  one layer at a time: its label lit, the other layers x-rayed
//   6      the labels go, the jacket slides forward over everything (a whole cable)
//   7      a USB-C plug forms on its end as the camera pulls back
//   8      a plain phone slides in from the right; the plug waits by its port
//   9      the plug goes in and it charges

import { cableLayers } from './cableLayers'

export const STORY_STEPS = 9
/** The steps that hold still (6 is passed through on the way to 7). */
export const STORY_STOPS = [0, 1, 2, 3, 4, 5, 7, 8, 9]
/** Scrolling, in screen heights, that each stop holds still for, and that each step of movement takes. */
const HOLD = 0.22
const MOVE = 0.32
/** The whole story's scrolling, in screen heights (the section is this much taller than the screen). */
export const STORY_SCREENS = STORY_STOPS.length * HOLD + STORY_STEPS * MOVE

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
/** 0 before `a`, 1 after `b`, eased in between. */
export const span = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}

/** T for how far through the section the page has scrolled (0 to 1): held at each stop, eased between. */
export function storyFromProgress(p: number) {
  let d = clamp01(p) * STORY_SCREENS
  for (let i = 0; i < STORY_STOPS.length; i++) {
    const stop = STORY_STOPS[i]
    if (d <= HOLD) return stop
    d -= HOLD
    const next = STORY_STOPS[i + 1]
    if (next === undefined) return stop
    const len = (next - stop) * MOVE
    if (d <= len) return stop + (next - stop) * span(0, 1, d / len)
    d -= len
  }
  return STORY_STEPS
}

/** Which layer is lit (1–5), or 0 for none. */
export function storyLayer(t: number) {
  if (t < 0.5 || t >= 5.55) return 0
  return Math.min(5, Math.max(1, Math.round(t)))
}

/** The layer id lit in 3D: one layer, 'charge' once charging, or none. */
export function storyHighlight(t: number): string | null {
  if (t >= 8.75) return 'charge'
  const k = storyLayer(t)
  return k ? cableLayers[k - 1].id : null
}

/**
 * The x-ray's scan along the cable, moved by scroll through steps 0 to 5: from one
 * step's lit layer to the next's, `f` of the way. After step 5 the cable is solid
 * again (and the charging x-ray is timed, as it waits for the plug).
 */
export function storySweep(t: number): { from: string | null; to: string | null; f: number } | null {
  if (t >= 5.5) return null
  const lit = (k: number) => (k >= 1 && k <= 5 ? cableLayers[k - 1].id : null)
  if (t >= 5) return { from: lit(5), to: null, f: (t - 5) / 0.5 }
  const k = Math.max(0, Math.floor(t))
  return { from: lit(k), to: lit(k + 1), f: t - k }
}

/** Everything the scene needs at a moment of the story. */
export function storyAt(t: number) {
  return {
    explode: 0.55 + 0.45 * span(0, 0.7, t) - 1 * span(5.3, 6.0, t),
    close: span(5.4, 6.3, t),
    form: span(6.3, 7.0, t),
    camera: span(6.1, 7.6, t),
    /** 1 = the phone is still off to the right, 0 = in place. */
    phoneAway: 1 - span(6.9, 7.9, t),
    /** 0 = the plug waits by the port, 1 = it is in. */
    plugIn: span(8.0, 8.7, t),
    charging: t >= 8.75,
    labels: 1 - span(5.35, 5.85, t),
    pluggedText: span(6.3, 6.9, t),
  }
}

// The cable story's script (desktop): one number, T, from 0 to STORY_STEPS, set by
// scroll. Each whole number is a step the scroll settles on. Plain data, shared by
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
/** The steps the scroll settles on (6 is passed through on the way to 7). */
export const STORY_STOPS = [0, 1, 2, 3, 4, 5, 7, 8, 9]
/** Screen heights of scrolling per step. */
export const STEP_SCREENS = 0.5

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
/** 0 before `a`, 1 after `b`, eased in between. */
export const span = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
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

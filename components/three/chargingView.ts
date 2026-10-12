// Camera and still moment for the charging scene (components/three/CableCharging.tsx).
// Plain data, shared by the live scene, its pre-rendered image and renderViews.ts.

type Vec3 = [number, number, number]

/** Looking down at the phone from the front left, the cable running in from the left edge. `hfov` is the width in view, in degrees. */
export const chargingView = { position: [-1.4, 11.5, 16.5] as Vec3, target: [1.5, 0.1, 0.1] as Vec3, hfov: 40 }

/** The pre-rendered image's shape (and the stage's on wide screens). */
export const chargingAspect = 21 / 9

/** Vertical field of view that shows `hfov` across at this aspect ratio. */
export function chargingFov(aspect: number) {
  const h = (chargingView.hfov * Math.PI) / 360
  return (Math.atan(Math.tan(h) / aspect) * 360) / Math.PI
}

/**
 * On phones and tablets the stage shows only this slice of the wide frame (as
 * fractions of its width), so the phone is larger; the still is cropped to match.
 */
export const narrowCrop = { from: 0.2, to: 0.98 }

/**
 * The camera window (three.js setViewOffset, in fractions) that shows the slice
 * [from, to] of the wide frame on a stage of this aspect ratio, centred vertically.
 * The camera's fov must be chargingFov(chargingAspect): the wide frame's own.
 */
export function chargingWindow(aspect: number, from: number, to: number) {
  const A = chargingAspect
  const k = ((to - from) * A) / aspect
  return { x: (from * A - A / 2 + aspect / 2) / aspect, y: 0.5 - k / 2, size: k }
}

/** The moment shown in the still: plugged in, charging, three-quarters full. */
export const chargingStill = { plug: 1, charge: 1, battery: 0.76, time: 0.42 }

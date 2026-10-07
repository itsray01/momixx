// Where the visitor is in the home hero's scroll story, in steps: 0 is the
// headline, 1 to 3 the heat, fire-safety and durability specs, and 4 the hand-over
// to the page below. Written by GSAP ScrollTrigger from the scrubbed timeline
// (see pins.ts), read every frame by the 3D hero scene and by the spec callouts.
// A plain object avoids re-renders.
export const heroProgress = { value: 0 }

/** The last step: the pinned hero lets go of the page here. */
export const HERO_LAST_STEP = 4

const listeners = new Set<() => void>()

export function setHeroProgress(value: number) {
  if (value === heroProgress.value) return
  heroProgress.value = value
  listeners.forEach((listener) => listener())
}

export function subscribeHeroProgress(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Camera shared by the live hero scene and its pre-rendered still, so the two line up. */
export const heroCamera = { position: [0, 0, 8.5] as [number, number, number], target: [0, 0, 0] as [number, number, number], fov: 35 }

/** The phone framing: the compact 4:3 cable shot, matching its still (renderViews' default view). */
export const cardCamera = { position: [0, 0.9, 10] as [number, number, number], target: [0, 0, 0] as [number, number, number], fov: 30 }

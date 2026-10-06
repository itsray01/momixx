// Shared by the scroll sequence and the hero callouts. No 3D imports: the still
// path must not download Three.js.

export type CalloutId = 'heat' | 'fire' | 'flex'
export type CalloutPoint = { x: number; y: number }
export type CalloutAnchors = Record<CalloutId, CalloutPoint>

/**
 * Where each dot sits on the hero still, as fractions of that image, measured
 * on the jacket surface at the start of the scroll. Heat is the upper jacket,
 * fire safety the middle, durability the lower bend.
 */
export const stillAnchors: CalloutAnchors = {
  heat: { x: 0.5386, y: 0.4042 },
  fire: { x: 0.4533, y: 0.5696 },
  flex: { x: 0.5896, y: 0.807 },
}

let revealed = false
const revealListeners = new Set<() => void>()

/** The callouts have started their one-time entrance. */
export const heroCalloutsRevealed = () => revealed

/** Plays the entrance once. Further calls, including from a scrubbed timeline, do nothing. */
export function revealHeroCallouts() {
  if (revealed) return
  revealed = true
  revealListeners.forEach((listener) => listener())
}

export function subscribeHeroCallouts(listener: () => void) {
  revealListeners.add(listener)
  return () => {
    revealListeners.delete(listener)
  }
}

/** Latest projected jacket points, in pixels of the hero's cable column. Null on the still. */
export const heroAnchorFeed = {
  listener: null as ((anchors: CalloutAnchors | null) => void) | null,
  /** Asks the live scene for one more frame, using the scene's own loop. */
  kick: null as (() => void) | null,
}

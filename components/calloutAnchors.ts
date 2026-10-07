// Shared by the 3D hero scene and the hero callouts. No 3D imports: the still
// path must not download Three.js.

export type CalloutId = 'heat' | 'fire' | 'flex'
export type CalloutPoint = { x: number; y: number }
export type CalloutAnchors = Record<CalloutId, CalloutPoint>

/**
 * Where each dot sits on the hero still, as fractions of that image: on the
 * jacket's left edge (the side facing the specs), at the start of the scroll.
 * Heat is the upper jacket by the conductors, fire safety the jacket mid-way,
 * durability the bend.
 */
export const stillAnchors: CalloutAnchors = {
  heat: { x: 0.3813, y: 0.4278 },
  fire: { x: 0.4811, y: 0.6178 },
  flex: { x: 0.5792, y: 0.7881 },
}

/** Latest projected jacket points, in CSS pixels from the live canvas's top-left corner. Null on the still. */
export const heroAnchorFeed = {
  listener: null as ((anchors: CalloutAnchors | null) => void) | null,
  /** Asks the live scene for one more frame, using the scene's own loop. */
  kick: null as (() => void) | null,
}

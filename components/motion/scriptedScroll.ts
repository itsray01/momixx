// Scrolling done by script rather than by the visitor: the home hero snapping
// to a step, the hero's pin letting go of the page, and ScrollTrigger
// recalculating its pins. pins.ts reports these; the header ignores the
// movement they cause, so it only reacts to the visitor's own scrolling.
// Plain module state: no GSAP, so the header can read it on every page.

let holds = 0
let version = 0

/** Script-driven scrolling has started; pair with `endScriptedScroll`. */
export function startScriptedScroll() {
  holds++
}

/** Script-driven scrolling has stopped. Movement up to now was not the visitor's. */
export function endScriptedScroll() {
  holds = Math.max(0, holds - 1)
  version++
}

/** An instant, script-caused change of position (the pin releasing, say). */
export function markScriptedScroll() {
  version++
}

/** Clears any unfinished hold, e.g. when the page's scroll effects are torn down mid-snap. */
export function resetScriptedScroll() {
  holds = 0
  version++
}

export const scriptedScroll = {
  get active() {
    return holds > 0
  },
  /** Changes whenever script-driven scrolling ends, so readers can start counting afresh. */
  get version() {
    return version
  },
}

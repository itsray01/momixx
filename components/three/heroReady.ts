// Set once the home hero is ready to be seen: the live cable has drawn and
// tuned itself, or the still is showing instead. The welcome screen waits for it.

let ready = false
const listeners = new Set<() => void>()

export const heroReady = {
  get: () => ready,
  set() {
    if (ready) return
    ready = true
    listeners.forEach((l) => l())
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

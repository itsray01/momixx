// Silicone colours for the home hero cable, shared by the swatches under it,
// the live 3D model and its pre-rendered stills. scripts/render-models.mjs
// renders cable-hero-<id>.webp (desktop) and data-cable-<id>.webp (phones) for
// each one; keep its `cableColourIds` list in step with this one.
//
// Kept free of Three.js, so the swatches don't pull the 3D bundle into the page.

import { useSyncExternalStore } from 'react'

export type CableColour = {
  id: string
  name: string
  /** The swatch in the picker. */
  swatch: string
  /** Moulded jacket surface. */
  jacket: string
  /** Soft sheen across the jacket. */
  sheen: string
  /** Matte cut face where the jacket is stripped back. */
  cut: string
  /** Inside wall of the jacket. */
  inner: string
}

export const cableColours: readonly CableColour[] = [
  { id: 'teal', name: 'MoMixx teal', swatch: '#1f9d91', jacket: '#0f8378', sheen: '#7fd9cf', cut: '#1f9d91', inner: '#0b3f3b' },
  { id: 'white', name: 'Arctic white', swatch: '#eceef0', jacket: '#e6e8eb', sheen: '#ffffff', cut: '#cfd4d9', inner: '#b4bac1' },
  { id: 'graphite', name: 'Graphite', swatch: '#3d4249', jacket: '#2a2e33', sheen: '#9aa1a9', cut: '#3b4047', inner: '#15181b' },
  { id: 'orange', name: 'EV orange', swatch: '#e8642c', jacket: '#d9531e', sheen: '#ffb38a', cut: '#e66a35', inner: '#6b2309' },
  { id: 'lilac', name: 'Lilac', swatch: '#a99bdc', jacket: '#9a8bd0', sheen: '#e6e0ff', cut: '#ab9edb', inner: '#463d6b' },
  { id: 'sand', name: 'Sand', swatch: '#cfb999', jacket: '#c4ad8e', sheen: '#fff3e0', cut: '#d2bea2', inner: '#6a5a45' },
  { id: 'sage', name: 'Sage', swatch: '#8fab8c', jacket: '#7d9a7a', sheen: '#dcefd8', cut: '#91ad8e', inner: '#384a37' },
  { id: 'rose', name: 'Rose', swatch: '#e0a0a8', jacket: '#d68e98', sheen: '#ffe1e6', cut: '#e2a3ab', inner: '#74434a' },
]

export const cableColourById = (id: string | undefined) => cableColours.find((c) => c.id === id)

/** How long each colour shows while the pointer rests on the cable. */
export const CABLE_CYCLE_MS = 2400

// The colour on show, shared by the swatches, the live scene and the stills.
let current = 0
const listeners = new Set<() => void>()

export const cableColourStore = {
  get: () => current,
  set(index: number) {
    const next = (index + cableColours.length) % cableColours.length
    if (next === current) return
    current = next
    listeners.forEach((l) => l())
  },
  next() {
    cableColourStore.set(current + 1)
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

/** Index of the colour on show; the server always renders the first (MoMixx teal). */
export function useCableColour() {
  return useSyncExternalStore(cableColourStore.subscribe, cableColourStore.get, () => 0)
}

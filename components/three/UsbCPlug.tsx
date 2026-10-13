'use client'

// A USB-C plug, in the charging scene's units (the cable's radius is CABLE_R),
// shared by the charging scene and the desktop story. It lies along x, pointing
// right, with the cable's axis at y = 0 and the front of the metal tip at x = 0.
//
// Shaped like the familiar white cable: a short, flat oval metal tip (a stadium,
// about three times as wide as it is tall, open at the end); behind it a long,
// flat, boxy body, a little wider than the tip, with small rounded corners and
// softly rounded edges; then a short round neck that steps down to the cable.

import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'

/** The metal tip: 8.3 × 2.6 mm on a real plug, scaled to the cable. */
export const TIP = { length: 0.5, width: 0.56, height: 0.17 }
/** The body behind it: about twice the tip's length, flat and boxy. */
export const BODY = { length: 1.15, width: 0.8, height: 0.36, corner: 0.07, edge: 0.06 }
/** The round neck from the body to the cable. */
export const NECK = { length: 0.3, radius: 0.2, taper: 0.18 }

/** A stadium (a rectangle with fully rounded short sides), w across z and h across y. */
function stadium(w: number, h: number) {
  const r = h / 2
  const s = new THREE.Shape()
  s.moveTo(-(w / 2 - r), -r)
  s.lineTo(w / 2 - r, -r)
  s.absarc(w / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2, false)
  s.lineTo(-(w / 2 - r), r)
  s.absarc(-(w / 2 - r), 0, r, Math.PI / 2, (3 * Math.PI) / 2, false)
  return s
}

/** A rectangle with rounded corners, w across z and h across y. */
function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = w / 2
  const y = h / 2
  s.moveTo(-x + r, -y)
  s.lineTo(x - r, -y)
  s.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x, y - r)
  s.absarc(x - r, y - r, r, 0, Math.PI / 2, false)
  s.lineTo(-x + r, y)
  s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(-x, -y + r)
  s.absarc(-x + r, -y + r, r, Math.PI, (3 * Math.PI) / 2, false)
  return s
}

/** A ring: `outer` with `inner` cut out, for the tip's open end. */
function ring(w: number, h: number, wall: number) {
  const s = stadium(w, h)
  s.holes.push(stadium(w - 2 * wall, h - 2 * wall))
  return s
}

/**
 * Extrudes a shape along x from a to b (the shape is drawn in the y–z plane). A
 * bevel rounds the two end edges; the shape is drawn smaller by the bevel, so the
 * finished piece keeps the size asked for.
 */
function alongX(shape: THREE.Shape, a: number, b: number, bevel = 0) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: b - a - 2 * bevel,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 6,
    curveSegments: 24,
  })
  // ExtrudeGeometry extrudes along +z from z = 0; turn it to run along +x from x = a.
  g.rotateY(Math.PI / 2)
  g.translate(a + bevel, 0, 0)
  g.computeVertexNormals()
  return g
}

export function UsbCPlug({ body, tip }: { body: (i: number) => ReactNode; tip: ReactNode }) {
  const geos = useMemo(() => {
    const tipShell = alongX(ring(TIP.width - 0.02, TIP.height - 0.02, 0.02), -TIP.length, 0, 0.01)
    // The tip's shell fills in at the back, inside the body, so nothing shows through its open end.
    const tipBack = alongX(stadium(TIP.width - 0.03, TIP.height - 0.03), -TIP.length - 0.1, -0.22)
    const e = BODY.edge
    const bodyGeo = alongX(roundedRect(BODY.width - 2 * e, BODY.height - 2 * e, BODY.corner), -TIP.length - BODY.length, -TIP.length, e)
    const neckFrom = -TIP.length - BODY.length
    // The neck: a round collar, then a short step down to the cable's radius.
    const neck = new THREE.CylinderGeometry(NECK.radius, NECK.radius, NECK.length, 40, 1, false)
    neck.rotateZ(Math.PI / 2)
    neck.translate(neckFrom - NECK.length / 2 + 0.04, 0, 0)
    const taper = new THREE.CylinderGeometry(0.16, NECK.radius, NECK.taper, 40, 1, true)
    taper.rotateZ(Math.PI / 2)
    taper.translate(neckFrom - NECK.length + 0.04 - NECK.taper / 2 + 0.001, 0, 0)
    return { tipShell, tipBack, bodyGeo, neck, taper }
  }, [])

  return (
    <group>
      <mesh geometry={geos.tipShell}>{tip}</mesh>
      <mesh geometry={geos.tipBack}>
        <meshStandardMaterial color="#111317" roughness={0.8} />
      </mesh>
      <mesh geometry={geos.bodyGeo}>{body(0)}</mesh>
      <mesh geometry={geos.neck}>{body(1)}</mesh>
      <mesh geometry={geos.taper}>{body(2)}</mesh>
    </group>
  )
}

/** Where the plug's cable starts, behind the neck (x, from the tip's front). */
export const PLUG_BACK = -(TIP.length + BODY.length + NECK.length + NECK.taper) + 0.04

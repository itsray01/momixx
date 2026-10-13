'use client'

// A USB-C plug, in the charging scene's units (the cable's radius is CABLE_R),
// shared by the charging scene and the desktop story. It lies along x, pointing
// right, with the cable's axis at y = 0 and the front of the metal tip at x = 0.
//
// Shapes, from the real connector's proportions: the tip is a flat oval (a
// stadium, about three times as wide as it is tall) with a hollow end; the body
// is a flattened oval too, a little wider than the tip, with a rounded front
// edge; and the strain relief is a long, gentle cone back into the round cable.

import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'

/** The metal tip: 8.3 × 2.6 mm on a real plug, scaled to the cable. */
export const TIP = { length: 0.66, width: 0.56, height: 0.17 }
/** The rubber body behind it. */
export const BODY = { length: 1.2, width: 0.78, height: 0.34, nose: 0.1 }
/** The strain relief, from the body back to the cable. */
export const RELIEF = { length: 0.9 }

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

/** A ring: `outer` with `inner` cut out, for the tip's open end. */
function ring(w: number, h: number, wall: number) {
  const s = stadium(w, h)
  s.holes.push(stadium(w - 2 * wall, h - 2 * wall))
  return s
}

/** Extrudes a shape along x from a to b (the shape is drawn in the y–z plane). */
function alongX(shape: THREE.Shape, a: number, b: number, bevel = 0) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: b - a - 2 * bevel,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 5,
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
    const tipShell = alongX(ring(TIP.width, TIP.height, 0.022), -TIP.length, 0, 0.012)
    // The tip's shell fills in at the back, inside the body, so nothing shows through its open end.
    const tipBack = alongX(stadium(TIP.width - 0.03, TIP.height - 0.03), -TIP.length, -0.28)
    const bodyGeo = alongX(stadium(BODY.width, BODY.height), -TIP.length - BODY.length, -TIP.length, BODY.nose)
    // The relief: a cone that starts a little narrower than the body and ends at the cable.
    const relief = new THREE.CylinderGeometry(0.17, 0.235, RELIEF.length, 40, 1, false)
    relief.rotateZ(Math.PI / 2)
    relief.translate(-TIP.length - BODY.length - RELIEF.length / 2 + 0.06, 0, 0)
    // Its join to the body: a soft collar.
    const collar = new THREE.CylinderGeometry(0.235, 0.27, 0.12, 40, 1, false)
    collar.rotateZ(Math.PI / 2)
    collar.translate(-TIP.length - BODY.length + 0.06 - 0.06, 0, 0)
    return { tipShell, tipBack, bodyGeo, relief, collar }
  }, [])

  return (
    <group>
      <mesh geometry={geos.tipShell}>{tip}</mesh>
      <mesh geometry={geos.tipBack}>
        <meshStandardMaterial color="#111317" roughness={0.8} />
      </mesh>
      <mesh geometry={geos.bodyGeo}>{body(0)}</mesh>
      <mesh geometry={geos.collar}>{body(1)}</mesh>
      <mesh geometry={geos.relief}>{body(2)}</mesh>
    </group>
  )
}

/** Where the plug's cable starts, behind the relief (x, from the tip's front). */
export const PLUG_BACK = -(TIP.length + BODY.length + RELIEF.length) + 0.06

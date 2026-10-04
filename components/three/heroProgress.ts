// Scroll progress through the home hero (0 → 1), written by GSAP ScrollTrigger
// and read every frame by the 3D hero scene. A plain object avoids re-renders.
export const heroProgress = { value: 0 }

/** Camera shared by the live hero scene and its pre-rendered still, so the two line up. */
export const heroCamera = { position: [0, 0, 8.5] as [number, number, number], target: [0, 0, 0] as [number, number, number], fov: 35 }

/** The phone framing: the compact 4:3 cable shot, matching its still (renderViews' default view). */
export const cardCamera = { position: [0, 0.9, 10] as [number, number, number], target: [0, 0, 0] as [number, number, number], fov: 30 }

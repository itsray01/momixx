// The x-ray look for the cable anatomy: a layer that is x-rayed draws as a faint
// glass outline (bright where its surface turns away from you, nearly clear where
// it faces you) instead of a half-transparent fill, so layers seen through each
// other stay crisp rather than muddying into one another.
//
// It is a small addition to the standard physical material: `amount` blends from
// the normal look (0) to the outline (1), and `alpha` fades the outline out.

import * as THREE from 'three'

type Uniform<T> = { value: T }

export type Xray = {
  /** Adds the outline to a material's shader (pass as its onBeforeCompile). */
  patch: (shader: { uniforms: Record<string, Uniform<unknown>>; fragmentShader: string }) => void
  /** 0 = the normal look, 1 = the outline; `alpha` scales the outline (0 hides it). */
  set: (amount: number, alpha: number) => void
}

export function makeXray(color: THREE.ColorRepresentation): Xray {
  // The outline takes the layer's own colour, lifted towards white so dark layers still show.
  const tint = new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.55)
  const u = { uXray: { value: 0 }, uXrayAlpha: { value: 1 }, uXrayTint: { value: tint } }
  return {
    patch(shader) {
      Object.assign(shader.uniforms, u)
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', 'uniform float uXray;\nuniform float uXrayAlpha;\nuniform vec3 uXrayTint;\nvoid main() {')
        .replace(
          '#include <opaque_fragment>',
          `#include <opaque_fragment>
          {
            float facing = abs(dot(normalize(vNormal), normalize(vViewPosition)));
            float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 2.4);
            gl_FragColor.rgb = mix(gl_FragColor.rgb, uXrayTint * (0.12 + 1.15 * rim), uXray);
            // Clears quickly at the start of a fade: a layer that is nearly solid but no longer
            // hides its own far side would show its back through its front for a moment.
            float clear = 1.0 - pow(1.0 - uXray, 4.0);
            gl_FragColor.a = mix(gl_FragColor.a, (0.04 + 0.8 * rim) * uXrayAlpha, clear);
          }`,
        )
    },
    set(amount, alpha) {
      u.uXray.value = amount
      u.uXrayAlpha.value = alpha
    },
  }
}

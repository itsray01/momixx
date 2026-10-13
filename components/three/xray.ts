// The x-ray look for the cable anatomy: a layer that is x-rayed is drawn as it is
// normally, just mostly see-through, so the layers inside it show through it.
//
// It is a small addition to the standard physical material: `amount` blends from
// the normal look (0) to see-through (1), and `alpha` scales how much shows.

type Uniform<T> = { value: T }

export type Xray = {
  /** Adds the see-through to a material's shader (pass as its onBeforeCompile). */
  patch: (shader: { uniforms: Record<string, Uniform<unknown>>; fragmentShader: string }) => void
  /** 0 = the normal look, 1 = see-through; `alpha` scales how much shows (0 hides it). */
  set: (amount: number, alpha: number) => void
}

export function makeXray(): Xray {
  const u = { uXray: { value: 0 }, uXrayAlpha: { value: 1 } }
  return {
    patch(shader) {
      Object.assign(shader.uniforms, u)
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', 'uniform float uXray;\nuniform float uXrayAlpha;\nvoid main() {')
        .replace(
          '#include <opaque_fragment>',
          `#include <opaque_fragment>
          gl_FragColor.a = mix(gl_FragColor.a, 0.2 * uXrayAlpha, uXray);`,
        )
    },
    set(amount, alpha) {
      u.uXray.value = amount
      u.uXrayAlpha.value = alpha
    },
  }
}

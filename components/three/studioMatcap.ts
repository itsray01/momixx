// The hero cable's lite surfaces, for devices drawing without a graphics card:
// the studio lighting baked into one small image (public/renders/matcap-studio.webp,
// made by scripts/render-matcap.mjs), so a surface costs one texture lookup instead
// of four lights and an environment reflection. Its channels hold the light a matte
// surface receives (red), the reflection a glossy one adds (green) and what a
// polished metal reflects (blue), each divided by MATCAP_SCALE to fit (the metal
// channel clips its pinpoint highlights, which tone mapping would flatten anyway).

import * as THREE from 'three'

export const MATCAP_URL = '/renders/matcap-studio.webp'
export const MATCAP_SCALE = { diffuse: 2.5, specular: 1.25, metal: 8 }

const LIGHT = 'vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;'

/**
 * A surface lit by the baked studio. `gloss` scales the dielectric reflection
 * (1 for moulded silicone, lower for matte cuts); `metal` uses the metal channel,
 * tinted by the colour. Takes the colour, map and vertex colours as usual.
 *
 * Lite surfaces are two-sided unless given a side, and keep their gloss and
 * metal in uniforms, so they share a handful of shader programs: without a
 * graphics card, each program takes a noticeable moment to prepare.
 */
export function studioMaterial(matcap: THREE.Texture, { metal = false, gloss = 1, ...params }: THREE.MeshMatcapMaterialParameters & { metal?: boolean; gloss?: number }) {
  const mat = new THREE.MeshMatcapMaterial({ side: THREE.DoubleSide, ...params, matcap })
  const weights = {
    uStudioDiffuse: { value: metal ? 0 : MATCAP_SCALE.diffuse },
    uStudioSpecular: { value: metal ? 0 : MATCAP_SCALE.specular * gloss },
    uStudioMetal: { value: metal ? MATCAP_SCALE.metal : 0 },
  }
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, weights)
    shader.fragmentShader = shader.fragmentShader
      .replace('uniform sampler2D matcap;', 'uniform sampler2D matcap;\nuniform float uStudioDiffuse;\nuniform float uStudioSpecular;\nuniform float uStudioMetal;')
      .replace(LIGHT, 'vec3 outgoingLight = diffuseColor.rgb * (matcapColor.r * uStudioDiffuse + matcapColor.b * uStudioMetal) + vec3(matcapColor.g * uStudioSpecular);')
  }
  mat.customProgramCacheKey = () => 'studio'
  return mat
}

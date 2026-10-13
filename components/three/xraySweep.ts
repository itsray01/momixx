// The cable anatomy's x-ray, as a scan that sweeps along the cable.
//
// Every part of the cable is drawn twice: once solid (a normal, opaque surface)
// and once as an x-ray outline (a faint glass edge, bright where the surface
// turns away from you). At any point along the cable, a layer is one or the
// other, never half of each, so nothing ever shows its far side through its
// front. A change of look sweeps along the cable as a thin glowing line: on its
// left, the new look; on its right, the old one. Scroll moves the line, so the
// change is as fast or slow as the scroll.

import * as THREE from 'three'

type Uniform<T> = { value: T }

/** One layer's sweep: its look before and after (x-ray 0 or 1, outline strength), where the line is, and its glow. */
export type SweepUniforms = {
  uFromX: Uniform<number>
  uToX: Uniform<number>
  uFromA: Uniform<number>
  uToA: Uniform<number>
  /** World x of the line: left of it shows the new look. */
  uFront: Uniform<number>
  uGlow: Uniform<number>
}

export const makeSweepUniforms = (): SweepUniforms => ({
  uFromX: { value: 0 },
  uToX: { value: 0 },
  uFromA: { value: 1 },
  uToA: { value: 1 },
  uFront: { value: 1e4 },
  uGlow: { value: 0 },
})

const GLOW = new THREE.Color('#fff1dc')
const SWEEP_GLSL = /* glsl */ `
uniform float uFromX;
uniform float uToX;
uniform float uFromA;
uniform float uToA;
uniform float uFront;
uniform float uGlow;
uniform vec3 uGlowColour;
varying float vSweepX;
float sweepBand() { return uGlow * (1.0 - smoothstep(0.0, 0.14, abs(vSweepX - uFront))); }
`

/** The solid look: the usual physical material, with the parts that are x-rayed right now cut away. */
export function makeSolidMaterial(params: THREE.MeshPhysicalMaterialParameters, sweep: SweepUniforms) {
  const m = new THREE.MeshPhysicalMaterial(params)
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, sweep, { uGlowColour: { value: GLOW } })
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', 'varying float vSweepX;\nvoid main() {')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvSweepX = (modelMatrix * vec4(transformed, 1.0)).x;')
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', `${SWEEP_GLSL}\nvoid main() {\n  if ((vSweepX < uFront ? uToX : uFromX) > 0.5) discard;`)
      .replace('#include <opaque_fragment>', '#include <opaque_fragment>\ngl_FragColor.rgb += uGlowColour * sweepBand();')
  }
  return m
}

/** The x-ray look: a faint outline in the layer's colour, lifted towards white, with the parts that are solid right now cut away. */
export function makeXrayMaterial(colour: THREE.ColorRepresentation, side: THREE.Side, sweep: SweepUniforms) {
  return new THREE.ShaderMaterial({
    uniforms: { ...sweep, uGlowColour: { value: GLOW }, uTint: { value: new THREE.Color(colour).lerp(new THREE.Color('#ffffff'), 0.55) } },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      varying float vSweepX;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = -mv.xyz;
        vSweepX = (modelMatrix * vec4(position, 1.0)).x;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      ${SWEEP_GLSL}
      uniform vec3 uTint;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        bool after = vSweepX < uFront;
        if ((after ? uToX : uFromX) < 0.5) discard;
        float strength = after ? uToA : uFromA;
        float facing = abs(dot(normalize(vN), normalize(vV)));
        float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 2.4);
        float band = sweepBand();
        gl_FragColor = vec4(uTint * (0.12 + 1.15 * rim) + uGlowColour * band, (0.04 + 0.8 * rim) * strength + 0.6 * band);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    side,
  })
}

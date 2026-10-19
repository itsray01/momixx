import { createSystem, defaultBaseConfig, defaultConfig, defineConfig } from '@chakra-ui/react'

// Chakra UI is used for some parts only (forms, menus and pop-ups); Tailwind styles the rest.
// So Chakra brings its components and tokens but leaves the page alone: no CSS reset
// (Tailwind has one), and none of its html/body/selection styles. The only global rule kept
// is the set of CSS variables its components rely on.
const componentVars = Object.fromEntries(
  Object.entries((defaultConfig.globalCss?.['*'] ?? {}) as unknown as Record<string, string>).filter(([key]) => key.startsWith('--')),
) as Record<`--${string}`, string>

const font = 'var(--font-geist), ui-sans-serif, system-ui, sans-serif'

const config = defineConfig({
  preflight: false,
  cssVarsRoot: ':where(:root, :host)',
  cssVarsPrefix: 'chakra',
  globalCss: { '*': componentVars },
  theme: {
    ...defaultConfig.theme,
    tokens: {
      ...defaultConfig.theme?.tokens,
      fonts: { ...defaultConfig.theme?.tokens?.fonts, body: { value: font }, heading: { value: font } },
      colors: {
        ...defaultConfig.theme?.tokens?.colors,
        // The MoMixx green, the same scale as the site's brand colour.
        brand: {
          50: { value: '#f0faf3' },
          100: { value: '#d7f2e0' },
          200: { value: '#ace3c0' },
          300: { value: '#79cf9b' },
          400: { value: '#4fbf7a' },
          500: { value: '#22a35b' },
          600: { value: '#168447' },
          700: { value: '#13693a' },
          800: { value: '#125430' },
          900: { value: '#0f4528' },
          950: { value: '#0a2e1b' },
        },
      },
    },
    semanticTokens: {
      ...defaultConfig.theme?.semanticTokens,
      colors: {
        ...defaultConfig.theme?.semanticTokens?.colors,
        brand: {
          solid: { value: '{colors.brand.600}' },
          contrast: { value: '{colors.white}' },
          fg: { value: '{colors.brand.700}' },
          muted: { value: '{colors.brand.100}' },
          subtle: { value: '{colors.brand.50}' },
          emphasized: { value: '{colors.brand.200}' },
          focusRing: { value: '{colors.brand.500}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultBaseConfig, config)

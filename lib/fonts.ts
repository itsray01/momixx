import localFont from 'next/font/local'

// Self-hosted and paired with a size-matched fallback so text does not jump
// when the web font arrives (no layout shift). Only the main font is preloaded;
// the italic accent font is used for a word or two per heading, so it loads
// without competing with the first screen's text and image.
export const geist = localFont({
  src: '../app/fonts/geist-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-geist',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

export const instrumentSerif = localFont({
  src: '../app/fonts/instrument-serif-latin-400-italic.woff2',
  weight: '400',
  style: 'italic',
  variable: '--font-instrument-serif',
  display: 'swap',
  preload: false,
  adjustFontFallback: 'Times New Roman',
})

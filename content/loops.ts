import type { LoopName } from '@/components/BackgroundLoop'

/**
 * Which loop sits behind each page's header (files in /public/loops, played by components/BackgroundLoop.tsx).
 * The v- loops are cut from free Pexels footage (Pexels licence: commercial use, no credit needed) and all
 * share one colour grade (near-black shadows, warm amber light), so every page belongs to the same set.
 * Sources are listed in public/loops/SOURCES.txt. The home page has its live 3D hero instead, and
 * Sustainability keeps its (slowly drifting) forest photo.
 */
export const pageLoops: Record<string, LoopName> = {
  '/silicone': 'v-dune',
  '/products': 'v-drop',
  '/applications': 'v-traffic',
  '/recycled-silicone': 'v-forest-mist',
  '/insights': 'v-ink-purple',
  '/insights/glossary': 'v-dune',
  '/culture': 'v-singapore',
  '/locations': 'v-singapore',
  '/markets': 'v-traffic',
  '/about': 'v-singapore',
  '/newsroom': 'v-singapore',
  '/governance': 'v-ink-purple',
  '/innovation': 'v-drop-2',
  '/contact': 'v-ink-purple',
  '/privacy': 'v-ink-purple',
  '/terms': 'v-ink-purple',
  '/applications/consumer-electronics': 'v-light-tunnel',
  '/applications/electric-vehicles': 'v-traffic',
  '/applications/medical': 'v-droplets',
  '/applications/ai-data-centres': 'v-servers',
  '/applications/robotics': 'v-robot',
  '/applications/semiconductor': 'v-circuit-gold',
  '/products/momixx-mm': 'v-drop',
  '/products/momixx-high-density': 'v-drop-2',
  '/products/momixx-move': 'v-drop',
  '/products/momixx-procase': 'v-drop-2',
  '/products/momixx-seal': 'v-drop',
  '/products/selix': 'v-drop-2',
  '/products/crimson': 'v-drop',
  '/products/recycled-silicone': 'v-forest-mist',
  '/products/pctg': 'v-drop-2',
  '/products/vertical-extruder': 'v-light-tunnel',
  '/products/horizontal-extruder': 'v-light-tunnel',
  '/products/lsr-mixer': 'v-drop',
  '/products/autowinder': 'v-light-tunnel',
  '/products/energy-saving-oven': 'v-light-tunnel',
  '/products/dip-coating-machine': 'v-drop-2',
  '/products/odm-oem': 'v-drop',
  '/products/medical-precision-components': 'v-circuit-gold',
  '/insights/fire-retardant-silicone-usb-c-cables': 'v-light-tunnel',
  '/insights/grs-vs-iscc-plus-vs-scs': 'v-forest-mist',
  '/insights/how-silicone-cable-is-made': 'v-light-tunnel',
  '/insights/lsr-vs-hcr': 'v-drop-2',
  '/insights/medical-grade-silicone': 'v-droplets',
  '/insights/pfas-free-silicone': 'v-drop',
  '/insights/silicone-carbon-footprint': 'v-forest-autumn',
  '/insights/silicone-in-ai-data-centres': 'v-servers',
  '/insights/silicone-in-electric-vehicles': 'v-traffic',
  '/insights/silicone-in-humanoid-robots': 'v-robot',
  '/insights/silicone-recycling-explained': 'v-forest-mist',
  '/insights/why-silicone-ends-up-in-landfill': 'v-dune',
  '/insights/silicon-vs-silicone': 'v-dune',
  '/insights/topic/silicone-basics': 'v-dune',
  '/insights/topic/recycling': 'v-forest-mist',
  '/insights/topic/sustainability': 'v-forest-autumn',
  '/insights/topic/applications': 'v-traffic',
  '/insights/topic/technology': 'v-light-tunnel',
  '/insights/topic/regulation': 'v-ink-purple',
}

/** The loop for a page, by its path. */
export const loopFor = (path: string): LoopName | undefined => pageLoops[path]

// Sustainability content: the certification headline, carbon footprint and
// the green-initiative photo gallery. Shown on /sustainability and the home page.

/**
 * Headline certification claim.
 * ⚠️ An "only" claim must be verifiable before launch (see docs/LAUNCH-CHECKLIST.md).
 * "To our knowledge" keeps it defensible until the comparison is documented.
 */
export const certificationClaim = {
  headline: 'To our knowledge, the only silicone company certified under both GRS and ISCC PLUS.',
  short: 'GRS + ISCC PLUS certified',
}

/**
 * Carbon footprint figures. Add real, validated numbers here and they appear
 * automatically on /sustainability. Leave the list empty to hide the figures block.
 * Example: { value: '1.2', unit: 'kg CO₂e / kg', label: 'Recycled silicone, cradle-to-gate', note: 'Validated by …, 2025' }
 */
export const carbonMetrics: Array<{ value: string; unit?: string; label: string; note?: string }> = []

/**
 * Optional recycled-vs-virgin comparison (same unit, same boundary, same verifier).
 * Leave null until both validated numbers are available.
 */
export const carbonComparison: null | { unit: string; recycled: number; virgin: number; boundary: string; source: string } = null

/** How we reduce our footprint today: factual levers already described on the site. */
export const carbonLevers = [
  { title: 'Recycled silicone', body: 'Every tonne we rebuild from scrap is a tonne that doesn’t have to be made from scratch, starting with sand.' },
  { title: 'Solar power', body: 'Solar panels at our factories supply part of our electricity.' },
  { title: '30% less oven energy', body: 'Our redesigned ovens use about 30% less electricity than standard ones.' },
  { title: 'Less waste', body: 'Our mixer uses the 4% or so of silicone usually left at the bottom of each bucket.' },
  { title: 'Cleaner coating', body: 'Dipping instead of spraying releases up to 20 times less polluting fumes.' },
  { title: 'PFAS-free materials', body: 'Our dense silicone can replace rubbers that contain “forever chemicals”.' },
]

/**
 * Green-initiative photos (from Jaslyn). Put files in /public/images/sustainability/
 * and list them here; the gallery appears automatically once there is at least one.
 */
export const greenPhotos: Array<{ src: string; alt: string; caption?: string; width?: number; height?: number }> = []

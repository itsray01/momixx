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
  { title: 'Recycled feedstock', body: 'Every tonne of silicone we rebuild from scrap is a tonne that does not have to start again from quartz, metal and chemical synthesis.' },
  { title: 'Solar power', body: 'Solar generation at our facilities supplies part of our electricity and supports our carbon-reduction programme.' },
  { title: '30% less oven energy', body: 'Our redesigned curing ovens use about 30% less electricity than conventional ovens.' },
  { title: 'Less material waste', body: 'Our LSR mixer avoids leaving around 4% of each bucket of silicone unused.' },
  { title: 'Cleaner coating', body: 'Dip coating releases up to 20× fewer volatile organic compounds than spray coating.' },
  { title: 'PFAS-free materials', body: 'High-density silicone can replace fluorinated rubbers that contain “forever chemicals”.' },
]

/**
 * Green-initiative photos (from Jaslyn). Put files in /public/images/sustainability/
 * and list them here; the gallery appears automatically once there is at least one.
 */
export const greenPhotos: Array<{ src: string; alt: string; caption?: string; width?: number; height?: number }> = []

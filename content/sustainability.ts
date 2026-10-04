// Sustainability content: the certification headline, carbon footprint and
// the green-initiative photo gallery. Shown on /sustainability and the home page.

/**
 * Headline certification claim.
 * ⚠️ An "only" claim must be verifiable before launch (see docs/LAUNCH-CHECKLIST.md).
 * "To our knowledge" keeps it defensible until the comparison is documented.
 */
export const certificationClaim = {
  headline: 'To our knowledge, the only silicone company certified under both GRS and ISCC PLUS.',
  /** The same claim where the qualifier sits in a footnote (`footnote`), as on the home page. */
  statement: 'The only silicone company certified under both GRS and ISCC PLUS.',
  footnote: 'To our knowledge. Certification can be checked in the public GRS and ISCC PLUS certificate databases.',
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
  { title: 'Recycled silicone', body: 'Silicone rebuilt from scrap avoids making new silicon, the largest source of emissions in producing new silicone.' },
  { title: 'Solar power', body: 'Solar panels at our factories supply part of our electricity.' },
  { title: '30% less oven energy', body: 'Our redesigned curing ovens use about 30% less electricity than a standard curing oven.' },
  { title: 'Less waste', body: 'Our mixer uses the roughly 4% of liquid silicone that standard mixers leave in each bucket.' },
  { title: 'Cleaner coating', body: 'Dip coating releases up to 20 times less VOCs (solvent fumes) than spray coating.' },
  { title: 'PFAS-free materials', body: 'Our high-density silicone can replace fluorinated rubber (FKM), which is a PFAS, in many uses.' },
]

/**
 * Green-initiative photos (from Jaslyn). Put files in /public/images/sustainability/
 * and list them here; the gallery appears automatically once there is at least one.
 */
export const greenPhotos: Array<{ src: string; alt: string; caption?: string; width?: number; height?: number }> = []

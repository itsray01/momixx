// Addressable-market figures shown on /markets and on application pages.
//
// RULES (important for an IPO-bound company):
//  - Every figure is a third-party estimate. Keep the publisher, the year and
//    the URL with it, and never mix two publishers in one growth line.
//  - Where publishers disagree we use the more conservative, internally
//    consistent figure, and note it.
//  - Have your IPO advisers review this file before launch.
//
// Figures checked against the publishers' pages on 2 Oct 2026.

export type Source = { publisher: string; title: string; url: string; date: string }

export type Market = {
  id: string
  name: string
  /** What the number measures, in plain English. */
  scope: string
  current?: { year: number; usdBn: number }
  forecast: { year: number; usdBn: number }
  cagr?: { pct: number; period: string }
  source: Source
  /** Extra context shown under the figure. */
  note?: string
  /** 'context' = a related industry figure, not a market Momixx sells into directly. */
  kind: 'addressable' | 'context'
}

export const markets: Market[] = [
  {
    id: 'silicone',
    name: 'Global silicone',
    scope: 'All silicone products worldwide: rubbers, fluids, resins and gels.',
    current: { year: 2025, usdBn: 24.3 },
    forecast: { year: 2033, usdBn: 37.3 },
    cagr: { pct: 5.4, period: '2026–2033' },
    source: {
      publisher: 'Grand View Research',
      title: 'Silicone Market Size, Share & Trends Analysis Report',
      url: 'https://www.grandviewresearch.com/industry-analysis/silicone-market',
      date: '2026',
    },
    note: 'Asia Pacific made up 45.8% of 2025 sales. Silicone rubber, Momixx’s main business, was the biggest product group at 42.1%.',
    kind: 'addressable',
  },
  {
    id: 'lsr',
    name: 'Liquid silicone rubber (LSR)',
    scope: 'Liquid silicone used for precision moulding: medical, electronics, automotive and consumer parts.',
    current: { year: 2023, usdBn: 2.8 },
    forecast: { year: 2030, usdBn: 5.0 },
    cagr: { pct: 8.5, period: '2024–2030' },
    source: {
      publisher: 'Grand View Research',
      title: 'Liquid Silicone Rubber Market Size & Share Report',
      url: 'https://www.grandviewresearch.com/industry-analysis/liquid-silicone-rubber-lsr-market',
      date: 'Oct 2024',
    },
    kind: 'addressable',
  },
  {
    id: 'ev-cables',
    name: 'Automotive silicone',
    scope: 'Silicone used in vehicles, including EV cables, seals, gaskets and battery components.',
    current: { year: 2024, usdBn: 10.2 },
    forecast: { year: 2033, usdBn: 21.0 },
    cagr: { pct: 8.5, period: '2025–2033' },
    source: {
      publisher: 'Grand View Research',
      title: 'Automotive Silicone Market Size & Share Report',
      url: 'https://www.grandviewresearch.com/industry-analysis/automotive-silicone-market',
      date: 'Jul 2026',
    },
    note: 'Electric car sales grew 20% to more than 20 million in 2025, one in four new cars sold worldwide (IEA, Global EV Outlook 2026).',
    kind: 'addressable',
  },
  {
    id: 'data-centre-cabling',
    name: 'Data centre cables',
    scope: 'Power and data cables installed in data centres.',
    current: { year: 2026, usdBn: 12.24 },
    forecast: { year: 2032, usdBn: 18.81 },
    cagr: { pct: 7.4, period: '2026–2032' },
    source: {
      publisher: 'MarketsandMarkets',
      title: 'Data Center Cable Market worth $18.81 billion by 2032',
      url: 'https://www.prnewswire.com/news-releases/data-center-cable-market-worth-18-81-billion-by-2032---exclusive-report-by-marketsandmarkets-302778567.html',
      date: 'May 2026',
    },
    note: 'McKinsey estimates about US$6.7 trillion of data-centre investment worldwide by 2030, US$5.2 trillion of it for AI-capable facilities.',
    kind: 'addressable',
  },
  {
    id: 'usb-cables',
    name: 'Consumer electronics charging cables',
    scope: 'Charging and data cables for phones, laptops and other consumer devices. USB-C cables alone: US$2.25B (2025) → US$6.12B (2035).',
    current: { year: 2025, usdBn: 4.32 },
    forecast: { year: 2035, usdBn: 8.5 },
    cagr: { pct: 6.7, period: '2026–2035' },
    source: {
      publisher: 'Global Market Insights',
      title: 'Consumer Electronics Charging Cable Market',
      url: 'https://www.gminsights.com/industry-analysis/consumer-electronics-charging-cable-market',
      date: 'Sep 2026',
    },
    note: 'Since 28 December 2024 the EU has required USB-C on new phones, tablets and many other devices, and on laptops since 28 April 2026.',
    kind: 'addressable',
  },
  {
    id: 'medical-silicone',
    name: 'Medical-grade silicone',
    scope: 'Silicone material sold for medical devices and healthcare products (material value only).',
    current: { year: 2024, usdBn: 0.6017 },
    forecast: { year: 2030, usdBn: 0.9227 },
    cagr: { pct: 7.4, period: '2025–2030' },
    source: {
      publisher: 'Grand View Research',
      title: 'Medical Grade Silicone Market Size & Share Report',
      url: 'https://www.grandviewresearch.com/industry-analysis/medical-grade-silicone-market',
      date: 'Nov 2024',
    },
    note: 'This counts raw material only. Estimates that include finished medical silicone products are several times larger.',
    kind: 'addressable',
  },
  {
    id: 'humanoid-robots',
    name: 'Humanoid robots',
    scope: 'Expected yearly sales of humanoid robots.',
    forecast: { year: 2035, usdBn: 38 },
    source: {
      publisher: 'Goldman Sachs Research',
      title: 'The global market for humanoid robots could reach $38 billion by 2035',
      url: 'https://www.goldmansachs.com/insights/articles/the-global-market-for-robots-could-reach-38-billion-by-2035',
      date: 'Feb 2024',
    },
    note: 'Goldman Sachs projects 1.4 million humanoid robots shipped in 2035. Every one needs bendy cables, seals and soft-touch surfaces.',
    kind: 'addressable',
  },
  {
    id: 'semiconductor-equipment',
    name: 'Semiconductor equipment',
    scope: 'Total global sales of chip-making equipment. Industry context: Momixx supplies components, a small share of this.',
    forecast: { year: 2026, usdBn: 165.9 },
    source: {
      publisher: 'SEMI',
      title: 'Global Semiconductor Equipment Sales Forecast to Reach a Record $229 Billion in 2028',
      url: 'https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-forecast-to-reach-a-record-229-billion-dollars-in-2028-semi-reports',
      date: 'Jul 2026',
    },
    note: 'SEMI forecasts record equipment sales of US$165.9 billion in 2026, rising to US$229.5 billion in 2028.',
    kind: 'context',
  },
]

export const recyclingFacts = {
  source: {
    publisher: 'Wolf & Stammer, Polymers 16(15):2220',
    title: 'Chemical Recycling of Silicones—Current State of Play',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11314909/',
    date: 'Aug 2024',
  } satisfies Source,
  producedTonnes: '2.9–3.0 million tonnes',
  recycledTonnes: '35,000–45,000 tonnes',
  summary:
    'In 2024 the world produced an estimated 2.9–3.0 million tonnes of silicone, but only about 35,000–45,000 tonnes of silicone waste were chemically recycled. Researchers describe the sector as “still in its infancy”.',
  landfill: {
    text: 'Most silicone waste is not recycled. It is buried in landfill or burned to make energy.',
    source: { publisher: 'Silicones Europe', title: 'Circularity', url: 'https://www.silicones.eu/science/circularity/', date: '2026' } satisfies Source,
  },
}

export const marketDisclaimer =
  'Market figures are independent third-party estimates from the publishers named, shown for industry context. They are not prepared or verified by Momixx and are not forecasts of Momixx’s revenue or market share. Publishers define markets differently, so figures from different sources should not be compared directly.'

export function getMarket(id: string) {
  return markets.find((m) => m.id === id)
}

export function formatUsd(bn: number) {
  if (bn >= 1000) return `US$${(bn / 1000).toFixed(1)}T`
  if (bn < 1) return `US$${Math.round(bn * 1000)}M`
  return `US$${bn % 1 === 0 ? bn.toFixed(0) : bn.toFixed(bn < 10 ? 2 : 1).replace(/0$/, '')}B`
}

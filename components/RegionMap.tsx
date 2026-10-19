import { site } from '@/lib/site'
import { MapPins, type MapPin } from './MapPins'
import { gridPath, landPath, mapSize, pinPoints } from './regionMap'

type PinKey = keyof typeof pinPoints

const details: Record<PinKey, Omit<MapPin, 'key' | 'left' | 'top' | 'href'>> = {
  singapore: { name: 'Singapore', role: 'Headquarters', body: `Our corporate headquarters, where MoMixx was founded in ${site.foundingYear}.` },
  penang: {
    name: 'Penang, Malaysia',
    role: 'Research and manufacturing',
    body: 'Our Batu Kawan and Perai plants. Batu Kawan is our research centre and our ISO 13485-certified factory.',
  },
  dongguan: { labelLeft: true, name: 'Dongguan, China', role: 'Manufacturing', body: 'Our manufacturing plant in Houjie, Dongguan, Guangdong.' },
}

// Gentle arcs from headquarters out to each plant, bowing away from the straight line.
function arc(from: { x: number; y: number }, to: { x: number; y: number }, bend: number) {
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  return `M${from.x} ${from.y}Q${mx - dy * bend} ${my + dx * bend} ${to.x} ${to.y}`
}

/**
 * A map of South-East Asia with our three locations: real coastlines (Natural Earth, no
 * country borders) drawn on the server, so it costs no JavaScript. The pins are buttons;
 * clicking one opens a small card about that site. Pass `links` to add a "See details" link.
 */
export function RegionMap({ links, className = '' }: { links?: Partial<Record<PinKey, string>>; className?: string }) {
  const { width, height } = mapSize
  const pins: MapPin[] = (Object.keys(pinPoints) as PinKey[]).map((key) => ({
    key,
    left: (pinPoints[key].x / width) * 100,
    top: (pinPoints[key].y / height) * 100,
    href: links?.[key],
    ...details[key],
  }))
  const hq = pinPoints.singapore
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#d9eadf_0%,#e4efe8_55%,#dbe9e0_100%)] ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Map of South-East Asia showing the MoMixx headquarters in Singapore, our plants at Batu Kawan and Perai in Penang, Malaysia, and our factory in Dongguan, Guangdong, China."
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern id="map-dots" width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="4.5" cy="4.5" r="1.05" fill="#168447" fillOpacity="0.11" />
          </pattern>
          <filter id="map-lift" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#0f4528" floodOpacity="0.13" />
          </filter>
          <radialGradient id="map-fade" cx="50%" cy="50%" r="75%">
            <stop offset="70%" stopColor="#dfece4" stopOpacity="0" />
            <stop offset="100%" stopColor="#dfece4" stopOpacity="0.85" />
          </radialGradient>
        </defs>
        <path d={gridPath} fill="none" stroke="#168447" strokeOpacity="0.09" strokeWidth="1" strokeDasharray="2 5" />
        <path d={landPath} fill="#fdfdfb" stroke="#b9cbbf" strokeWidth="1" strokeLinejoin="round" filter="url(#map-lift)" />
        <path d={landPath} fill="url(#map-dots)" />
        <rect width={width} height={height} fill="url(#map-fade)" />
      </svg>
      {/* The moving routes get a layer of their own, so the shaded land underneath is painted once, not every frame. */}
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full [transform:translateZ(0)]">
        {(['penang', 'dongguan'] as const).map((key) => (
          <path
            key={key}
            d={arc(hq, pinPoints[key], key === 'penang' ? 0.22 : -0.16)}
            fill="none"
            stroke="#168447"
            strokeOpacity="0.55"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="5 7"
            className="motion-safe:animate-[map-route_2.4s_linear_infinite]"
          />
        ))}
      </svg>
      <MapPins pins={pins} />
    </div>
  )
}

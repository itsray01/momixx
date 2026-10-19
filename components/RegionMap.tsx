import { site } from '@/lib/site'
import { MapPins, type MapPin } from './MapPins'
import { landPath, mapSize, pinPoints } from './regionMap'

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
          <filter id="map-lift" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#0f4528" floodOpacity="0.13" />
          </filter>
          <radialGradient id="map-fade" cx="50%" cy="50%" r="75%">
            <stop offset="70%" stopColor="#dfece4" stopOpacity="0" />
            <stop offset="100%" stopColor="#dfece4" stopOpacity="0.85" />
          </radialGradient>
        </defs>
        <path d={landPath} fill="#fdfdfb" stroke="#b9cbbf" strokeWidth="1" strokeLinejoin="round" filter="url(#map-lift)" />
        <rect width={width} height={height} fill="url(#map-fade)" />
      </svg>
      <MapPins pins={pins} />
    </div>
  )
}

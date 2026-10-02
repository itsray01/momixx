import { ImageResponse } from 'next/og'

export const alt = 'Momixx: high-performance and recycled silicone'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Default social-sharing image for every page.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#060a10', color: 'white', padding: 72, position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 640 }}>
          <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, color: '#6dd5c9' }}>ORION MOMIXX</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Silicone, engineered for what’s next.</div>
            <div style={{ fontSize: 28, marginTop: 24, color: '#94a3b8' }}>Materials · Recycling · Machines</div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 80, top: 115, width: 400, height: 400, borderRadius: 400, background: 'radial-gradient(circle at 40% 35%, #6dd5c9, #149f94 60%, #0e514e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 290, height: 290, borderRadius: 290, background: '#e8eef3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 266, height: 266, borderRadius: 266, background: '#0b121c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: 120, background: 'radial-gradient(circle at 35% 30%, #f2c79c, #c98a55 55%, #8a5530)' }} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}

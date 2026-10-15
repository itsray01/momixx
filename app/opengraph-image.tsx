import { ImageResponse } from 'next/og'

export const alt = 'MoMixx: high-performance and recycled silicone'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Default social-sharing image for every page.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#fbfbf9', color: '#121412', padding: 72, position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 640 }}>
          <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, color: '#168447' }}>ORION MOMIXX</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Silicone, engineered for a cleaner future.</div>
            <div style={{ fontSize: 28, marginTop: 24, color: '#5a5f5a' }}>Materials · Recycling · Machines</div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 80, top: 115, width: 400, height: 400, borderRadius: 400, background: 'radial-gradient(circle at 40% 35%, #7fd9cf, #1f9d91 55%, #0b3f3b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 290, height: 290, borderRadius: 290, background: '#e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 266, height: 266, borderRadius: 266, background: '#101214', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: 120, background: 'radial-gradient(circle at 35% 30%, #f2c79c, #c98a55 55%, #8a5530)' }} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}

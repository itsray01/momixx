import { ImageResponse } from 'next/og'

// Shared design for social-sharing images (PNG, which every platform renders,
// including LinkedIn): the page's section, its title, and the MoMixx cable
// cross-section motif.

export const ogSize = { width: 1200, height: 630 }

export function ogCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  const long = title.length > 60
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#050505', color: 'white', padding: 72, position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 760 }}>
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 5, color: '#e4e4e7', textTransform: 'uppercase' }}>{eyebrow}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: long ? 56 : 68, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 28, marginTop: 24, color: '#a1a1aa', lineHeight: 1.35 }}>{subtitle}</div>}
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: '#909096', letterSpacing: 1 }}>momixx.com</div>
        </div>
        <div style={{ position: 'absolute', right: 70, top: 165, width: 300, height: 300, borderRadius: 300, background: 'radial-gradient(circle at 40% 35%, #f4f5f6, #e6e7e9 60%, #3a3d42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 222, height: 222, borderRadius: 222, background: '#c9cfd6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 204, height: 204, borderRadius: 204, background: '#101214', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', alignContent: 'center', padding: 20 }}>
              {['#c8382f', '#eef1f4', '#2f8f55', '#1d2228'].map((c) => (
                <div key={c} style={{ width: 62, height: 62, margin: 6, borderRadius: 62, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 30, background: 'radial-gradient(circle at 35% 30%, #f2c79c, #c97f4c 55%, #8a5530)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    ogSize,
  )
}

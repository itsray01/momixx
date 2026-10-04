import { notFound } from 'next/navigation'
import { MatcapCanvas, type MatcapKind } from './MatcapCanvas'

// Internal tool: bakes the studio lighting onto a sphere for the hero cable's
// lite surfaces (see studioMaterial in HeroCable). Only available in development,
// or with ENABLE_RENDER=1. See scripts/render-matcap.mjs.
export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

const kinds: MatcapKind[] = ['diffuse', 'specular', 'metal']

export default async function MatcapPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams
  const enabled = process.env.NODE_ENV === 'development' || process.env.ENABLE_RENDER === '1'
  if (!enabled || !kinds.includes(kind as MatcapKind)) notFound()
  return <MatcapCanvas kind={kind as MatcapKind} />
}

import { notFound } from 'next/navigation'
import { modelNames, type ModelName } from '@/components/three/modelNames'
import { RenderCanvas } from './RenderCanvas'

// Internal tool for producing the 3D card images in /public/renders.
// Only available in development, or with ENABLE_RENDER=1. See scripts/render-models.mjs.
export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

export default async function RenderPage({ params, searchParams }: { params: Promise<{ model: string }>; searchParams: Promise<{ colour?: string }> }) {
  const { model } = await params
  const { colour } = await searchParams
  const enabled = process.env.NODE_ENV === 'development' || process.env.ENABLE_RENDER === '1'
  if (!enabled || !modelNames.includes(model as ModelName)) notFound()
  return <RenderCanvas name={model as ModelName} colour={colour} />
}

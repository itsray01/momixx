import { notFound } from 'next/navigation'
import { modelNames, type ModelName } from '@/components/three/modelNames'
import { RenderCanvas } from './RenderCanvas'

// Internal tool for producing the 3D card images in /public/renders.
// Only available in development, or with ENABLE_RENDER=1. See scripts/render-models.mjs.
export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

export default async function RenderPage({ params, searchParams }: { params: Promise<{ model: string }>; searchParams: Promise<{ colour?: string; spin?: string }> }) {
  const { model } = await params
  const { colour, spin } = await searchParams
  const enabled = process.env.NODE_ENV === 'development' || process.env.ENABLE_RENDER === '1'
  if (!enabled || !modelNames.includes(model as ModelName)) notFound()
  // ?spin=1: the turntable used by scripts/render-spins.mjs for the machine clips.
  return <RenderCanvas name={model as ModelName} colour={colour} spin={spin === '1'} />
}

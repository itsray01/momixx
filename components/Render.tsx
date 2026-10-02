import Image from 'next/image'
import type { ModelName } from './three/modelNames'

// A pre-rendered 3D image from /public/renders (made by scripts/render-models.mjs).
export function Render({
  name,
  alt = '',
  className = '',
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
}: {
  name: ModelName
  alt?: string
  className?: string
  sizes?: string
  /** Above the fold: load immediately at high priority (likely the LCP image). */
  priority?: boolean
}) {
  return (
    <Image
      src={`/renders/${name}.webp`}
      alt={alt}
      width={1200}
      height={900}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={`h-auto w-full object-contain select-none ${className}`}
      draggable={false}
    />
  )
}

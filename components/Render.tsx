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
  priority?: boolean
}) {
  return <Image src={`/renders/${name}.webp`} alt={alt} width={1200} height={900} sizes={sizes} priority={priority} className={`h-auto w-full select-none ${className}`} draggable={false} />
}

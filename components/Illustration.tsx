import Image from 'next/image'
import type { Picture } from '@/content/illustrations'

/** An AI product illustration in a card, captioned so it is never taken for a photograph. */
export function Illustration({ picture, sizes = '(min-width: 1024px) 36rem, 100vw', priority = false, className = '' }: { picture: Picture; sizes?: string; priority?: boolean; className?: string }) {
  return (
    <figure className={`card relative overflow-hidden ${className}`}>
      <Image src={picture.src} alt={picture.alt} width={picture.width} height={picture.height} sizes={sizes} className="h-auto w-full" priority={priority} />
      <figcaption className="absolute bottom-3 left-4 rounded-full bg-[#f7f7f4]/85 px-2.5 py-1 text-xs text-[#3d413d] backdrop-blur">{picture.caption}</figcaption>
    </figure>
  )
}

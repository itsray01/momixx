'use client'

import { useEffect, useRef } from 'react'

/**
 * A short, silent, looping clip of a 3D model turning, from /public/videos. It plays
 * only while at least 30% of it is on screen, never with reduced motion (the poster
 * stays as a still), and quietly stays on the poster if the browser refuses to play.
 */
export function SpinVideo({ name, label }: { name: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false

    const update = () => {
      if (visible && !motion.matches) {
        video.play().catch(() => {})
      } else if (!video.paused) {
        video.pause()
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        update()
      },
      { threshold: 0.3 },
    )
    io.observe(video)
    motion.addEventListener('change', update)
    return () => {
      io.disconnect()
      motion.removeEventListener('change', update)
    }
  }, [])

  return (
    <video
      ref={ref}
      poster={`/videos/${name}-poster.jpg`}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-label={label}
      className="h-full w-full object-cover"
    >
      <source src={`/videos/${name}.mp4`} type="video/mp4" />
    </video>
  )
}

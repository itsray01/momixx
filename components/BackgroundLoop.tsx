'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type LoopName =
  | 'heat'
  | 'v-circuit-gold'
  | 'v-drop-2'
  | 'v-droplets'
  | 'v-dune'
  | 'v-forest-autumn'
  | 'v-forest-mist'
  | 'v-glass'
  | 'v-ink-gold'
  | 'v-light-tunnel'
  | 'v-particles'
  | 'v-robot'
  | 'v-servers'
  | 'v-singapore'
  | 'v-traffic'

/** Which part of each loop to keep when a tall box crops it (on phones, mostly): where its colour is. */
const focusFor: Partial<Record<LoopName, string>> = {
  heat: '80% 55%',
  // The dropper hangs from the top of the frame: keep its tip and the drop in view.
  'v-drop-2': '50% 0%',
  // The ink billows in from the right.
  'v-ink-gold': '85% 50%',
}

/**
 * A slow, silent loop behind a section, from /public/loops (a WebM, an MP4 copy for Safari and a still).
 *
 * Everyone sees the still frame first. On tablets and desktops the video joins once the page has
 * finished loading and the section is near the screen, fades in over the still, and pauses whenever
 * the section scrolls away. Phones, visitors who prefer reduced motion and connections asking to save
 * data keep the still, so the loops never cost them anything.
 *
 * `shade` darkens the side where the words sit, so text over the loop stays readable. On phones the
 * words span the whole width, so the shade is even, and `className` can cap how far down a long
 * section the loop reaches.
 */
export function BackgroundLoop({
  name,
  shade = 'left',
  priority = false,
  className = '',
}: {
  name: LoopName
  shade?: 'left' | 'full'
  /** Load the still straight away: for a loop at the top of the page. */
  priority?: boolean
  className?: string
}) {
  const focus = focusFor[name] ?? '50% 50%'
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mount, setMount] = useState(false)
  const [playing, setPlaying] = useState(false)

  // Decide once, after the page has loaded, whether this visitor gets the moving version.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (saveData || !window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches) return
    let io: IntersectionObserver | undefined
    const start = () => {
      // Load once the section is near; play only while a good part of it is on screen, so the video
      // is not decoding under the blurred top bar as the page scrolls on.
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setMount(true)
          const v = videoRef.current
          if (!v) return
          if (e.intersectionRatio >= 0.35) v.play().catch(() => {})
          else v.pause()
        },
        { threshold: [0, 0.35] },
      )
      io.observe(wrap)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      io?.disconnect()
    }
  }, [])

  // The first time the video element appears, the observer has already fired: start it here.
  useEffect(() => {
    if (mount) videoRef.current?.play().catch(() => {})
  }, [mount])

  return (
    <div ref={wrapRef} aria-hidden="true" data-decor="" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <Image src={`/loops/${name}.webp`} alt="" fill sizes="100vw" priority={priority} className="object-cover" style={{ objectPosition: focus }} />
      {mount && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: focus }}
        >
          <source src={`/loops/${name}.webm`} type="video/webm" />
          <source src={`/loops/${name}.mp4`} type="video/mp4" />
        </video>
      )}
      {/* Readability: darker where the words sit, and soft top and bottom edges into the page. */}
      <div
        className={`absolute inset-0 ${
          shade === 'left'
            ? 'bg-[linear-gradient(90deg,rgb(5_5_5/0.92)_0%,rgb(5_5_5/0.72)_34%,rgb(5_5_5/0.2)_62%,rgb(5_5_5/0)_100%)] max-lg:bg-[rgb(5_5_5/0.55)]'
            : 'bg-[rgb(5_5_5/0.55)]'
        }`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_5/0.85)_0%,rgb(5_5_5/0)_18%,rgb(5_5_5/0)_80%,rgb(5_5_5/0.95)_100%)]" />
    </div>
  )
}

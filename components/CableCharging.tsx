'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { CanvasBoundary } from './three/CanvasBoundary'
import { chargingStill } from './three/chargingView'
import { useLazy3D } from './three/useLazy3D'

const CableChargingCanvas = dynamic(() => import('./three/CableChargingCanvas'), { ssr: false })

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * The anatomy's last beat: the same cable, whole, plugs into a plain phone as
 * you scroll down, then charges: light runs along the copper inside the
 * see-through silicone and the phone's screen fills a charging ring. Live 3D
 * wherever WebGL runs on a graphics chip (phones included: there is nothing to
 * drag); otherwise a pre-rendered image of the same moment.
 */
export function CableCharging() {
  const { ref: stage, enabled, visible, ready, markReady, reduced } = useLazy3D<HTMLDivElement>({ watchOnly: true })
  const plug = useRef(0)
  const charging = useRef(false)
  const [failed, setFailed] = useState(false)

  // Scroll pushes the plug in as the stage rises into view; charging starts once
  // it is well in view, and stops again (unplugging) if you scroll back up past it.
  useEffect(() => {
    const el = stage.current
    if (!el || !enabled || reduced) return
    const onScroll = () => {
      // Where the stage's middle is, as a share of the screen's height (1 = bottom edge, 0.5 = halfway).
      const r = el.getBoundingClientRect()
      const mid = (r.top + r.height / 2) / window.innerHeight
      // The plug only starts once the whole stage is on screen, and is home by the time it reaches the middle.
      plug.current = smooth(0.82, 0.5, mid)
      if (mid < 0.5) charging.current = true
      else if (mid > 0.6) charging.current = false
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [stage, enabled, reduced])

  const live = enabled && !failed
  return (
    <div className="mt-20 sm:mt-28">
      <div className="max-w-2xl">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Plugged in</h3>
        <p className="mt-3 text-lg leading-relaxed text-zinc-300">Power flows through the copper conductors at the core. The silicone jacket is the protective outer layer that insulates and shields them.</p>
      </div>
      {/* Edge to edge on phones and tablets, like the anatomy above it. */}
      <div ref={stage} className="relative -mx-4 mt-8 aspect-[2/1] overflow-hidden sm:-mx-6 lg:mx-0 lg:mt-10 lg:aspect-[3/1]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_62%_55%,rgb(255_255_255/0.07),transparent_72%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(to right, #121412 1px, transparent 1px), linear-gradient(to bottom, #121412 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            backgroundPosition: 'center',
            maskImage: 'radial-gradient(ellipse 60% 70% at 60% 50%, black 15%, transparent 75%)',
          }}
        />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_18%)]">
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready && live ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
            {/* The 21:9 still, centred; on phones and tablets widened so only the slice narrowCrop names shows (chargingView.ts), as the 3D does. */}
            <div className="absolute top-1/2 left-[-25.64%] aspect-[21/9] w-[128.2%] -translate-y-1/2 lg:left-0 lg:w-full">
              <Image src="/renders/cable-charging.webp" alt="A white silicone USB-C cable plugged into a phone, its screen showing a charging ring" fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-contain" />
            </div>
          </div>
          {live && (
            <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
              <CanvasBoundary onError={() => setFailed(true)}>
                <CableChargingCanvas plug={plug} charging={charging} still={reduced ? chargingStill : undefined} animate={visible && !reduced} onReady={markReady} />
              </CanvasBoundary>
            </div>
          )}
        </div>
        <p className="pointer-events-none absolute right-4 bottom-2 left-4 text-center text-[0.6875rem] text-zinc-500 lg:right-auto lg:bottom-3 lg:left-0 lg:text-left">
          Illustration of a USB-C cable charging a phone.
        </p>
      </div>
    </div>
  )
}

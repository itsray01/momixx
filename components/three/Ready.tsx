'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'

/** Calls onReady once the first frame has been drawn, so the canvas can fade in over its still image. */
export function Ready({ onReady }: { onReady?: () => void }) {
  const invalidate = useThree((s) => s.invalidate)
  const fired = useRef(false)
  useFrame(() => {
    if (fired.current) return
    fired.current = true
    requestAnimationFrame(() => onReady?.())
  })
  // With frameloop="demand" nothing draws until asked to.
  useLayoutEffect(() => invalidate(), [invalidate])
  return null
}

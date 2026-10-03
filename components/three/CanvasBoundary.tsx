'use client'

import { Component, type ReactNode } from 'react'

/**
 * Catches a failed 3D scene (no WebGL context, a lost GPU, a chunk that failed
 * to download) and renders nothing in its place, so the still image underneath
 * stays on screen instead of the whole page breaking.
 */
export class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

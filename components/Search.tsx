'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Header search button. The pop-up itself (components/SearchDialog.tsx, built with
// Chakra UI) is loaded only when someone points at, focuses or presses the button,
// or presses Ctrl+K / ⌘K, so it adds nothing to a page's first load.

const loadDialog = () => import('./SearchDialog')
const SearchDialog = dynamic(loadDialog, { ssr: false })

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.6 12.6L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function Search({ onOpen }: { onOpen?: () => void }) {
  const [open, setOpen] = useState(false)
  // The dialog is mounted from the first open on, so it keeps its downloaded index.
  const [mounted, setMounted] = useState(false)

  const prefetch = () => {
    loadDialog().then((m) => m.loadIndex().catch(() => {}))
  }

  const openSearch = () => {
    onOpen?.()
    setMounted(true)
    setOpen(true)
  }

  // Ctrl+K / ⌘K opens search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // openSearch only sets state and calls a stable callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-label="Search"
        aria-haspopup="dialog"
        className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] text-zinc-300 transition-colors hover:text-white lg:w-auto lg:border-transparent lg:bg-transparent lg:px-3 lg:hover:bg-white/[0.06]"
      >
        <SearchIcon className="h-[18px] w-[18px]" />
        <span className="hidden text-sm xl:inline">Search</span>
      </button>
      {mounted && <SearchDialog open={open} onOpenChange={setOpen} />}
    </>
  )
}

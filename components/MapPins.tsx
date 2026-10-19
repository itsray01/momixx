'use client'

import { Popover, Portal } from '@chakra-ui/react'
import { ChakraScope } from './chakra/ChakraScope'

export type MapPin = {
  key: string
  name: string
  role: string
  body: string
  left: number
  top: number
  href?: string
  /** Put the label on the left of the dot (for pins near the right edge). */
  labelLeft?: boolean
}

/** The clickable pins on the locations map; each opens a small card about the site (Chakra UI popover). */
export function MapPins({ pins }: { pins: MapPin[] }) {
  return (
    <ChakraScope>
      {pins.map((p) => (
        <Popover.Root key={p.key} positioning={{ placement: 'top', gutter: 14 }} lazyMount unmountOnExit>
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-label={`${p.name}: ${p.role}. Show details`}
              className={`group absolute flex cursor-pointer items-center gap-2.5 rounded-full outline-none ${p.labelLeft ? 'flex-row-reverse' : ''}`}
              // The dot (18px wide) sits on the location; the label runs off to one side.
              style={{ left: `${p.left}%`, top: `${p.top}%`, translate: p.labelLeft ? 'calc(-100% + 9px) -50%' : '-9px -50%' }}
            >
              <span aria-hidden="true" className="relative flex size-[18px] shrink-0 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-[#121412]/15 motion-safe:animate-ping" />
                <span className="size-3.5 rounded-full border-[2.5px] border-[#fdfdfb] bg-[#121412] shadow-[0_2px_8px_rgb(18_20_18/0.4)] transition-transform duration-200 group-hover:scale-110" />
              </span>
              <span className="rounded-full border border-[#dfe6e0] bg-[#fdfdfb]/95 px-3 py-1 text-xs font-semibold whitespace-nowrap text-[#121412] shadow-[0_4px_14px_-6px_rgb(15_69_40/0.35)] backdrop-blur transition-colors group-hover:border-[#121412]/30 group-focus-visible:ring-2 group-focus-visible:ring-[#22a35b] sm:text-sm">
                {p.name.split(',')[0]}
              </span>
            </button>
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content width="18rem" rounded="2xl" boxShadow="0 18px 40px -16px rgb(15 69 40 / 0.35), 0 2px 6px rgb(18 20 18 / 0.06)" borderWidth="1px" borderColor="gray.200">
                <Popover.Arrow>
                  <Popover.ArrowTip />
                </Popover.Arrow>
                <Popover.Body p="5">
                  <Popover.Title fontSize="xs" fontWeight="medium" color="brand.fg" letterSpacing="wider" textTransform="uppercase">
                    {p.role}
                  </Popover.Title>
                  <p className="mt-1.5 text-lg font-semibold tracking-[-0.02em] text-[#121412]">{p.name}</p>
                  <Popover.Description mt="2" fontSize="sm" color="fg.muted" lineHeight="1.55">
                    {p.body}
                  </Popover.Description>
                  {p.href && (
                    <a href={p.href} className="mt-3 inline-flex text-sm font-medium text-[#13693a] hover:text-[#0f4528]">
                      See details <span aria-hidden="true">&nbsp;→</span>
                    </a>
                  )}
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      ))}
    </ChakraScope>
  )
}

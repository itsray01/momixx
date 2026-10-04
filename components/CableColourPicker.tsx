'use client'

import { cableColours, cableColourStore, useCableColour } from './three/cableColours'

/** Colour swatches for the home hero cable, with the name of the colour on show. */
export function CableColourPicker({ className = '' }: { className?: string }) {
  const index = useCableColour()
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div role="group" aria-label="Cable colour" className="flex items-center gap-2.5">
        {cableColours.map((c, i) => (
          <button
            key={c.id}
            type="button"
            title={c.name}
            aria-label={c.name}
            aria-pressed={i === index}
            onClick={() => cableColourStore.set(i)}
            style={{ backgroundColor: c.swatch }}
            className={`h-6 w-6 rounded-full transition-[box-shadow,scale] duration-200 hover:scale-110 lg:h-5 lg:w-5 ${
              i === index ? 'shadow-[0_0_0_2px_#05070a,0_0_0_3.5px_#ffffff]' : 'shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)]'
            }`}
          />
        ))}
      </div>
      <p aria-live="polite" className="text-center text-xs text-slate-500">
        <span className="font-medium text-slate-200">{cableColours[index].name}</span>
        <span className="mx-1.5" aria-hidden="true">
          ·
        </span>
        We match any colour
        <span className="hidden lg:inline">. Hover over the cable.</span>
      </p>
    </div>
  )
}

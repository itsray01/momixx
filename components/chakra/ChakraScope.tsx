'use client'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ChakraProvider } from '@chakra-ui/react'
import { useServerInsertedHTML } from 'next/navigation'
import { useState } from 'react'
import { system } from './system'

/**
 * Wraps the parts of the site built with Chakra UI. Everything else stays plain Tailwind.
 *
 * Chakra styles with Emotion, which by default writes its <style> tags in among the page's
 * HTML; React then finds markup it did not expect and re-renders (a hydration error). Here
 * Emotion collects the styles while the server renders and Next puts them in the <head>.
 */
export function ChakraScope({ children }: { children: React.ReactNode }) {
  const [registry] = useState(() => {
    const cache = createCache({ key: 'mx' })
    cache.compat = true
    const insert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) inserted.push(serialized.name)
      return insert(...args)
    }
    const flush = () => {
      const names = inserted
      inserted = []
      return names
    }
    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const names = registry.flush()
    if (names.length === 0) return null
    let styles = ''
    let global = ''
    const globalNames: string[] = []
    const scopedNames: string[] = []
    for (const name of names) {
      const css = registry.cache.inserted[name]
      if (typeof css !== 'string') continue
      if (name.startsWith('global')) {
        global += css
        globalNames.push(name)
      } else {
        styles += css
        scopedNames.push(name)
      }
    }
    return (
      <>
        {global && <style data-emotion={`${registry.cache.key}-global ${globalNames.join(' ')}`} dangerouslySetInnerHTML={{ __html: global }} />}
        {styles && <style data-emotion={`${registry.cache.key} ${scopedNames.join(' ')}`} dangerouslySetInnerHTML={{ __html: styles }} />}
      </>
    )
  })

  return (
    <CacheProvider value={registry.cache}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </CacheProvider>
  )
}

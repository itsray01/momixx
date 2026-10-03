import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

// Web app manifest: name, colours and icons when the site is saved to a home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.legalName,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'browser',
    background_color: '#060a10',
    theme_color: '#060a10',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}

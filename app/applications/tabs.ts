import type { Tab } from '@/components/TabNav'
import { applications } from '@/content/applications'

export const applicationTabs: Tab[] = [
  { href: '/applications', label: 'Overview' },
  ...applications.filter((a) => a.inMenu !== false).map((a) => ({ href: `/applications/${a.slug}`, label: a.tabLabel })),
  { href: '/applications#markets', label: 'Market size' },
]

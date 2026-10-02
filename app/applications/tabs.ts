import type { Tab } from '@/components/TabNav'
import { applications } from '@/content/applications'

export const applicationTabs: Tab[] = [
  { href: '/applications', label: 'Overview' },
  ...applications.map((a) => ({ href: `/applications/${a.slug}`, label: a.tabLabel })),
]

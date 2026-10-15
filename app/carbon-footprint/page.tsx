import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/carbon-footprint')

export default function Page() {
  return <TopicPage path="/carbon-footprint" />
}

import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/products/carbon-footprint')

export default function Page() {
  return <TopicPage path="/products/carbon-footprint" />
}

import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/products/coatings')

export default function Page() {
  return <TopicPage path="/products/coatings" />
}

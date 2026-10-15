import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/products/high-strength')

export default function Page() {
  return <TopicPage path="/products/high-strength" />
}

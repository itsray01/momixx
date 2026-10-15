import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/products/precision-components')

export default function Page() {
  return <TopicPage path="/products/precision-components" />
}

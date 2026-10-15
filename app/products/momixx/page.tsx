import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/products/momixx')

export default function Page() {
  return <TopicPage path="/products/momixx" />
}

import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/products/magnetic')

export default function Page() {
  return <TopicPage path="/products/magnetic" />
}

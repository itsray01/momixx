import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/products/conductive')

export default function Page() {
  return <TopicPage path="/products/conductive" />
}

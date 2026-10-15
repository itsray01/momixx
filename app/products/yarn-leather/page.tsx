import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/products/yarn-leather')

export default function Page() {
  return <TopicPage path="/products/yarn-leather" />
}

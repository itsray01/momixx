import { TopicPage, topicMetadata } from '@/components/TopicPage'

export const metadata = topicMetadata('/products/cost-effective')

export default function Page() {
  return <TopicPage path="/products/cost-effective" />
}

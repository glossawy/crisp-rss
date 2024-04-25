import { Text, Title } from '@mantine/core'

import useFeed from '@/features/feeds/hooks/useFeed'

type Props = { userId: string; feedId: number }

export default function Feed({ userId, feedId }: Props) {
  const { feed, isLoading } = useFeed(userId, feedId)

  if (feed == null || isLoading) return <div>Loading...</div>

  return (
    <main>
      <Title>{feed.title}</Title>
      <Text>{feed.description}</Text>
    </main>
  )
}

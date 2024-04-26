import { Anchor, Button, Group, Stack, Text, Title } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { notFound } from '@tanstack/react-router'

import FeedEntry from '@/features/feeds/components/FeedEntry'
import useFeed from '@/features/feeds/hooks/useFeed'

type Props = { userId: string; feedId: number }

export default function Feed({ userId, feedId }: Props) {
  const { feed, error, isLoading } = useFeed(userId, feedId)

  if (error) {
    if (error.status === 404) throw notFound()
    else if (error.status === 400) throw new Error(error.body.message)
    else throw new Error(`Feed fetch failed with status code ${error.status}`)
  }

  if (feed == null || isLoading) return <div>Loading...</div>

  return (
    <Stack px="md" pt="md">
      <Stack gap={0}>
        <Group align="center" gap={0}>
          <Title>{feed.title}</Title>
          <Anchor href={feed.source_url} style={{ alignSelf: 'start' }}>
            (source)
          </Anchor>
          <Button
            variant="outline"
            style={{ marginLeft: 'auto' }}
            rightSection={<IconSettings />}
          >
            Feed Settings
          </Button>
        </Group>
        <Anchor href={feed.site_url}>{feed.site_url}</Anchor>
        <Text>{feed.description}</Text>
      </Stack>
      <Stack>
        {feed.entries.map((entry) => (
          <FeedEntry entry={entry} key={entry.guid} />
        ))}
      </Stack>
    </Stack>
  )
}

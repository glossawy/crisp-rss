import { Anchor, Group, Stack, Text, Title } from '@mantine/core'

import { FeedInfo } from '@/features/feeds/types'

type Props = { feed: FeedInfo; rightSection?: React.ReactNode }

export default function FeedHeader({ feed, rightSection }: Props) {
  return (
    <Stack gap={0}>
      <Group align="center" gap={0}>
        <Title>{feed.title}</Title>
        <Anchor href={feed.source_url} style={{ alignSelf: 'start' }}>
          (source)
        </Anchor>
        {rightSection ? (
          <Group style={{ marginLeft: 'auto' }}>{rightSection}</Group>
        ) : null}
      </Group>
      <Anchor href={feed.site_url}>{feed.site_url}</Anchor>
      <Text>{feed.description}</Text>
    </Stack>
  )
}

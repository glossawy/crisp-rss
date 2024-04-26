import {
  Anchor,
  Card,
  Container,
  Divider,
  Group,
  Space,
  Spoiler,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'
import { parseISO } from 'date-fns'

import type { FeedEntry } from '@/features/feeds/types'

type Props = { entry: FeedEntry }

export default function FeedEntry({ entry }: Props) {
  const publishedAt = entry.published_at
    ? Intl.DateTimeFormat(undefined, {
        timeStyle: 'long',
        dateStyle: 'long',
      }).format(parseISO(entry.published_at))
    : null

  return (
    <Card>
      <Group align="start">
        <Stack gap={0}>
          <Title order={5}>{entry.title || '(no title)'}</Title>
          {entry.authors.length > 0 ? (
            <Text size="sm" c="dimmed">
              by {entry.authors.join(', ')}
            </Text>
          ) : null}
          {publishedAt ? (
            <Text size="xs" c="dimmed" mt={1}>
              {publishedAt}
            </Text>
          ) : null}
        </Stack>
        <Anchor
          href={entry.url}
          style={{ display: 'flex', marginLeft: 'auto' }}
        >
          <Text>Go to article</Text>
          <Space w="xs" />
          <IconExternalLink />
        </Anchor>
      </Group>
      <Divider my="sm" />
      <Spoiler maxHeight={500} hideLabel={'Show less'} showLabel={'Show more'}>
        <Container dangerouslySetInnerHTML={{ __html: entry.content || '' }} />
      </Spoiler>
    </Card>
  )
}

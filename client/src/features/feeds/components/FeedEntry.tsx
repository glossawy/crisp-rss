import {
  Anchor,
  Card,
  Collapse,
  Container,
  Divider,
  Flex,
  Group,
  Space,
  Spoiler,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
} from '@tabler/icons-react'
import { parseISO } from 'date-fns'

import AnchorLink from '@/components/AnchorLink'
import type { FeedEntry, FeedInfo } from '@/features/feeds/types'

import classes from './FeedEntry.module.css'

type Props = { entry: FeedEntry; feed?: FeedInfo; expanded?: boolean }

export default function FeedEntry({ entry, feed, expanded }: Props) {
  const [isExpanded, { toggle: toggleExpanded }] = useDisclosure(
    expanded == null ? false : expanded,
  )

  const publishedAt = entry.published_at
    ? Intl.DateTimeFormat(undefined, {
        timeStyle: 'long',
        dateStyle: 'long',
      }).format(parseISO(entry.published_at))
    : null

  return (
    <Card pb={0} withBorder>
      <Card.Section>
        <Group
          align="start"
          onClick={toggleExpanded}
          classNames={{ root: classes.header }}
        >
          <Flex my="auto">
            {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
          </Flex>
          <Stack gap={0}>
            {feed ? (
              <AnchorLink
                to="/feeds/$feedId"
                params={{ feedId: feed.id.toString() }}
                anchor={{ className: classes.headerFeedLink }}
              >
                <Text size="sm">{feed.title}</Text>
              </AnchorLink>
            ) : null}
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
          <Anchor href={entry.url} classNames={{ root: classes.headerOutLink }}>
            <Text>Go to article</Text>
            <Space w="xs" />
            <IconExternalLink />
          </Anchor>
        </Group>
      </Card.Section>
      <Collapse in={isExpanded} pb="md">
        <Divider mb="sm" />
        <Spoiler
          maxHeight={500}
          hideLabel={'Show less'}
          showLabel={'Show more'}
        >
          <Container
            dangerouslySetInnerHTML={{
              __html: entry.content || entry.summary || '',
            }}
          />
        </Spoiler>
      </Collapse>
    </Card>
  )
}

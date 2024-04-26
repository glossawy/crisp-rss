import { Anchor, Text, Title } from '@mantine/core'

import { ContentHeader } from '@/components/ContentHeader'
import { FeedInfo } from '@/features/feeds/types'

type Props = { feed: FeedInfo; rightSection?: React.ReactNode }

export default function FeedHeader({ feed, rightSection }: Props) {
  return (
    <ContentHeader
      leftSection={
        <>
          <Title>{feed.title}</Title>
          <Anchor
            fw={500}
            href={feed.source_url}
            style={{ alignSelf: 'start' }}
          >
            (source)
          </Anchor>
        </>
      }
      rightSection={rightSection}
    >
      <Anchor fw={500} href={feed.site_url}>
        {feed.site_url}
      </Anchor>
      {feed.description ? <Text>{feed.description}</Text> : null}
    </ContentHeader>
  )
}

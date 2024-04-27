import { Stack } from '@mantine/core'

import EndOfFeedCard from '@/features/feeds/components/EndOfFeedCard'
import FeedEntry from '@/features/feeds/components/FeedEntry'
import type { Timeline } from '@/features/timeline/types'

type Props = { timeline: Timeline }

export default function TimelineFeed({ timeline }: Props) {
  return (
    <Stack gap={4}>
      {timeline.map((entry) => (
        <FeedEntry
          feed={entry.feed}
          entry={entry}
          key={`${entry.feed.id}-${entry.guid}`}
        />
      ))}
      <EndOfFeedCard />
    </Stack>
  )
}

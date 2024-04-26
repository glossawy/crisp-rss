import { Stack } from '@mantine/core'

import FeedEntry from '@/features/feeds/components/FeedEntry'
import type { Timeline } from '@/features/timeline/types'

type Props = { timeline: Timeline }

export default function Timeline({ timeline }: Props) {
  return (
    <Stack>
      {timeline.map((entry) => (
        <FeedEntry
          feed={entry.feed}
          entry={entry}
          key={`${entry.feed.id}-${entry.guid}`}
        />
      ))}
    </Stack>
  )
}

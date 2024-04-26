import { Stack } from '@mantine/core'

import FeedEntry from '@/features/feeds/components/FeedEntry'
import { FeedDetail } from '@/features/feeds/types'

type Props = { feed: FeedDetail }

export default function Feed({ feed }: Props) {
  return (
    <Stack>
      {feed.entries.map((entry) => (
        <FeedEntry entry={entry} key={entry.guid} />
      ))}
    </Stack>
  )
}

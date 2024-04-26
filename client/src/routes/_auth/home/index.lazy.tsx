import { Text, Title } from '@mantine/core'
import { createLazyFileRoute } from '@tanstack/react-router'

import { ContentHeader } from '@/components/ContentHeader'
import MainContentMessage from '@/components/MainContentMessage'
import useSession from '@/features/authentication/hooks/useSession'
import FeedEntry from '@/features/feeds/components/FeedEntry'
import useTimeline from '@/features/timeline/hooks/useTimeline'
import useAppTitle from '@/hooks/useAppTitle'

export const Route = createLazyFileRoute('/_auth/home/')({
  component: () => {
    const sessionData = useSession()
    const userId = sessionData.userId!

    const { timeline, error, isLoading } = useTimeline(userId)

    useAppTitle('Home Timeline')

    if (error) {
      if (error.status === 500 || error.status === 401)
        throw new Error(error.body.message)
      else throw new Error('Unknown error')
    }

    if (timeline == null || isLoading)
      return <MainContentMessage message="Loading..." />

    return (
      <>
        <ContentHeader leftSection={<Title>Timeline</Title>}>
          <Text>
            A chronological timeline of entries from all of your feeds.
          </Text>
        </ContentHeader>
        {timeline.map((entry) => (
          <FeedEntry
            feed={entry.feed}
            entry={entry}
            key={`${entry.feed.id}-${entry.guid}`}
          />
        ))}
      </>
    )
  },
})

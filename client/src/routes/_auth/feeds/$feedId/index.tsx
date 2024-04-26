import { Button } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { useContext } from 'react'

import AnchorLink from '@/components/AnchorLink'
import Feed from '@/features/feeds/components/Feed'
import FeedHeader from '@/features/feeds/components/FeedHeader'
import { FeedPageContext } from '@/features/feeds/contexts/FeedPageContext'

export const Route = createFileRoute('/_auth/feeds/$feedId/')({
  component: FeedDetailPage,
})

function FeedDetailPage() {
  const { feed } = useContext(FeedPageContext)

  return (
    <>
      <FeedHeader
        feed={feed!}
        rightSection={
          <AnchorLink
            to="/feeds/$feedId/edit"
            params={{ feedId: feed!.id.toString() }}
          >
            <Button variant="outline" rightSection={<IconSettings size={16} />}>
              Feed Settings
            </Button>
          </AnchorLink>
        }
      />
      <Feed feed={feed!} />
    </>
  )
}

import { AppShell, Space, Title } from '@mantine/core'
import { useParams } from '@tanstack/react-router'

import useSession from '@/features/authentication/hooks/useSession'
import FeedSidebarList from '@/features/feeds/components/FeedSidebarList'

export default function Sidebar() {
  const { userId } = useSession()
  const { feedId } = useParams({
    strict: false,
    select(params) {
      return 'feedId' in params ? { feedId: params.feedId } : {}
    },
  })

  const selectedId =
    feedId == null || feedId === '' ? undefined : parseInt(feedId)

  return (
    <AppShell.Navbar>
      <AppShell.Section px="sm" pt="sm">
        <Title order={6}> Your Feeds</Title>
      </AppShell.Section>
      <Space h="sm" />
      <AppShell.Section>
        {userId && <FeedSidebarList userId={userId} selectedId={selectedId} />}
      </AppShell.Section>
    </AppShell.Navbar>
  )
}

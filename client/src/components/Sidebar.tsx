import { AppShell, Button, Group, Space, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useParams } from '@tanstack/react-router'

import AnchorLink from '@/components/AnchorLink'
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
        <Group>
          <Title order={6}> Your Feeds</Title>
          <AnchorLink to="/feeds/new">
            <Button
              variant="outline"
              radius="xl"
              size="xs"
              rightSection={<IconPlus size={16} />}
            >
              Add New
            </Button>
          </AnchorLink>
        </Group>
      </AppShell.Section>
      <Space h="sm" />
      <AppShell.Section>
        {userId && <FeedSidebarList userId={userId} selectedId={selectedId} />}
      </AppShell.Section>
    </AppShell.Navbar>
  )
}

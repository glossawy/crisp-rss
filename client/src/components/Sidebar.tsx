import { AppShell, Button, Group, Space, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconHome, IconPlus } from '@tabler/icons-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useCallback } from 'react'

import RoutableNavLink from '@/components/RoutableNavLink'
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

  const navigate = useNavigate()

  const onAddFeed = useCallback(() => {
    if (userId == null) return

    modals.openContextModal({
      modal: 'createFeed',
      title: 'Add New Feed',
      centered: true,
      innerProps: {
        userId,
        onNewFeed: (feed) => {
          notifications.show({ message: `Successfully created new feed!` })
          navigate({
            to: '/feeds/$feedId',
            params: { feedId: feed.id.toString() },
          })
        },
      },
    })
  }, [userId])

  const selectedId =
    feedId == null || feedId === '' ? undefined : parseInt(feedId)

  return (
    <AppShell.Navbar>
      <AppShell.Section px="sm" pt="sm">
        <Group>
          <Title order={6}> Your Feeds</Title>
          <Button
            variant="outline"
            radius="xl"
            size="xs"
            rightSection={<IconPlus size={16} />}
            onClick={onAddFeed}
          >
            Add New
          </Button>
        </Group>
      </AppShell.Section>
      <Space h="sm" />
      <AppShell.Section>
        <RoutableNavLink
          to="/home"
          navLink={{
            leftSection: <IconHome size={16} />,
            label: 'Home',
            active: selectedId == null,
          }}
        />
        {userId && <FeedSidebarList userId={userId} selectedId={selectedId} />}
      </AppShell.Section>
    </AppShell.Navbar>
  )
}

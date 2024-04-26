import { Button, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconArrowLeft, IconTrashX } from '@tabler/icons-react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useContext } from 'react'

import useSession from '@/features/authentication/hooks/useSession'
import { feedsClient } from '@/features/feeds/api'
import FeedHeader from '@/features/feeds/components/FeedHeader'
import { FeedPageContext } from '@/features/feeds/contexts/FeedPageContext'
import { queryClient } from '@/services/queryClient'
import { queries } from '@/services/queryKeys'

export const Route = createFileRoute('/_auth/feeds/$feedId/edit')({
  component: FeedEditPage,
})

function FeedEditPage() {
  const { userId, authHeader } = useSession()
  const { feed } = useContext(FeedPageContext)
  const router = useRouter()

  const { mutateAsync } = feedsClient.unsubscribeFeed.useMutation()

  const onUnsubscribe = async () => {
    await mutateAsync({
      params: { userId: userId!, id: feed!.id },
      headers: {
        authorization: authHeader,
      },
    })
    await router.navigate({ to: '/home' })

    notifications.show({
      message: `You're now unsubscribed from ${feed?.title || 'the feed'}`,
    })

    queryClient.invalidateQueries({
      queryKey: queries.feeds._def,
    })
  }

  return (
    <>
      <FeedHeader
        feed={feed!}
        rightSection={
          <>
            <Button
              variant="outline"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.history.back()}
            >
              Go Back
            </Button>
            <Button
              variant="outline"
              color="red"
              rightSection={<IconTrashX size={16} />}
              onClick={() => {
                modals.openConfirmModal({
                  title: 'Unsubscribe from feed',
                  labels: { confirm: 'Yes', cancel: 'No' },
                  children: (
                    <Text>
                      Are you sure you want to unsubscribe from this feed?
                    </Text>
                  ),
                  onConfirm: onUnsubscribe,
                })
              }}
            >
              Unsubscribe
            </Button>
          </>
        }
      />
    </>
  )
}

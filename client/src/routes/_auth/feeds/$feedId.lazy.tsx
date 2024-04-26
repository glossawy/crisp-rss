import { Stack } from '@mantine/core'
import {
  CatchBoundary,
  CatchNotFound,
  Outlet,
  createLazyFileRoute,
} from '@tanstack/react-router'

import MainContentMessage from '@/components/MainContentMessage'
import useSession from '@/features/authentication/hooks/useSession'
import FeedPageContextProvider from '@/features/feeds/components/FeedPageContextProvider'

export const Route = createLazyFileRoute('/_auth/feeds/$feedId')({
  component: FeedPage,
})

function FeedPage() {
  const { userId } = useSession()
  const feedId = Route.useParams({
    select: ({ feedId }) => parseInt(feedId),
  })

  return (
    <CatchBoundary
      getResetKey={() => `${userId}:${feedId}`}
      errorComponent={() => (
        <MainContentMessage message="Error occurred while loading feed" />
      )}
    >
      <CatchNotFound
        fallback={(_error) => (
          <MainContentMessage message="Failed to find feed" />
        )}
      >
        <FeedPageContextProvider feedId={feedId} userId={userId!}>
          <Stack pt="md" px="md">
            <Outlet />
          </Stack>
        </FeedPageContextProvider>
      </CatchNotFound>
    </CatchBoundary>
  )
}

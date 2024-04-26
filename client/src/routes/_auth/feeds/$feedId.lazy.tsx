import {
  CatchBoundary,
  CatchNotFound,
  createLazyFileRoute,
} from '@tanstack/react-router'

import MainContentError from '@/components/MainContentError'
import useSession from '@/features/authentication/hooks/useSession'
import Feed from '@/features/feeds/components/Feed'

export const Route = createLazyFileRoute('/_auth/feeds/$feedId')({
  component: FeedPage,
})

function FeedPage() {
  const { userId } = useSession()
  const feedId = Route.useParams({
    select: ({ feedId }) => parseInt(feedId),
  })

  if (!userId) return <div>You are not logged in</div>

  return (
    <CatchBoundary
      getResetKey={() => `${userId}:${feedId}`}
      errorComponent={() => (
        <MainContentError message="Error occurred while loading feed" />
      )}
    >
      <CatchNotFound
        fallback={(_error) => (
          <MainContentError message="Failed to find feed" />
        )}
      >
        <Feed userId={userId} feedId={feedId} />
      </CatchNotFound>
    </CatchBoundary>
  )
}

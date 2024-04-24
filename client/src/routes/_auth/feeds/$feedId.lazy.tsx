import { createLazyFileRoute } from '@tanstack/react-router'

import useSession from '@/features/authentication/hooks/useSession'
import Feed from '@/features/feeds/components/Feed'

export const Route = createLazyFileRoute('/_auth/feeds/$feedId')({
  component: FeedPage,
})

function FeedPage() {
  const { userId } = useSession()
  const { feedId } = Route.useParams()

  if (!userId) return <div>You are not logged in</div>

  return <Feed userId={userId} feedId={parseInt(feedId)} />
}

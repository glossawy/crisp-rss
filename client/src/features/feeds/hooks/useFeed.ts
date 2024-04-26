import useSession from '@/features/authentication/hooks/useSession'
import { feedsClient } from '@/features/feeds/api'
import { queries } from '@/services/queryKeys'

export default function useFeed(userId: string, feedId: number) {
  const { authHeader } = useSession()

  const {
    data: feed,
    error,
    isLoading,
  } = feedsClient.getFeed.useQuery(
    queries.feeds.detail(userId, feedId).queryKey,
    {
      headers: {
        authorization: authHeader,
      },
      params: {
        userId,
        id: feedId,
      },
    },
    {
      ...queries.feeds.detail(userId, feedId),
      select: (data) => data.body.data.feed,
    },
  )

  return { feed, error, isLoading }
}

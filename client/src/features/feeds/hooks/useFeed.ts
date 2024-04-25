import useSession from '@/features/authentication/hooks/useSession'
import { feedsClient } from '@/features/feeds/api'
import { QueryKeys } from '@/services/queryKeys'

export default function useFeed(userId: string, feedId: number) {
  const { authHeader } = useSession()

  const {
    data: feed,
    error,
    isLoading,
  } = feedsClient.getFeed.useQuery(
    QueryKeys.feeds.fetchOne(userId, feedId),
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
      queryKey: QueryKeys.feeds.fetchOne(userId, feedId),
      select: (data) => data.body.data.feed,
    },
  )

  return { feed, error, isLoading }
}

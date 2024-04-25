import useSession from '@/features/authentication/hooks/useSession'
import { feedsClient } from '@/features/feeds/api'
import { QueryKeys } from '@/services/queryKeys'

export default function useFeeds(userId: string) {
  const { authHeader } = useSession()

  const {
    data: feeds,
    error,
    isFetching,
  } = feedsClient.getAllFeeds.useQuery(
    QueryKeys.feeds.fetchAll(userId),
    {
      headers: {
        authorization: authHeader,
      },
      params: {
        userId,
      },
    },
    {
      queryKey: QueryKeys.feeds.fetchAll(userId),
      select: (data) => data.body.data.feeds,
    },
  )

  return { feeds, error, isFetching }
}

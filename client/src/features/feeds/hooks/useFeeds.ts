import useSession from '@/features/authentication/hooks/useSession'
import { feedsClient } from '@/features/feeds/api'
import { queries } from '@/services/queryKeys'

export default function useFeeds(userId: string) {
  const { authHeader } = useSession()

  const {
    data: feeds,
    error,
    isLoading,
  } = feedsClient.getAllFeeds.useQuery(
    queries.feeds.all(userId).queryKey,
    {
      headers: {
        authorization: authHeader,
      },
      params: {
        userId,
      },
    },
    {
      ...queries.feeds.all(userId),
      select: (data) => data.body.data.feeds,
    },
  )

  return { feeds, error, isLoading }
}

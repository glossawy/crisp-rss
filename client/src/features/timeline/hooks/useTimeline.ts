import useSession from '@/features/authentication/hooks/useSession'
import { timelineClient } from '@/features/timeline/api'
import { queries } from '@/services/queryKeys'

export default function useTimeline(userId: string) {
  const { authHeader } = useSession()

  const {
    data: timeline,
    error,
    isLoading,
  } = timelineClient.fetchAll.useQuery(
    queries.feeds.timeline(userId).queryKey,
    {
      headers: {
        authorization: authHeader,
      },
      params: {
        userId,
      },
    },
    {
      ...queries.feeds.timeline(userId),
      select: (data) => data.body.data.timeline,
    },
  )

  return { timeline, error, isLoading }
}

import useSession from '@/features/authentication/hooks/useSession'
import { usersClient } from '@/features/users/api'
import { queries } from '@/services/queryKeys'

export default function useUser(userId: string | null) {
  const { authHeader } = useSession()

  const {
    data: user,
    error,
    isFetching,
  } = usersClient.getUser.useQuery(
    queries.users.detail(userId!).queryKey,
    {
      headers: {
        authorization: authHeader,
      },
      params: {
        id: userId!,
      },
    },
    {
      ...queries.users.detail(userId!),
      enabled: userId != null,
      select: (data) => data.body.data.user,
    },
  )

  return { user, error, isFetching }
}

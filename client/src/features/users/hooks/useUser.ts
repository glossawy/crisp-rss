import useSession from '@/features/authentication/hooks/useSession'
import { usersClient } from '@/features/users/api'
import { QueryKeys } from '@/services/queryKeys'

export default function useUser(userId: string | null) {
  const { authHeader } = useSession()

  const {
    data: user,
    error,
    isFetching,
  } = usersClient.getUser.useQuery(
    QueryKeys.user(userId!),
    {
      headers: {
        authorization: authHeader,
      },
      params: {
        id: userId!,
      },
    },
    {
      queryKey: QueryKeys.user(userId!),
      enabled: userId != null,
      select: (data) => data.body.data.user,
    },
  )

  return { user, error, isFetching }
}

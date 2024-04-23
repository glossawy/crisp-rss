import { Pill } from '@/components/ui/pill'
import useUser from '@/features/users/hooks/useUser'
import { WithoutChildren } from '@/lib/utils'

type Props = WithoutChildren<React.ComponentProps<typeof Pill>> & {
  userId: string
}

export default function UserPill({ userId, ...pillProps }: Props) {
  const { user, isFetching } = useUser(userId)

  return (
    <Pill {...pillProps}>{isFetching ? 'Loading...' : user!.display_name}</Pill>
  )
}

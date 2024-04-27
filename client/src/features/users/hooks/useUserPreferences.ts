import useSession from '@/features/authentication/hooks/useSession'
import useUser from '@/features/users/hooks/useUser'
import { UserConfigs } from '@/features/users/types'
import { getComputedColorScheme } from '@/lib/utils'

export default function useUserPreferences(): UserConfigs {
  const { userId } = useSession()
  const { user } = useUser(userId)

  const userConfig: UserConfigs =
    user != null
      ? user.configs
      : {
          color_scheme: 'auto',
        }

  if (userConfig.color_scheme === 'auto') {
    userConfig.color_scheme = getComputedColorScheme()
  }

  return userConfig
}

import useSession from '@/features/authentication/hooks/useSession'
import useUser from '@/features/users/hooks/useUser'
import { UserConfigs } from '@/features/users/types'
import { getComputedColorScheme } from '@/lib/utils'

type ComputedConfig = { colorScheme: 'dark' | 'light' }
type ComputedUserConfig = UserConfigs & {
  computed: {
    colorScheme: 'dark' | 'light'
  }
}

export default function useUserPreferences(): {
  config: ComputedUserConfig
  loaded: boolean
} {
  const { userId } = useSession()
  const { user } = useUser(userId)

  const userConfig: UserConfigs =
    user != null
      ? user.configs!
      : {
          color_scheme: 'auto',
        }

  const computedConfig: ComputedConfig = {
    colorScheme:
      userConfig.color_scheme === 'auto'
        ? getComputedColorScheme()
        : userConfig.color_scheme,
  }

  return {
    config: { ...userConfig, computed: computedConfig },
    loaded: user != null,
  }
}

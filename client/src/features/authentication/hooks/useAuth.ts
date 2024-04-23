import { useCallback } from 'react'

import useSession from '@/features/authentication/hooks/useSession'
import {
  AuthenticateParams,
  authenticate,
  logout as unauthenticate,
} from '@/features/authentication/lib/auth'

export default function useAuth() {
  const { setSession, clearSession } = useSession()

  const login = useCallback(
    async (params: AuthenticateParams) => {
      const sessionInfo = await authenticate(params)

      if (sessionInfo) {
        setSession(sessionInfo)
        return true
      } else {
        return false
      }
    },
    [setSession],
  )

  const logout = useCallback(async () => {
    const isLoggedOut = await unauthenticate()

    if (isLoggedOut) {
      clearSession()
    }

    return isLoggedOut
  }, [clearSession])

  return { login, logout }
}

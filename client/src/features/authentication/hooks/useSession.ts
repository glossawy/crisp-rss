import { useCallback } from 'react'

import { SessionInfo } from '@/features/authentication/types'
import useLocalStorage from '@/hooks/useLocalStorage'
import { StorageKeys } from '@/lib/storageKeys'

export default function useSession() {
  const [session, setSession] = useLocalStorage<SessionInfo | null>(
    StorageKeys.session,
    null,
  )

  const clearSession = useCallback(() => {
    setSession(null)
  }, [setSession])

  return { session, setSession, clearSession }
}

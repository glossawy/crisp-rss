import { useCallback } from 'react'

import useLocalStorage from '@/hooks/useLocalStorage'
import { StorageKeys } from '@/lib/storageKeys'

export type SessionInfo = {
  jwt: string
  expires_at: string
}

export default function useSession() {
  const [session, setSession] = useLocalStorage<SessionInfo | null>(
    StorageKeys.session,
    null,
  )

  const authHeader = `Bearer ${session?.jwt}`

  const clearSession = useCallback(() => {
    setSession(null)
  }, [setSession])

  return { session, authHeader, setSession, clearSession }
}

import { useDebugValue } from 'react'

import useLocalStorage from '@/hooks/useLocalStorage'
import { StorageKeys } from '@/lib/storageKeys'

export type SessionInfo = {
  jwt: string
  expires_at: string
}

export default function useSession() {
  const {
    value: session,
    setStoredValue,
    clearStoredValue,
  } = useLocalStorage(StorageKeys.session, null)

  const authHeader = `Bearer ${session?.jwt || ''}`

  useDebugValue(session)

  return {
    session,
    authHeader,
    setSession: setStoredValue,
    clearSession: clearStoredValue,
  }
}

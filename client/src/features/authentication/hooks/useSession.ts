import { parseISO } from 'date-fns'
import * as jose from 'jose'
import { useCallback } from 'react'

import useLocalStorage from '@/hooks/useLocalStorage'
import { StorageKeys } from '@/lib/storageKeys'

export type SessionInfo = {
  jwt: string
  expires_at: string
}

export type JwtSessionData = {
  user_id: string
  session_token: string
}

export default function useSession() {
  const {
    value: session,
    setStoredValue,
    clearStoredValue,
  } = useLocalStorage(StorageKeys.session, null)

  const authHeader = `Bearer ${session?.jwt || ''}`
  const data: JwtSessionData | null = session?.jwt
    ? jose.decodeJwt<JwtSessionData>(session.jwt)
    : null

  const setExpiry = useCallback(
    (expiry: Date) => {
      if (session)
        setStoredValue({ ...session, expires_at: expiry.toISOString() })
    },
    [session, setStoredValue],
  )

  return {
    sessionId: data?.session_token || null,
    userId: data?.user_id || null,
    expiry: session == null ? null : parseISO(session.expires_at),
    authHeader,
    setExpiry,
    setSession: setStoredValue,
    clearSession: clearStoredValue,
  }
}

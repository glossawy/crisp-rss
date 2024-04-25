import { differenceInMilliseconds, parseISO } from 'date-fns'
import { useEffect } from 'react'

import { sessionsClient } from '@/features/authentication/api'
import useSession from '@/features/authentication/hooks/useSession'
import { getAuthHeader } from '@/features/authentication/lib/auth'

const HEARTBEAT_INTERVAL = import.meta.env.DEV ? 5 * 1000 : 60 * 1000

export default function SessionHeartbeat() {
  const { setExpiry, clearSession } = useSession()

  useEffect(() => {
    const checkSession = async () => {
      const response = await sessionsClient.checkSession.query({
        headers: {
          authorization: getAuthHeader(),
        },
      })

      if (response.status === 401) {
        clearSession()
      } else if (response.status === 200) {
        const expiry = parseISO(response.body.expires_at)

        // Sign-out early if session expires soon or has expired
        if (differenceInMilliseconds(expiry, new Date()) < HEARTBEAT_INTERVAL)
          clearSession()
        else setExpiry(expiry)
      }
    }

    const interval: Timer = setInterval(checkSession, HEARTBEAT_INTERVAL)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return null
}

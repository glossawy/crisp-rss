import { useRouterState } from '@tanstack/react-router'
import { differenceInMilliseconds, parseISO } from 'date-fns'
import { useEffect } from 'react'

import { sessionsClient } from '@/features/authentication/api'
import useSession from '@/features/authentication/hooks/useSession'

const HEARTBEAT_INTERVAL = import.meta.env.DEV ? 5 * 1000 : 60 * 1000

export default function SessionHeartbeat() {
  const { session, authHeader, setSession, clearSession } = useSession()
  const { location } = useRouterState()

  useEffect(() => {
    if (location.pathname in ['', '/']) return

    const checkSession = async () => {
      const response = await sessionsClient.checkSession.query({
        headers: {
          authorization: authHeader,
        },
      })

      if (response.status !== 200) {
        clearSession()
      } else {
        const expiry = parseISO(response.body.expires_at)

        // Sign-out early if session expires soon or has expired
        if (differenceInMilliseconds(expiry, new Date()) < HEARTBEAT_INTERVAL)
          clearSession()
        else if (session)
          setSession({ ...session, expires_at: expiry.toISOString() })
      }
    }

    const interval: Timer = setInterval(checkSession, HEARTBEAT_INTERVAL)
    return () => {
      clearInterval(interval)
    }
  }, [location.pathname, session?.expires_at, clearSession])

  return null
}

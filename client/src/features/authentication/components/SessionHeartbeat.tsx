import { useEffect } from 'react'

import { sessionsClient } from '@/features/authentication/api'
import useSession from '@/features/authentication/hooks/useSession'

export default function SessionHeartbeat() {
  const { session, setSession, clearSession } = useSession()

  useEffect(() => {
    if (session?.expires_at == null) return

    const checkSession = async () => {
      const response = await sessionsClient.checkSession.query()

      if (
        response.status === 200 &&
        session.expires_at !== response.body.expires_at
      ) {
        setSession(response.body)
      } else {
        clearSession()
      }
    }

    const interval: Timer = setInterval(checkSession, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [session?.expires_at, clearSession])

  return null
}

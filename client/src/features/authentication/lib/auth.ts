import { isPast, parseISO } from 'date-fns'
import { z } from 'zod'

import {
  CreateSessionRequest,
  sessionsClient,
} from '@/features/authentication/api'
import { fetchStoredData } from '@/lib/storage'
import { StorageKeys } from '@/lib/storageKeys'
import { bearerToken } from '@/services/utils'

export type AuthenticateParams = z.infer<typeof CreateSessionRequest>['user']

export type SessionInfo = {
  jwt: string
  expires_at: string
}

function fetchSessionInfo() {
  return fetchStoredData(StorageKeys.session)
}

export function isAuthenticated() {
  const session = fetchSessionInfo()

  if (session == null) return false

  const expiry = parseISO(session.expires_at)
  return !isPast(expiry)
}

export function getAuthHeader(): string {
  const session = fetchSessionInfo()

  const jwt = session == null ? '' : session.jwt

  return `Bearer ${jwt}`
}

export async function logout(): Promise<boolean> {
  const session = fetchSessionInfo()

  if (!session) throw new Error('Attempted to log out with a session')

  const response = await sessionsClient.expireSession.query({
    headers: {
      authorization: bearerToken(session.jwt),
    },
  })

  if ([200, 400].includes(response.status)) {
    return true
  }

  return false
}

export async function authenticate(
  params: AuthenticateParams,
): Promise<SessionInfo | null> {
  const response = await sessionsClient.createSession.mutation({
    body: { user: params },
  })

  if (response.status === 201) {
    const jwt = response.headers.get('Access-Token')
    const expiry = response.headers.get('Expire-At')

    if (jwt == null || expiry == null)
      throw new Error(
        'Received successful login response but missing Access-Token or Expire-At header',
      )

    const session: SessionInfo = { jwt, expires_at: expiry }

    return session
  } else {
    return null
  }
}

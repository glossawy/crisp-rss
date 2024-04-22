import { isPast, parseISO } from 'date-fns'
import { z } from 'zod'

import {
  CreateSessionRequest,
  sessionsClient,
} from '@/features/authentication/api'
import { clearStoredData, fetchStoredData, storeData } from '@/lib/storage'
import { StorageKeys } from '@/lib/storageKeys'
import { bearerToken } from '@/services/utils'

type AuthenticateParams = z.infer<typeof CreateSessionRequest>['user']

export type SessionInfo = {
  jwt: string
  expires_at: string
}

function saveSessionInfo(session: SessionInfo) {
  storeData(StorageKeys.session, session)
}

function fetchSessionInfo() {
  return fetchStoredData(StorageKeys.session)
}

function clearSessionInfo() {
  return clearStoredData(StorageKeys.session)
}

export function isAuthenticated() {
  const session = fetchSessionInfo()

  if (session == null) return false

  const expiry = parseISO(session.expires_at)
  return !isPast(expiry)
}

export async function logout() {
  const session = fetchSessionInfo()

  if (session) {
    const response = await sessionsClient.expireSession.query({
      headers: {
        authorization: bearerToken(session.jwt),
      },
    })

    if (response.status in [200, 400]) {
      clearSessionInfo()
    }
  }
}

export async function authenticate(params: AuthenticateParams) {
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

    saveSessionInfo({ jwt, expires_at: expiry })

    return true
  } else {
    return false
  }
}

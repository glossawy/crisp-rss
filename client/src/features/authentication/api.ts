import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { SessionResponse } from '@/features/authentication/types'
import createClient from '@/services/createClient'
import { JSendError, JSendSuccess } from '@/services/types'

const c = initContract()

export const CreateSessionRequest = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
})

export const contract = c.router(
  {
    createSession: {
      method: 'POST',
      path: '/sessions',
      summary: 'Create a new session for a user',
      responses: {
        201: c.noBody(),
        400: c.type<JSendError>(),
      },
      body: CreateSessionRequest,
    },
    checkSession: {
      method: 'GET',
      path: '/sessions/check',
      summary: 'Check the current user session',
      responses: {
        200: c.type<JSendSuccess<SessionResponse>>(),
      },
      headers: z.object({
        authorization: z.string(),
      }),
    },
    expireSession: {
      method: 'GET',
      path: '/sessions/logout',
      summary: 'Log out of the current user session',
      responses: {
        200: c.type<JSendSuccess<SessionResponse>>(),
        400: c.type<JSendError>(),
      },
      headers: z.object({
        authorization: z.string(),
      }),
    },
  },
  {
    commonResponses: {
      401: c.type<JSendError>(),
    },
    strictStatusCodes: true,
  },
)

export const sessionsClient = createClient(contract)

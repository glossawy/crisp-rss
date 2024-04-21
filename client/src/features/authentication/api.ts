import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { CheckSessionResponse } from '@/features/authentication/types'
import createClient from '@/services/createClient'
import { MessageResponse } from '@/services/types'

const c = initContract()

export const contract = c.router({
  createSession: {
    method: 'POST',
    path: '/sessions',
    summary: 'Create a new session for a user',
    responses: {
      201: c.type<MessageResponse>(),
      400: c.noBody(),
    },
    body: z.object({
      user: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    }),
  },
  checkSession: {
    method: 'GET',
    path: '/sessions/check',
    summary: 'Check the current user session',
    responses: {
      200: c.type<CheckSessionResponse>(),
      400: c.noBody(),
    },
    headers: z.object({
      authorization: z.string(),
    }),
  },
})

export const sessionsClient = createClient(contract)

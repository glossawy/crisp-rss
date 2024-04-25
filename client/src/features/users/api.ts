import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { User } from '@/features/users/types'
import createClient from '@/services/createClient'
import { JSendError, JSendFail, JSendSuccess } from '@/services/types'

const c = initContract()

const contract = c.router(
  {
    getUser: {
      method: 'GET',
      path: '/users/:id',
      summary: 'Get user with id',
      pathParams: z.object({
        id: z.string(),
      }),
      responses: {
        200: c.type<JSendSuccess<{ user: User }>>(),
        404: c.type<JSendFail<'id'>>(),
      },
    },
  },
  {
    baseHeaders: z.object({
      authorization: z.string(),
    }),
    commonResponses: {
      401: c.type<JSendError>(),
    },
    strictStatusCodes: true,
  },
)

export const usersClient = createClient(contract)

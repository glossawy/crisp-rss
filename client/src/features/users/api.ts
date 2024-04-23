import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { GetUserResponse } from '@/features/users/types'
import createClient from '@/services/createClient'
import { MessageResponse } from '@/services/types'

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
        200: c.type<GetUserResponse>(),
        404: c.type<MessageResponse>(),
      },
    },
  },
  {
    baseHeaders: z.object({
      authorization: z.string(),
    }),
    commonResponses: {
      401: c.type<MessageResponse>(),
    },
    strictStatusCodes: true,
  },
)

export const usersClient = createClient(contract)

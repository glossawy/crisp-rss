import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { UserConfigSchema } from '@/features/users/forms'
import { User, UserConfigs } from '@/features/users/types'
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
    updateUser: {
      method: 'PUT',
      path: '/users/:id',
      pathParams: z.object({
        id: z.string(),
      }),
      body: z.object({
        user: z.object({
          configs: UserConfigSchema,
        }),
      }),
      responses: {
        200: c.type<JSendSuccess<{ user: User }>>(),
        422: c.type<JSendFail<keyof User | keyof UserConfigs>>(),
        500: c.type<JSendError>(),
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

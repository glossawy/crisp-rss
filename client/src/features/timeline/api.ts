import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { TimelineFetchAllPayload } from '@/features/timeline/types'
import createClient from '@/services/createClient'
import { JSendError, JSendSuccess } from '@/services/types'

const c = initContract()

const contract = c.router(
  {
    fetchAll: {
      method: 'GET',
      path: '/users/:userId/timeline',
      pathParams: z.object({
        userId: z.string(),
      }),
      responses: {
        200: c.type<JSendSuccess<TimelineFetchAllPayload>>(),
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

export const timelineClient = createClient(contract)

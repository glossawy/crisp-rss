import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { FetchFeedsResponse } from '@/features/feeds/types'
import createClient from '@/services/createClient'
import { MessageResponse } from '@/services/types'

const c = initContract()

const contract = c.router(
  {
    fetchFeeds: {
      method: 'GET',
      path: '/users/:userId/feeds',
      pathParams: z.object({
        userId: z.string(),
      }),
      responses: {
        200: c.type<FetchFeedsResponse>(),
        400: c.type<MessageResponse>(),
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

export const feedsClient = createClient(contract)

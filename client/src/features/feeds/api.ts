import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import { FeedDetail, FeedInfo } from '@/features/feeds/types'
import createClient from '@/services/createClient'
import { JSendError, JSendFail, JSendSuccess } from '@/services/types'

const c = initContract()

export const CreateFeedPayload = z.object({
  url: z.string().url(),
  interval: z.number().int().min(30),
})

const contract = c.router(
  {
    getAllFeeds: {
      method: 'GET',
      path: '/users/:userId/feeds',
      pathParams: z.object({
        userId: z.string(),
      }),
      responses: {
        200: c.type<JSendSuccess<{ feeds: FeedInfo[] }>>(),
        400: c.type<JSendError>(),
      },
    },
    getFeed: {
      method: 'GET',
      path: '/users/:userId/feeds/:id',
      pathParams: z.object({
        userId: z.string(),
        id: z.coerce.number(),
      }),
      responses: {
        200: c.type<JSendSuccess<{ feed: FeedDetail }>>(),
        404: c.type<JSendFail<'id'>>(),
        400: c.type<JSendError>(),
      },
    },
    createFeed: {
      method: 'POST',
      path: '/users/:userId/feeds',
      pathParams: z.object({
        userId: z.string(),
      }),
      body: z.object({
        feed: CreateFeedPayload,
      }),
      responses: {
        201: c.type<JSendSuccess<{ feed: FeedInfo }>>(),
        422: c.type<JSendFail<keyof z.infer<typeof CreateFeedPayload>>>(),
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

export const feedsClient = createClient(contract)

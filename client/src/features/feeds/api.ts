import { initContract } from '@ts-rest/core'
import { z } from 'zod'

import {
  FeedInfo,
  GetAllFeedsResponse,
  GetFeedResponse,
} from '@/features/feeds/types'
import createClient from '@/services/createClient'
import { JSendFail, JSendSuccess, MessageResponse } from '@/services/types'

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
        200: c.type<GetAllFeedsResponse>(),
        400: c.type<MessageResponse>(),
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
        200: c.type<GetFeedResponse>(),
        404: c.type<MessageResponse>(),
        400: c.type<MessageResponse>(),
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
        201: c.type<JSendSuccess<FeedInfo>>(),
        422: c.type<JSendFail<z.infer<typeof CreateFeedPayload>>>(),
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

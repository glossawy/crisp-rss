import { z } from 'zod'

import { parseDurationToMinutes } from '@/lib/utils'

const CreateFeedSchema = z.object({
  url: z.string().url(),
  interval: z
    .string()
    .regex(/\d\d(:\d\d(:\d\d)?)?/, {
      message: 'Interval must be in dd:hh:mm format',
    })
    .refine((value) => parseDurationToMinutes(value) >= 30, {
      message: 'Interval must be at least 30 minutes',
    }),
})

const EditFeedSchema = CreateFeedSchema

export type CreateFeedValues = z.infer<typeof CreateFeedSchema>
export type EditFeedValues = z.infer<typeof EditFeedSchema>

export const schemas = {
  create: CreateFeedSchema,
  edit: EditFeedSchema,
}

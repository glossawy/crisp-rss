import { z } from 'zod'

export const UserConfigSchema = z.object({
  colorScheme: z.union([
    z.literal('dark'),
    z.literal('light'),
    z.literal('auto'),
  ]),
})

export type UserConfigFormValues = z.infer<typeof UserConfigSchema>

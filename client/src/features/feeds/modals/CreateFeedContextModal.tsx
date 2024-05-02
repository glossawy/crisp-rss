import { Stack, TextInput } from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { useMutation } from '@tanstack/react-query'
import { Controller } from 'react-hook-form'
import { z } from 'zod'

import CrispForm from '@/components/CrispForm'
import { DurationInput } from '@/components/inputs/DurationInput'
import { getAuthHeader } from '@/features/authentication/lib/auth'
import { CreateFeedPayload, feedsClient } from '@/features/feeds/api'
import { FeedInfo } from '@/features/feeds/types'
import { parseDurationToMinutes } from '@/lib/utils'
import { queryClient } from '@/services/queryClient'
import { queries } from '@/services/queryKeys'

type FormValues = {
  url: string
  interval: string
}

const FormValuesSchema = z.object({
  url: z.string().url(),
  interval: z
    .string()
    .regex(/^\d+:\d\d:\d\d|\d+:\d\d|\d\d$/, {
      message: 'Must be in dd:hh:mm format',
    })
    .refine((duration) => parseDurationToMinutes(duration) >= 30, {
      message: 'Interval cannot be more frequent than 30 minutes',
    }),
})

export default function CreateFeedContextModal({
  context,
  id,
  innerProps: { userId, onNewFeed },
}: ContextModalProps<{
  userId: string
  onNewFeed: (feed: FeedInfo) => void
}>) {
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: z.infer<typeof CreateFeedPayload>) => {
      return await feedsClient.createFeed.mutation({
        headers: {
          authorization: getAuthHeader(),
        },
        params: {
          userId,
        },
        body: {
          feed: payload,
        },
      })
    },
  })

  return (
    <CrispForm<FormValues>
      schema={FormValuesSchema}
      defaults={{ url: '', interval: '' }}
      onSubmitFactory={({ form }) =>
        async (values: FormValues) => {
          const { body, status } = await mutateAsync({
            url: values.url,
            interval: parseDurationToMinutes(values.interval),
          })

          if (status === 201) {
            onNewFeed(body.data.feed)
            queryClient.invalidateQueries({
              ...queries.feeds.all(userId),
            })
            context.closeContextModal(id)
          } else if (status === 401) {
            form.setError('root', { message: 'You are not logged in' })
          } else if (body.status === 'fail') {
            Object.keys(values).forEach((fieldName) => {
              const field = fieldName as keyof FormValues
              form.setError(field, { message: body.data[field] })
            })
          }
        }}
    >
      <Stack gap="md">
        <Controller
          name="url"
          render={({ field, fieldState: { error } }) => (
            <TextInput
              label="Feed URL"
              error={error?.message}
              {...field}
              withAsterisk
            />
          )}
        />
        <Controller
          name="interval"
          render={({ field, fieldState: { error } }) => (
            <DurationInput
              label="Refresh Interval"
              error={error?.message}
              {...field}
              withAsterisk
            />
          )}
        />
      </Stack>
    </CrispForm>
  )
}

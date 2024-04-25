import { zodResolver } from '@hookform/resolvers/zod'
import { Button, NumberInput, Space, TextInput } from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { getAuthHeader } from '@/features/authentication/lib/auth'
import { CreateFeedPayload, feedsClient } from '@/features/feeds/api'
import { FeedInfo } from '@/features/feeds/types'
import { queryClient } from '@/services/queryClient'
import { QueryKeys } from '@/services/queryKeys'

type FormValues = z.infer<typeof CreateFeedPayload>

export default function CreateFeedContextModal({
  context,
  id,
  innerProps: { userId, onNewFeed },
}: ContextModalProps<{
  userId: string
  onNewFeed: (feed: FeedInfo) => void
}>) {
  const form = useForm<FormValues>({
    resolver: zodResolver(CreateFeedPayload),
    defaultValues: {
      url: '',
      interval: 30,
    },
  })

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

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const { body, status } = await mutateAsync(values)

      if (status === 201) {
        onNewFeed(body.data)
        queryClient.invalidateQueries({
          queryKey: QueryKeys.feeds.fetchAll(userId),
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
    },
    [id, mutateAsync, onNewFeed],
  )

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
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
      <Space h="md" />
      <Controller
        control={form.control}
        name="interval"
        render={({ field, fieldState: { error } }) => (
          <NumberInput
            label="Refresh Interval (minutes)"
            error={error?.message}
            {...field}
            withAsterisk
          />
        )}
      />
      <Space h="md" />

      <Button type="submit" variant="subtle">
        Submit
      </Button>
    </form>
  )
}

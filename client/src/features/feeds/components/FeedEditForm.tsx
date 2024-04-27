import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, Space, TextInput } from '@mantine/core'
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { DurationInput } from '@/components/inputs/DurationInput'
import useSession from '@/features/authentication/hooks/useSession'
import { EditFeedPayload, feedsClient } from '@/features/feeds/api'
import { type EditFeedValues, schemas } from '@/features/feeds/forms'
import { FeedInfo } from '@/features/feeds/types'
import { getError } from '@/lib/errors'
import { formatMinutesAsDuration, parseDurationToMinutes } from '@/lib/utils'
import { queryClient } from '@/services/queryClient'
import { queries } from '@/services/queryKeys'

type FormValues = EditFeedValues
type AlertDetails = { isDanger: boolean; message: string }
type Props = {
  feed: FeedInfo
  userId: string
}

const FormValuesSchema = schemas.edit

export default function FeedEditForm({ userId, feed }: Props) {
  const [alert, setAlert] = useState<AlertDetails | null>(null)
  const { authHeader } = useSession()
  const form = useForm<FormValues>({
    defaultValues: {
      url: feed.url,
      interval: formatMinutesAsDuration(feed.interval),
    },
    resolver: zodResolver(FormValuesSchema),
  })

  const { mutateAsync } = useMutation({
    mutationFn: async (payload: z.infer<typeof EditFeedPayload>) =>
      await feedsClient.updateFeed.mutation({
        headers: {
          authorization: authHeader,
        },
        params: {
          userId,
          id: feed.id,
        },
        body: { feed: payload },
      }),
  })

  const onSubmit = async (values: FormValues) => {
    const response = await mutateAsync({
      ...values,
      interval: parseDurationToMinutes(values.interval),
    })

    if (response.body.status === 'success') {
      await queryClient.invalidateQueries({
        queryKey: queries.feeds._def,
      })
      form.reset(values)
      setAlert({ isDanger: false, message: 'Successfully updated feed!' })
    } else if (response.body.status === 'fail') {
      Object.entries(response.body.data).forEach(([field, error]) => {
        form.setError(field as keyof FormValues, { message: error })
      })
      setAlert({ isDanger: true, message: 'Some field were invalid.' })
    } else {
      setAlert({ isDanger: true, message: getError(response.body.message) })
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onChange={() => setAlert(null)}
    >
      <Controller
        control={form.control}
        name="url"
        render={({ field, fieldState: { error } }) => (
          <TextInput label="Feed URL" error={error?.message} {...field} />
        )}
      />
      <Space h="md" />
      <Controller
        control={form.control}
        name="interval"
        render={({ field, fieldState: { error } }) => (
          <DurationInput
            autoComplete="off"
            label="Refresh Interval"
            error={error?.message}
            {...field}
          />
        )}
      />
      <Space h="md" />

      <Group gap={0}>
        <Button
          type="submit"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          Submit
        </Button>
        {!form.formState.isSubmitting && alert ? (
          <Alert
            py={0}
            variant="transparent"
            color={alert.isDanger ? 'red' : 'green'}
            title={alert.message}
            icon={alert.isDanger ? <IconExclamationCircle /> : <IconCheck />}
          />
        ) : null}
      </Group>
    </form>
  )
}

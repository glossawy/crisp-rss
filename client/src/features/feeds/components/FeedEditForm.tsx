import { Stack, TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import CrispForm from '@/components/CrispForm'
import { DurationInput } from '@/components/inputs/DurationInput'
import useSession from '@/features/authentication/hooks/useSession'
import { EditFeedPayload, feedsClient } from '@/features/feeds/api'
import { type EditFeedValues, schemas } from '@/features/feeds/forms'
import { FeedInfo } from '@/features/feeds/types'
import { getError } from '@/lib/errors'
import { formatMinutesAsDuration, parseDurationToMinutes } from '@/lib/utils'
import { queryClient } from '@/services/queryClient'
import { queries } from '@/services/queryKeys'

type Props = {
  feed: FeedInfo
  userId: string
}

type FormValues = EditFeedValues
const FormValuesSchema = schemas.edit

export default function FeedEditForm({ userId, feed }: Props) {
  const { authHeader } = useSession()

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

  return (
    <CrispForm<FormValues>
      schema={FormValuesSchema}
      defaults={{
        url: feed.url,
        interval: formatMinutesAsDuration(feed.interval),
      }}
      onSubmit={async ({ form, setAlert, values }) => {
        const response = await mutateAsync({
          ...values,
          interval: parseDurationToMinutes(values.interval),
        })

        if (response.body.status === 'success') {
          await queryClient.invalidateQueries({
            queryKey: queries.feeds._def,
          })
          setAlert({ danger: false, message: 'Successfully updated feed!' })
        } else if (response.body.status === 'fail') {
          Object.entries(response.body.data).forEach(([field, error]) => {
            form.setError(field as keyof FormValues, { message: error })
          })
          setAlert({ danger: true, message: 'Some field were invalid.' })
        } else {
          setAlert({ danger: true, message: getError(response.body.message) })
        }
      }}
    >
      {(Controlled) => (
        <Stack gap="md">
          <Controlled component={TextInput} name="url" label="Feed URL" />
          <Controlled
            component={DurationInput}
            name="interval"
            label="Refresh Interval"
            autoComplete="off"
          />
        </Stack>
      )}
    </CrispForm>
  )
}

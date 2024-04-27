import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, NativeSelect, Space } from '@mantine/core'
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import useSession from '@/features/authentication/hooks/useSession'
import { usersClient } from '@/features/users/api'
import { UserConfigFormValues, UserConfigSchema } from '@/features/users/forms'
import { queryClient } from '@/services/queryClient'
import { queries } from '@/services/queryKeys'

const FormSchema = UserConfigSchema
type FormValues = UserConfigFormValues
type Props = { currentScheme: FormValues['colorScheme'] }

export default function UserConfigForm({ currentScheme }: Props) {
  const { userId, authHeader } = useSession()
  const form = useForm<FormValues>({
    defaultValues: {
      colorScheme: currentScheme,
    },
    resolver: zodResolver(FormSchema),
  })

  const [alert, setAlert] = useState<{
    isDanger: boolean
    message: string
  } | null>(null)

  const { mutateAsync } = useMutation({
    mutationFn: async (values: FormValues) => {
      return await usersClient.updateUser.mutation({
        headers: {
          authorization: authHeader,
        },
        body: {
          user: { configs: values },
        },
        params: {
          id: userId!,
        },
      })
    },
  })

  const onSubmit = async (values: FormValues) => {
    const response = await mutateAsync(values)

    if (response.status === 200) {
      await queryClient.invalidateQueries({
        queryKey: queries.users.detail(userId!).queryKey,
      })
      setAlert({ isDanger: false, message: 'Success' })
      form.reset(values)
    } else if (response.status === 422) {
      Object.entries(response.body.data).forEach(([field, error]) => {
        form.setError(field as keyof FormValues, { message: error })
      })
      setAlert({ isDanger: true, message: 'Some fields were invalid' })
    } else {
      setAlert({ isDanger: true, message: 'An error occurred' })
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onChange={() => setAlert(null)}
    >
      <Controller
        control={form.control}
        name="colorScheme"
        render={({ field, fieldState: { error } }) => (
          <NativeSelect
            data={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'auto', label: 'Use browser settings' },
            ]}
            label="Color Scheme"
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

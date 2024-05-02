import { Stack, TextInput } from '@mantine/core'
import { Controller } from 'react-hook-form'
import { z } from 'zod'

import CrispForm from '@/components/CrispForm'
import SecretInput from '@/components/inputs/SecretInput'
import { authClient } from '@/features/authentication/api'

const RegistrationSchema = z.object({
  displayName: z.string().min(2),
  email: z.string().email(),
  password: z.string(),
  passwordConfirmation: z.string(),
})

type RegistrationValues = z.infer<typeof RegistrationSchema>

export default function RegistrationForm() {
  const { mutateAsync } = authClient.createUser.useMutation()

  return (
    <CrispForm<RegistrationValues>
      schema={RegistrationSchema}
      onSubmitFactory={({ setAlert }) =>
        async (values) => {
          const response = await mutateAsync({
            body: {
              user: {
                displayName: values.displayName,
                email: values.email,
                password: values.password,
                passwordConfirmation: values.passwordConfirmation,
              },
            },
          })

          if (response.status === 201) {
            setAlert({ danger: false, message: 'Successfully registered!' })
          } else {
            setAlert({ danger: true, message: 'Failed' })
          }
        }}
      buttonsVariant="subtle"
      buttonsRight
    >
      <Stack gap="md">
        <Controller
          name="displayName"
          render={({ field, fieldState: { error } }) => (
            <TextInput label="Display Name" error={error?.message} {...field} />
          )}
        />
        <Controller
          name="email"
          render={({ field, fieldState: { error } }) => (
            <TextInput
              label="Email Address"
              error={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          render={({ field, fieldState: { error } }) => (
            <SecretInput
              label="Password"
              error={error?.message}
              {...field}
              revealable
            />
          )}
        />
        <Controller
          name="passwordConfirmation"
          render={({ field, fieldState: { error } }) => (
            <SecretInput
              label="Confirm Password"
              error={error?.message}
              {...field}
              revealable
            />
          )}
        />
      </Stack>
    </CrispForm>
  )
}

import { Stack, TextInput } from '@mantine/core'
import { z } from 'zod'

import CrispForm from '@/components/CrispForm'
import { SecretInput } from '@/components/inputs/SecretInput'
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
      onSubmit={async ({ setAlert, values }) => {
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
      {(Controlled) => (
        <Stack gap="md">
          <Controlled
            component={TextInput}
            name="displayName"
            label="Display Name"
          />
          <Controlled
            component={TextInput}
            name="email"
            label="Email Address"
          />
          <Controlled
            component={SecretInput}
            name="password"
            label="Password"
          />
          <Controlled
            component={SecretInput}
            name="passwordConfirmation"
            label="Confirm Password"
          />
        </Stack>
      )}
    </CrispForm>
  )
}

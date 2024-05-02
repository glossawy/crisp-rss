import { Stack, TextInput } from '@mantine/core'
import { z } from 'zod'

import CrispForm from '@/components/CrispForm'
import { SecretInput } from '@/components/inputs/SecretInput'
import useAuth from '@/features/authentication/hooks/useAuth'

const SignInSchema = z.object({
  email: z.string().email({ message: 'Not a valid email address' }),
  password: z.string().min(1),
})

type SignInData = z.infer<typeof SignInSchema>

export default function SignInForm() {
  const { login } = useAuth()
  return (
    <CrispForm<SignInData>
      schema={SignInSchema}
      defaults={{ email: '', password: '' }}
      onSubmit={async ({ setAlert, values }) => {
        const signedIn = await login(values)

        setAlert(
          signedIn
            ? null
            : { danger: true, message: 'Email or password is incorrect' },
        )
      }}
      buttonsVariant="subtle"
      buttonsRight
    >
      {(Controlled) => (
        <Stack gap="lg">
          <Controlled
            component={TextInput}
            name="email"
            label="Email"
            placeholder="user@example.com"
          />

          <Controlled
            component={SecretInput}
            name="password"
            label="Password"
            revealable
          />
        </Stack>
      )}
    </CrispForm>
  )
}

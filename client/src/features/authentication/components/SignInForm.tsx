import { Space, TextInput } from '@mantine/core'
import { Controller } from 'react-hook-form'
import { z } from 'zod'

import CrispForm from '@/components/CrispForm'
import SecretInput from '@/components/inputs/SecretInput'
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
      onSubmitFactory={({ setAlert }) =>
        async (values) => {
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
      <Controller
        name="email"
        render={({ field, fieldState }) => (
          <TextInput
            label="Email"
            placeholder="user@example.com"
            type="email"
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />

      <Space h="lg" />

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
    </CrispForm>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  PasswordInput,
  Space,
  TextInput,
} from '@mantine/core'
import { useToggle } from '@mantine/hooks'
import {
  IconExclamationCircle,
  IconEye,
  IconEyeClosed,
} from '@tabler/icons-react'
import { useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import useAuth from '@/features/authentication/hooks/useAuth'

const SignInSchema = z.object({
  email: z.string().email({ message: 'Not a valid email address' }),
  password: z.string().min(1),
})

type SignInData = z.infer<typeof SignInSchema>

export default function SignInForm() {
  const { login } = useAuth()
  const [showPassword, toggleShowPassword] = useToggle([true, false])
  const [error, setError] = useState<string | null>(null)
  const { isLoading } = useRouterState()

  const form = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    disabled: isLoading,
  })
  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (formValues: SignInData) => {
    const signedIn = await login(formValues)

    setError(signedIn ? null : 'Email or password is incorrect')
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onChange={() => setError(null)}
    >
      <Controller
        control={form.control}
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
        control={form.control}
        name="password"
        render={({ field, fieldState: { error } }) => (
          <PasswordInput
            label="Password"
            error={error?.message}
            {...field}
            rightSection={
              <ActionIcon
                variant="subtle"
                color="gray"
                tabIndex={-1}
                onMouseDown={(evt) => {
                  evt.preventDefault()
                  toggleShowPassword()
                }}
              >
                {showPassword ? <IconEye /> : <IconEyeClosed />}
              </ActionIcon>
            }
          />
        )}
      />
      <Space h="md" />
      <Group justify="end">
        {error ? (
          <Alert
            variant="transparent"
            color="red"
            flex={1}
            p={0}
            title={error}
            icon={<IconExclamationCircle />}
          />
        ) : null}
        <Button
          variant="subtle"
          type="submit"
          loading={isLoading}
          disabled={isSubmitting || !isValid}
        >
          Submit
        </Button>
      </Group>
    </form>
  )
}

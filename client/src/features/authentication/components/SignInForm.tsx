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
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import useAuth from '@/features/authentication/hooks/useAuth'

const SignInSchema = z.object({
  email: z.string().email({ message: 'Not a valid email address' }),
  password: z.string(),
})

type SignInData = z.infer<typeof SignInSchema>

export default function SignInForm() {
  const { login } = useAuth()
  const [showPassword, toggleShowPassword] = useToggle([true, false])
  const { isLoading } = useRouterState()

  const form = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
    },
    disabled: isLoading,
  })

  const formError = form.formState.errors.root

  return (
    <form onSubmit={form.handleSubmit(login)} className="w-full space-y-6">
      {formError ? (
        <Alert
          variant="light"
          color="red"
          title="Error"
          icon={<IconExclamationCircle />}
        >
          {formError.message || 'An error occurred'}
        </Alert>
      ) : null}

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
        <Button variant="subtle" type="submit">
          Submit
        </Button>
      </Group>
    </form>
  )
}

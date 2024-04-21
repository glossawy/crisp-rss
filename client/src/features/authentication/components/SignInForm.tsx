import { zodResolver } from '@hookform/resolvers/zod'
import {
  ExclamationTriangleIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from '@radix-ui/react-icons'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { sessionsClient } from '@/features/authentication/api'
import useSession from '@/features/authentication/hooks/useSession'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const SignInSchema = z.object({
  email: z.string().email({ message: 'Not a valid email address' }),
  password: z.string(),
})

type SignInData = z.infer<typeof SignInSchema>

export default function SignInForm() {
  const { setSession } = useSession()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (credentials: SignInData) => {
    const response = await sessionsClient.createSession.mutation({
      body: { user: { ...credentials } },
    })

    if (response.status === 201) {
      setSession(response.body)
    } else {
      form.setError('root', { message: 'Email or password was incorrect' })
    }
  }

  const formError = form.formState.errors.root

  return (
    <Form {...form}>
      {formError ? (
        <Alert variant="destructive">
          <ExclamationTriangleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {formError.message || 'An error occurred'}
          </AlertDescription>
        </Alert>
      ) : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>{' '}
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row">
                <span className="place-content-center">Password</span>
                <Button
                  type="button"
                  variant="icon"
                  size="icon"
                  className="ml-2 h-5 w-5"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </Button>
              </FormLabel>
              <FormControl>
                <Input type={showPassword ? 'text' : 'password'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

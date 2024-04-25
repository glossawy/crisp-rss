import { Group } from '@mantine/core'
import {
  Navigate,
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'

import SignInCard from '@/features/authentication/components/SignInCard'
import useSession from '@/features/authentication/hooks/useSession'
import { isAuthenticated } from '@/features/authentication/lib/auth'
import { router } from '@/router'

export const Route = createFileRoute('/')({
  validateSearch(search: Record<string, unknown>): { redirect?: string } {
    return {
      redirect: search.redirect as string | undefined,
    }
  },
  beforeLoad({ search }) {
    if (isAuthenticated()) {
      if (search.redirect) router.history.push(search.redirect)
      else throw redirect({ to: '/home' })
    }
  },
  component() {
    const { sessionId } = useSession()
    const router = useRouter()
    const {
      location: { search },
    } = useRouterState()

    if (sessionId && search.redirect) {
      router.history.push(search.redirect)
    } else if (sessionId) {
      return <Navigate to="/home" startTransition />
    }

    return (
      <Group style={{ height: '100%', justifyContent: 'center' }}>
        <SignInCard />
      </Group>
    )
  },
})

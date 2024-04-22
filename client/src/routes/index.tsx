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
    const { session } = useSession()
    const router = useRouter()
    const {
      location: { search },
    } = useRouterState()

    if (session && search.redirect) {
      router.history.push(search.redirect)
    } else if (session) {
      return <Navigate to="/home" startTransition />
    }

    return (
      <main className="w-screen h-screen bg-slate-100 flex flex-col items-center place-content-center">
        <SignInCard />
      </main>
    )
  },
})

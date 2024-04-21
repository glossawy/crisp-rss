import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import SignInCard from '@/features/authentication/components/SignInCard'
import useSession from '@/features/authentication/hooks/useSession'

export const Route = createLazyFileRoute('/')({
  component() {
    const { session } = useSession()
    const navigate = useNavigate({ from: '/' })

    if (session) navigate({ to: '/home' })

    return (
      <main className="w-screen h-screen bg-slate-100 flex flex-col items-center place-content-center">
        <SignInCard />
      </main>
    )
  },
})

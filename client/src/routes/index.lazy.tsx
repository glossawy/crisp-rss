import { createLazyFileRoute } from '@tanstack/react-router'

import SignInCard from '@/features/authentication/components/SignInCard'

export const Route = createLazyFileRoute('/')({
  component() {
    return (
      <main className="w-screen h-screen bg-slate-100 flex flex-col items-center place-content-center">
        <SignInCard />
      </main>
    )
  },
})

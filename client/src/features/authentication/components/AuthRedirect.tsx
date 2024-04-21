import { Navigate, useRouterState } from '@tanstack/react-router'

import useSession from '@/features/authentication/hooks/useSession'

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSession()
  const { location } = useRouterState()

  if (session == null)
    return <Navigate to="/" search={{ redirect: location.href }} />
  else return <>{children}</>
}

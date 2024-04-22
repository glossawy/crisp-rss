import { Navigate } from '@tanstack/react-router'

import useSession from '@/features/authentication/hooks/useSession'

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSession()

  if (session == null) return <Navigate to="/" />
  else return <>{children}</>
}

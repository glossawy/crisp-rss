import { Navigate } from '@tanstack/react-router'

import useSession from '@/features/authentication/hooks/useSession'

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode
}) {
  const { sessionId } = useSession()

  console.debug(sessionId)
  if (sessionId == null) return <Navigate to="/" />
  else return <>{children}</>
}

import { Outlet, createFileRoute } from '@tanstack/react-router'

import AuthRedirect from '@/features/authentication/components/AuthRedirect'
import { redirectWhenUnauthenticated } from '@/features/authentication/lib/utils'

export const Route = createFileRoute('/home/_layout')({
  beforeLoad({ location }) {
    redirectWhenUnauthenticated(location)
  },
  component: () => (
    <AuthRedirect>
      <Outlet />
    </AuthRedirect>
  ),
})

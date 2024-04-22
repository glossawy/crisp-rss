import { RouterState, redirect } from '@tanstack/react-router'

import { isAuthenticated } from '@/features/authentication/lib/auth'

export function redirectWhenUnauthenticated(location: RouterState['location']) {
  if (!isAuthenticated())
    throw redirect({ to: '/', search: { redirect: location.href } })
}

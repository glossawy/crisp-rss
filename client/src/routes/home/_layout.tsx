import { Outlet, createFileRoute } from '@tanstack/react-router'

import AuthRedirect from '@/features/authentication/components/AuthRedirect'

export const Route = createFileRoute('/home/_layout')({
  component: () => (
    <AuthRedirect>
      <Outlet />
    </AuthRedirect>
  ),
})

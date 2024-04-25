import { Outlet, createRootRoute } from '@tanstack/react-router'
import React, { Suspense } from 'react'

import SessionHeartbeat from '@/features/authentication/components/SessionHeartbeat'

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )

export const Route = createRootRoute({
  component() {
    return (
      <>
        <Outlet />
        <Suspense>
          <TanStackRouterDevtools />
        </Suspense>
        <SessionHeartbeat />
      </>
    )
  },
})

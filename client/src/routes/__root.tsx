import { Outlet, createRootRoute } from '@tanstack/react-router'
import React, { Suspense } from 'react'

import useAppTitle from '@/hooks/useAppTitle'

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )

export const Route = createRootRoute({
  component() {
    useAppTitle()

    return (
      <>
        <Outlet />
        <Suspense>
          <TanStackRouterDevtools />
        </Suspense>
      </>
    )
  },
})

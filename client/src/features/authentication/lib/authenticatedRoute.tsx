import {
  FileRoutesByPath,
  LazyRouteOptions,
  createFileRoute,
  createLazyFileRoute,
  redirect,
} from '@tanstack/react-router'

import AuthRedirect from '@/features/authentication/components/AuthRedirect'
import { isAuthenticated } from '@/features/authentication/lib/auth'

type FileBasedOpts = Parameters<ReturnType<typeof createFileRoute>>[0]

export function createAuthenticatedFileRoute(route: keyof FileRoutesByPath) {
  return (opts: FileBasedOpts) => {
    const newOpts: FileBasedOpts = {
      ...opts,
      beforeLoad(ctx) {
        if (!isAuthenticated()) {
          throw redirect({ to: '/', search: { redirect: ctx.location.href } })
        }

        if (opts?.beforeLoad) opts.beforeLoad(ctx)
      },
      component(props) {
        return (
          <AuthRedirect>
            {opts?.component ? <opts.component {...props} /> : null}
          </AuthRedirect>
        )
      },
    }

    return createFileRoute(route)(newOpts)
  }
}

export function createAuthenticatedLazyFileRoute(
  route: keyof FileRoutesByPath,
) {
  return (opts: LazyRouteOptions) => {
    const newOpts: LazyRouteOptions = {
      ...opts,
      component(props) {
        return (
          <AuthRedirect>
            {opts.component ? <opts.component {...props} /> : null}
          </AuthRedirect>
        )
      },
    }

    return createLazyFileRoute(route)(newOpts)
  }
}

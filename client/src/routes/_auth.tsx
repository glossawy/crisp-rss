import { AppShell } from '@mantine/core'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import AuthRedirect from '@/features/authentication/components/AuthRedirect'
import { redirectWhenUnauthenticated } from '@/features/authentication/lib/utils'

export const Route = createFileRoute('/_auth')({
  beforeLoad({ location }) {
    redirectWhenUnauthenticated(location)
  },
  component: () => {
    return (
      <AuthRedirect>
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: 'sm' }}
        >
          <Header />
          <Sidebar />
          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
        </AppShell>
      </AuthRedirect>
    )
  },
})

import { AppShell, useMantineColorScheme } from '@mantine/core'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import AuthRedirect from '@/features/authentication/components/AuthRedirect'
import SessionHeartbeat from '@/features/authentication/components/SessionHeartbeat'
import { redirectWhenUnauthenticated } from '@/features/authentication/lib/utils'
import useUserPreferences from '@/features/users/hooks/useUserPreferences'

export const Route = createFileRoute('/_auth')({
  beforeLoad({ location }) {
    redirectWhenUnauthenticated(location)
  },
  component: () => {
    const { colorScheme, setColorScheme } = useMantineColorScheme()
    const configs = useUserPreferences()

    if (configs.color_scheme !== colorScheme)
      setColorScheme(configs.color_scheme)

    return (
      <>
        <AuthRedirect>
          <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm' }}
          >
            <Header />
            <Sidebar />
            <AppShell.Main display="flex" style={{ flexDirection: 'column' }}>
              <Outlet />
            </AppShell.Main>
          </AppShell>
        </AuthRedirect>
        <SessionHeartbeat />
      </>
    )
  },
})

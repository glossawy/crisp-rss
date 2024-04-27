import {
  Affix,
  Button,
  Group,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import {
  Navigate,
  createFileRoute,
  redirect,
  useRouter,
  useSearch,
} from '@tanstack/react-router'

import SignInCard from '@/features/authentication/components/SignInCard'
import useSession from '@/features/authentication/hooks/useSession'
import { isAuthenticated } from '@/features/authentication/lib/auth'
import { router } from '@/router'
import { queryClient } from '@/services/queryClient'

export const Route = createFileRoute('/')({
  validateSearch(search: Record<string, unknown>): { redirect?: string } {
    return {
      redirect: search.redirect as string | undefined,
    }
  },
  beforeLoad({ search }) {
    if (isAuthenticated()) {
      if (search.redirect) router.history.push(search.redirect)
      else throw redirect({ to: '/home' })
    }
  },
  onEnter() {
    queryClient.clear()
  },
  component() {
    const { sessionId } = useSession()
    const router = useRouter()
    const search = useSearch({ from: '/' })

    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const computedScheme = useComputedColorScheme()

    const currentScheme = colorScheme === 'auto' ? computedScheme : colorScheme

    if (sessionId && search.redirect) {
      router.history.push(search.redirect)
    } else if (sessionId) {
      return <Navigate to="/home" startTransition />
    }

    return (
      <>
        <Affix position={{ top: 32, right: 32 }}>
          <Button
            c="gray"
            variant="subtle"
            size="xl"
            onClick={() => toggleColorScheme()}
            rightSection={currentScheme === 'dark' ? <IconSun /> : <IconMoon />}
          >
            {currentScheme === 'light'
              ? 'Change to Dark Mode'
              : 'Change to Light Mode'}
          </Button>
        </Affix>
        <Group style={{ height: '100%', justifyContent: 'center' }}>
          <SignInCard />
        </Group>
      </>
    )
  },
})

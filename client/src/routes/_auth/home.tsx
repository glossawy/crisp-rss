import { Stack } from '@mantine/core'
import {
  CatchBoundary,
  CatchNotFound,
  Outlet,
  createFileRoute,
} from '@tanstack/react-router'

import MainContentMessage from '@/components/MainContentMessage'
import useSession from '@/features/authentication/hooks/useSession'

export const Route = createFileRoute('/_auth/home')({
  component: () => {
    const sessionData = useSession()
    const userId = sessionData.userId!

    return (
      <CatchBoundary
        getResetKey={() => userId}
        errorComponent={() => (
          <MainContentMessage message="Error occurred while loading feed" />
        )}
      >
        <CatchNotFound
          fallback={(_error) => (
            <MainContentMessage message="Failed to find feed" />
          )}
        >
          <Stack py="md" px="md">
            <Outlet />
          </Stack>
        </CatchNotFound>
      </CatchBoundary>
    )
  },
})

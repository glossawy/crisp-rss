import { Stack } from '@mantine/core'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/feeds')({
  component: () => (
    <Stack gap={0} flex={1}>
      <Outlet />
    </Stack>
  ),
})

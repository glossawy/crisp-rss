import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { RouterProvider } from '@tanstack/react-router'

import { modals } from '@/modals'
import { router } from '@/router'

export default function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <ModalsProvider modals={modals}>
        <RouterProvider router={router} />
        <Notifications />
      </ModalsProvider>
    </MantineProvider>
  )
}

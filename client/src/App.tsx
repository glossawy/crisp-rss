import { MantineProvider } from '@mantine/core'
import { RouterProvider } from '@tanstack/react-router'

import { router } from '@/router'

export default function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <RouterProvider router={router} />
    </MantineProvider>
  )
}

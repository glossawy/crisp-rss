import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/home/_layout/')({
  component: () => {
    return <div>Hello /home!</div>
  },
})

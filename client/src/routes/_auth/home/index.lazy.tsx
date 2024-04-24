import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/home/')({
  component: () => {
    return <div>test</div>
  },
})

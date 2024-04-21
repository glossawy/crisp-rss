import { createAuthenticatedLazyFileRoute } from '@/features/authentication/lib/authenticatedRoute'

export const Route = createAuthenticatedLazyFileRoute('/home/')({
  component: () => {
    return <div>Hello /home!</div>
  },
})

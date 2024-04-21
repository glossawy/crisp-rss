import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import useSession from '@/features/authentication/hooks/useSession'

export const Route = createLazyFileRoute('/home')({
  component: () => {
    const { session } = useSession()
    const navigate = useNavigate()

    if (session == null) navigate({ to: '/' })

    return <div>Hello /home!</div>
  },
})

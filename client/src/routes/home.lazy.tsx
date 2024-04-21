import useSession from '@/features/authentication/hooks/useSession'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/home')({
  component: () => {
    const { session } = useSession()
    const navigate = useNavigate()

    if (session == null) navigate({ to: '/' })

    return <div>Hello /home!</div>
  },
})

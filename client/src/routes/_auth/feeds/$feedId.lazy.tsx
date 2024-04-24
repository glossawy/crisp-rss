import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/feeds/$feedId')({
  component: () => <div>Hello /_auth/feeds/$feedId!</div>,
})

function FeedPage() {
  const { feedId } = Route.useParams()
}

import RoutableNavLink from '@/components/RoutableNavLink'
import useFeeds from '@/features/feeds/hooks/useFeeds'

type Props = { userId: string; selectedId?: number }

export default function FeedSidebarList({ userId, selectedId }: Props) {
  const { feeds, isFetching } = useFeeds(userId)

  if (isFetching) return <div>Loading...</div>

  return (
    <>
      {feeds &&
        feeds.map((feed) => (
          <RoutableNavLink
            key={feed.id}
            to="/feeds/$feedId"
            params={{ feedId: feed.id.toString() }}
            navLink={{
              active: feed.id === selectedId,
              label: feed.title,
              variant: 'light',
            }}
          />
        ))}
    </>
  )
}

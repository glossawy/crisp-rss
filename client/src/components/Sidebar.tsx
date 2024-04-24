import { Link } from '@tanstack/react-router'

import { Title } from '@/components/ui/typography'
import useSession from '@/features/authentication/hooks/useSession'
import FeedSidebarList from '@/features/feeds/components/FeedSidebarList'

export default function Sidebar() {
  const { userId } = useSession()

  return (
    <div className="min-w-full">
      <div className="pt-1 px-1">
        <Link to="/home">
          <Title level={2}>CrispRSS</Title>
        </Link>
        <Title level={6}>Your Feeds</Title>
      </div>
      {userId && <FeedSidebarList userId={userId} />}
    </div>
  )
}

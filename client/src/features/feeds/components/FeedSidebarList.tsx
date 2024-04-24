import { Link } from '@tanstack/react-router'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import useFeeds from '@/features/feeds/hooks/useFeeds'
import { navigationMenuTriggerStyle } from '@/lib/navigationMenuUtils'
import { cn } from '@/lib/utils'

type Props = { userId: string; selectedId?: number }

export default function FeedSidebarList({ userId, selectedId }: Props) {
  const { feeds, isFetching } = useFeeds(userId)

  if (isFetching) return <div>Loading...</div>

  return (
    <NavigationMenu
      orientation="vertical"
      className="min-w-full [&>div]:min-w-full"
    >
      <NavigationMenuList className="flex-col items-start gap-0">
        {feeds &&
          feeds.map((feed) => (
            <NavigationMenuItem className="min-w-full !ml-0">
              <NavigationMenuLink
                active={feed.id === selectedId}
                className={cn(
                  navigationMenuTriggerStyle(),
                  'min-w-full justify-start rounded-none border-1 box-border',
                )}
                asChild
              >
                <Link
                  to="/feeds/$feedId"
                  params={{ feedId: feed.id.toString() }}
                >
                  {feed.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
      </NavigationMenuList>
    </NavigationMenu>
  )

  // return (
  //   <nav>
  //     <ul>{feeds && feeds.map((feed) => <li>{feed.title}</li>)}</ul>
  //   </nav>
  // )
}

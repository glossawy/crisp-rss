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

type Props = { userId: string }

export default function FeedSidebarList({ userId }: Props) {
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
                className={cn(
                  navigationMenuTriggerStyle(),
                  'min-w-full justify-start rounded-none border-1 box-border',
                )}
                asChild
              >
                <Link>{feed.title}</Link>
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

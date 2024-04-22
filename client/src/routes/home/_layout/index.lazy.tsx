import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { useCallback } from 'react'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu-styles'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import useSession from '@/features/authentication/hooks/useSession'
import { logout } from '@/features/authentication/lib/auth'
import { cn } from '@/lib/utils'

export const Route = createLazyFileRoute('/home/_layout/')({
  component: () => {
    const { clearSession } = useSession()

    const onLogout = useCallback(async () => {
      if (await logout()) {
        clearSession()
      }
    }, [clearSession])

    return (
      <div className="h-full flex flex-col">
        <NavigationMenu className="min-w-full justify-start border-b-2">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/home">
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle())}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={onLogout}
                className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}
              >
                Logout
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ResizablePanelGroup className="flex-grow" direction="horizontal">
          <ResizablePanel defaultSize={10} maxSize={25} minSize={5}>
            Wow!
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={90}>Test</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    )
  },
})

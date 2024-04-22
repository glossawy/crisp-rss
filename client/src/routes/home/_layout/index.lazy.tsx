import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { useCallback } from 'react'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu-styles'
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
      <>
        <NavigationMenu className="min-w-full justify-start">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/home">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
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
        <main>Test</main>
      </>
    )
  },
})

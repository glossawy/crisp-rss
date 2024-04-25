import { AppShell, Group, Menu, Title, rem } from '@mantine/core'
import { IconDoorExit, IconRss } from '@tabler/icons-react'

import AnchorLink from '@/components/AnchorLink'
import useAuth from '@/features/authentication/hooks/useAuth'
import useSession from '@/features/authentication/hooks/useSession'
import { UserButton } from '@/features/users/components/UserButton'

import classes from './Header.module.css'

export default function Header() {
  const { userId } = useSession()
  const { logout } = useAuth()

  return (
    <AppShell.Header>
      <Group align="center" className={classes.root}>
        <AnchorLink
          to="/home"
          anchor={{ underline: 'never', className: classes.home }}
        >
          <Title px="md">
            CrispRSS <IconRss />
          </Title>
        </AnchorLink>

        <Group className={classes.rightside} justify="end">
          <Menu
            classNames={{ dropdown: classes.userMenu }}
            position="bottom"
            offset={5}
          >
            <Menu.Target>
              <UserButton userId={userId!} className={classes.userButton} />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={logout}
                leftSection={
                  <IconDoorExit style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Log out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  )
}

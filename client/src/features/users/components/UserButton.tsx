import {
  Avatar,
  Group,
  Stack,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core'
import clsx from 'clsx'
import { forwardRef } from 'react'

import useUser from '@/features/users/hooks/useUser'

import classes from './UserButton.module.css'

type Props = React.PropsWithChildren<
  { userId: string } & UnstyledButtonProps &
    React.ComponentPropsWithoutRef<'button'>
>

export const UserButton = forwardRef<HTMLButtonElement, Props>(
  ({ userId, className, children, ...btnProps }: Props, ref) => {
    const { user, isFetching } = useUser(userId)

    const display = isFetching
      ? { avi: null, name: 'Loading...', email: 'Loading...' }
      : user == null
        ? { avi: null, name: 'Failed to load user', email: '' }
        : {
            avi: user.display_name[0].toUpperCase(),
            name: user.display_name,
            email: user.email,
          }

    return (
      <UnstyledButton
        className={clsx(classes.user, className)}
        {...btnProps}
        ref={ref}
      >
        <Group>
          <Avatar>{display.avi}</Avatar>

          <Stack flex={1} gap={0}>
            <Text size="sm" fw={500}>
              {display.name}
            </Text>
            <Text size="xs" c="dimmed">
              {display.email}
            </Text>
          </Stack>
        </Group>
      </UnstyledButton>
    )
  },
)

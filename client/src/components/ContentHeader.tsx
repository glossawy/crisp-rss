import { Group, Stack } from '@mantine/core'

type Props = {
  leftSection?: React.ReactNode
  rightSection?: React.ReactNode
  children?: React.ReactNode
}

export const ContentHeader = ({
  leftSection,
  rightSection,
  children,
}: Props) => {
  return (
    <Stack gap={0}>
      <Group align="center" gap={0}>
        {leftSection ? leftSection : null}
        {rightSection ? (
          <Group style={{ marginLeft: 'auto' }}>{rightSection}</Group>
        ) : null}
      </Group>
      {children}
    </Stack>
  )
}

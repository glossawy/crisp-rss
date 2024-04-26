import { Center, Stack, Title } from '@mantine/core'

type Props = { message: string }

export default function MainContentMessage({ message }: Props) {
  return (
    <Stack flex={1} justify="center">
      <Center>
        <Title>{message}</Title>
      </Center>
    </Stack>
  )
}

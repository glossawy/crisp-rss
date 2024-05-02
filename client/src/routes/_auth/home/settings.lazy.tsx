import { Button, Group, Paper, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { createLazyFileRoute, useRouter } from '@tanstack/react-router'

import { ContentHeader } from '@/components/ContentHeader'
import MainContentMessage from '@/components/MainContentMessage'
import UserConfigForm from '@/features/users/components/UserConfigForm'
import useUserPreferences from '@/features/users/hooks/useUserPreferences'

export const Route = createLazyFileRoute('/_auth/home/settings')({
  component: () => {
    const router = useRouter()
    const { config, loaded } = useUserPreferences()

    if (!loaded) return <MainContentMessage message="Loading..." />

    return (
      <>
        <ContentHeader
          leftSection={<Title>Settings</Title>}
          rightSection={
            <Button
              variant="outline"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.history.back()}
            >
              Go Back
            </Button>
          }
        />
        <Group justify="center">
          <Paper
            miw="var(--mantine-breakpoint-xs)"
            withBorder
            p="sm"
            radius="xs"
          >
            <UserConfigForm currentScheme={config.color_scheme} />
          </Paper>
        </Group>
      </>
    )
  },
})

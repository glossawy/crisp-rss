import CreateFeedContextModal from '@/features/feeds/modals/CreateFeedContextModal'

const modals = {
  createFeed: CreateFeedContextModal,
} as const

declare module '@mantine/modals' {
  export interface MantineModalsOverride {
    modals: typeof modals
  }
}

export { modals }

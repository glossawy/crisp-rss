import { createQueryKeyStore } from '@lukemorales/query-key-factory'

export const queries = createQueryKeyStore({
  users: {
    detail: (userId: string) => ({ queryKey: [userId] }),
  },
  feeds: {
    all: (userId: string) => ({ queryKey: [userId] }),
    detail: (userId: string, feedId: number) => ({
      queryKey: [userId, feedId],
    }),
    timeline: (userId: string) => ({ queryKey: [userId] }),
  },
})

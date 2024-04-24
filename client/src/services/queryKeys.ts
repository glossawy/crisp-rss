export const QueryKeys = {
  user: (id: string) => ['user', id],
  feeds: {
    fetchAll: (userId: string) => ['user', userId, 'feeds'],
  },
} as const

export const QueryKeys = {
  user: (id: string) => ['user', id],
  feeds: {
    fetchAll: (userId: string) => ['user', userId, 'feeds'],
    fetchOne: (userId: string, feedId: number) => [
      'user',
      userId,
      'feeds',
      feedId,
    ],
  },
} as const

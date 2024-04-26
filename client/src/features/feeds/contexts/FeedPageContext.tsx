import { createContext } from 'react'

import { FeedDetail } from '@/features/feeds/types'

export const FeedPageContext = createContext<{
  feed: FeedDetail | null
}>({
  feed: null,
})

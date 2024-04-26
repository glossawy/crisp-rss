import { notFound } from '@tanstack/react-router'

import MainContentMessage from '@/components/MainContentMessage'
import { FeedPageContext } from '@/features/feeds/contexts/FeedPageContext'
import useFeed from '@/features/feeds/hooks/useFeed'

type Props = React.PropsWithChildren<{ userId: string; feedId: number }>

export default function FeedPageContextProvider({
  userId,
  feedId,
  children,
}: Props) {
  const { feed, error, isLoading } = useFeed(userId!, feedId)

  if (error) {
    if (error.status === 404) throw notFound()
    else if (error.status === 400) throw new Error(error.body.message)
    else throw new Error(`Feed fetch failed with status code ${error.status}`)
  }

  if (feed == null || isLoading)
    return <MainContentMessage message="Loading..." />

  return (
    <FeedPageContext.Provider value={{ feed }}>
      {children}
    </FeedPageContext.Provider>
  )
}

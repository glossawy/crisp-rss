import { FeedEntry, FeedInfo } from '@/features/feeds/types'

export type TimelineEntry = FeedEntry & {
  feed: FeedInfo
}

export type Timeline = TimelineEntry[]

export type TimelineFetchAllPayload = {
  timeline: Timeline
}

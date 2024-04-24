export type FeedError = 'unsupported' | 'unreachable'

export type FeedInfo = {
  error: FeedError | null
  source_url: string
  site_url: string
  title: string
  description: string | null
  entry_count: number

  last_fetched_at: string
  last_updated_at: string
}

export type FetchFeedsResponse = { feeds: FeedInfo[] }

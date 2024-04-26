export type FeedError = 'unsupported' | 'unreachable'

export type FeedInfo = {
  id: number
  error: FeedError | null
  source_url: string
  site_url: string
  title: string
  description: string | null
  entry_count: number

  ttl: number

  next_fetch_at: string
  last_fetched_at: string
  last_updated_at: string
}

export type FeedEntry = {
  guid: string
  authors: string[]
  url: string
  title: string | null
  summary: string | null
  content: string | null

  published_at: string | null
}

export type FeedDetail = FeedInfo & { entries: FeedEntry[] }

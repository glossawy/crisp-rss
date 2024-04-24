
json.feeds(feeds) do |feed|
  json.error feed.error
  json.source_url feed.source_url
  json.site_url feed.site_url
  json.title feed.title
  json.description feed.description
  json.entry_count feed.entry_count

  json.last_fetched_at feed.last_fetched_at.iso8601
  json.last_updated_at feed.last_updated_at.iso8601
end

# frozen_string_literal: true

json.partial!('users/feeds/feed_info', feed:)

json.entries(feed.entries) do |entry|
  json.guid entry.guid
  json.authors entry.authors
  json.url entry.url
  json.summary entry.summary
  json.content entry.content
end

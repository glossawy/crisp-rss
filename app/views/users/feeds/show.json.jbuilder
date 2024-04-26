# frozen_string_literal: true

json.jsend_success do
  json.feed do
    json.partial!('users/feeds/feed_info', feed:)

    json.entries(feed.entries) do |entry|
      json.guid entry.guid
      json.authors entry.authors
      json.url entry.url
      json.title entry.title
      json.summary entry.summary
      json.content entry.content

      json.published_at entry.published_at&.iso8601
    end
  end
end

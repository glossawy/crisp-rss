# frozen_string_literal: true

json.jsend_success do
  json.feed do
    json.partial!('users/feeds/feed_info', feed:)

    json.entries(feed.entries) do |entry|
      json.partial!('users/feeds/feed_entry', entry:)
    end
  end
end

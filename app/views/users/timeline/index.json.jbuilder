
json.jsend_success do
  json.timeline(entries) do |entry|
    json.feed do
      json.partial!('users/feeds/feed_info', feed: entry.feed)
    end

    json.partial!('users/feeds/feed_entry', entry:)
  end
end

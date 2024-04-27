
json.jsend_success do
  json.feed do
    json.partial!('users/feeds/feed_info', feed:)
  end
end

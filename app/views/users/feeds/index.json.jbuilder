# frozen_string_literal: true

json.jsend_success do
  json.feeds(feeds) do |feed|
    json.partial! 'users/feeds/feed_info', feed:
  end
end

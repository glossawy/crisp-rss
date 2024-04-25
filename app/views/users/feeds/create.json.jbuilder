# frozen_string_literal: true

json.status :success
json.data do
  json.partial!('users/feeds/feed_info', feed:)
end

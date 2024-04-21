# frozen_string_literal: true

FactoryBot.define do
  factory :feed_fetch_attempt do
    feed
    perform_at { feed.interval.hours.from_now }
  end
end

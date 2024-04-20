FactoryBot.define do
  factory :feed_fetch_attempt do
    association :feed
    perform_at { feed.interval.hours.from_now }
  end
end

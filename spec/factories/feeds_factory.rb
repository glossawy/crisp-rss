FactoryBot.define do
  factory :feed do
    association :user
    url { "https://example.feed/.rss" }
    interval { 4 }
  end
end

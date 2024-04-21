# frozen_string_literal: true

FactoryBot.define do
  factory :feed do
    user
    url { 'https://example.feed/.rss' }
    interval { 4 }
  end
end

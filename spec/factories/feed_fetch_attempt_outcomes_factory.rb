# frozen_string_literal: true

FactoryBot.define do
  factory :feed_fetch_attempt_outcome do
    feed_fetch_attempt
    state { FeedFetchAttemptOutcome::PENDING }

    trait :success do
      state { FeedFetchAttemptOutcome::SUCCESS }
    end

    trait :failure do
      state { FeedFetchAttemptOutcome::FAILURE }
    end
  end
end

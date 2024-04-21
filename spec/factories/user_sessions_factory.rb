# frozen_string_literal: true

FactoryBot.define do
  factory :user_session do
    user
    session_token { Sessions::Token.generate_token_value }
    expires_at { 1.day.from_now }

    trait :expired do
      expires_at { 1.hour.ago }
    end
  end
end

FactoryBot.define do
  factory :user_session do
    association :user
    session_token { Sessions::Token.generate_token_value }
    expires_at { 1.day.from_now }

    trait :expired do
      expires_at { 1.hour.ago }
    end

    trait :archived do
      expired

      after(:create) do |session|
        session.destroy!
      end
    end
  end
end

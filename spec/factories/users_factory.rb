# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:display_name) { |i| "user#{i}" }
    sequence(:email) { |i| "user#{i}@example.com" }
    password { 'v@lidpassword' }
  end
end

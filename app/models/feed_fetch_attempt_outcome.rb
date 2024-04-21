# frozen_string_literal: true

# == Schema Information
#
# Table name: feed_fetch_attempt_outcomes
#
#  id                    :integer          not null, primary key
#  reason                :string
#  state                 :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  feed_fetch_attempt_id :integer          not null
#
# Indexes
#
#  index_feed_fetch_attempt_outcomes_on_feed_fetch_attempt_id  (feed_fetch_attempt_id)
#
# Foreign Keys
#
#  feed_fetch_attempt_id  (feed_fetch_attempt_id => feed_fetch_attempts.id)
#
class FeedFetchAttemptOutcome < ApplicationRecord
  VALID_STATES = [
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILURE = 'failure',
  ].freeze

  belongs_to :feed_fetch_attempt

  validates :state, inclusion: { in: VALID_STATES }

  def pending? = state == PENDING
  def success? = state == SUCCESS
  def failure? = state == FAILURE
end

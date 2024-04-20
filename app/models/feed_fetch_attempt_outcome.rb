# == Schema Information
#
# Table name: feed_fetch_attempt_outcomes
#
#  id                    :integer          not null, primary key
#  is_success            :boolean
#  reason                :string
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
  belongs_to :feed_fetch_attempt

  def pending?
    is_success.nil?
  end

  def success?
    !pending? && is_success
  end

  def failure?
    !pending? && !is_success
  end
end

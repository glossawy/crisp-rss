# == Schema Information
#
# Table name: feed_fetch_attempts
#
#  id         :integer          not null, primary key
#  perform_at :datetime         not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  feed_id    :integer          not null
#
# Indexes
#
#  index_feed_fetch_attempts_on_feed_id  (feed_id)
#
# Foreign Keys
#
#  feed_id  (feed_id => feeds.id)
#
class FeedFetchAttempt < ApplicationRecord
  belongs_to :feed

  has_many :outcomes, class_name: "FeedFetchAttemptOutcome", dependent: :destroy

  validates :perform_at, presence: true, comparison: {
    greater_than_or_equal_to: -> { Time.current },
    message: "must be in the future"
  }
end

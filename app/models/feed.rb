# frozen_string_literal: true

# == Schema Information
#
# Table name: feeds
#
#  id              :bigint           not null, primary key
#  content         :binary
#  error_message   :string
#  interval        :integer          not null
#  last_fetched_at :datetime
#  url             :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :uuid             not null
#
# Indexes
#
#  index_feeds_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Feed < ApplicationRecord
  belongs_to :user

  scope :needs_refresh, lambda {
    where(%{last_fetched_at + (interval || ' minutes')::interval <= NOW()}).or(
      where(last_fetched_at: nil),
    )
  }

  validates :url, presence: true, url: { no_local: true }

  # Interval in minutes
  validates :interval, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 30 }

  def next_fetch_at
    (last_fetched_at || Time.current) + interval.minutes
  end

  def due_for_refresh?
    last_fetched_at.nil? || next_fetch_at <= Time.current
  end
end

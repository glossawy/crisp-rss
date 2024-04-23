# frozen_string_literal: true

# == Schema Information
#
# Table name: feeds
#
#  id         :bigint           not null, primary key
#  interval   :integer          not null
#  url        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid             not null
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

  has_many :attempts, class_name: 'FeedFetchAttempt', dependent: :destroy

  validates :url, presence: true, url: { no_local: true }
  validates :interval, presence: true, numericality: { only_integer: true, greater_than: 0 }
end

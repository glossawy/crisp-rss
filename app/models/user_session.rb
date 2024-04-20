# == Schema Information
#
# Table name: user_sessions
#
#  id            :integer          not null, primary key
#  deleted_at    :datetime
#  expires_at    :datetime         not null
#  session_token :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :integer          not null
#
# Indexes
#
#  index_user_sessions_on_session_token  (session_token) UNIQUE
#  index_user_sessions_on_user_id        (user_id)
#
# Foreign Keys
#
#  user_id  (user_id => users.id)
#
class UserSession < ApplicationRecord
  acts_as_paranoid

  belongs_to :user

  scope :active, -> { where("expires_at > ?", Time.current) }

  validates :expires_at, presence: true

  validates :session_token, presence: true, uniqueness: true, format: {
    with: /\A[a-z0-9]+\z/,
    message: "must be a lowercase alphanumeric string"
  }, length: {is: Sessions::Token.token_length}

  before_destroy :expire!

  def expire!
    # Do not change expiration times for already expired
    # sessions
    return if expires_at <= Time.current

    update!(expires_at: Time.current)
  end

  def active?
    expires_at > Time.current
  end
end

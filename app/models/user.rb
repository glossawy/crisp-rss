# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id            :uuid             not null, primary key
#  deleted_at    :datetime
#  display_name  :string           not null
#  email         :string           not null
#  password_hash :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_users_on_display_name   (display_name) UNIQUE
#  index_users_on_email          (email) UNIQUE
#  index_users_on_password_hash  (password_hash)
#
class User < ApplicationRecord
  include SecuredWithArgon2

  acts_as_paranoid
  secured_with_argon2!

  validates :email, presence: true, email_format: true
  validates :display_name, presence: true, length: {
    minimum: 2,
    maximum: 255,
    message: 'must be at between 2 and 255 characters long',
  }, format: {
    with: /\A\S+\z/i,
    message: 'cannot contain any whitespace',
  }
  validates :password, length: { minimum: 8 }

  has_many :feeds, dependent: nil
  has_many :sessions, class_name: 'UserSession', dependent: :destroy

  def self.fetch_by_token(session_token)
    session = UserSession.active.find_by(session_token:)
    return unless session

    session.user
  end
end

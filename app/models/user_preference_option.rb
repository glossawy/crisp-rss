# frozen_string_literal: true

# == Schema Information
#
# Table name: user_preference_options
#
#  id            :bigint           not null, primary key
#  default_value :string
#  name          :string           not null
#  nullable      :boolean          default(FALSE), not null
#  value_type    :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_user_preference_options_on_name  (name) UNIQUE
#
class UserPreferenceOption < ApplicationRecord
  InvalidName = Class.new(StandardError)

  NAMES = [
    COLOR_SCHEME = :color_scheme,
  ].freeze

  has_many :user_preferences, dependent: :destroy

  validates :value_type, inclusion: { in: Preferences::OptionTypes.available_types.keys }
  validate :ensure_default_if_not_null

  def self.fetch_by_name(name)
    raise InvalidName, "#{name} is not a valid name" unless name.to_sym.in?(NAMES)

    find_by!(name:)
  end

  private

  def ensure_default_if_not_null
    return if nullable || !default_value.nil?

    errors.add(:default_value, 'must be provided when not nullable')
  end
end

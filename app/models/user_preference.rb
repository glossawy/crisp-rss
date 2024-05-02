# frozen_string_literal: true

# == Schema Information
#
# Table name: user_preferences
#
#  id                        :bigint           not null, primary key
#  value                     :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  user_id                   :uuid             not null
#  user_preference_option_id :bigint
#
# Indexes
#
#  idx_on_user_id_user_preference_option_id_1df80ffafb  (user_id,user_preference_option_id) UNIQUE
#  index_user_preferences_on_user_id                    (user_id)
#  index_user_preferences_on_user_preference_option_id  (user_preference_option_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class UserPreference < ApplicationRecord
  belongs_to :option,
             class_name: 'UserPreferenceOption',
             foreign_key: :user_preference_option_id,
             inverse_of: :user_preferences

  belongs_to :user

  before_validation :set_default_value
  validate :ensure_value_nilability

  delegate :name, :nullable, :default_value, to: :option
  alias nullable? nullable

  private

  def set_default_value
    return unless default_value

    self.value = default_value if value.nil?
  end

  def ensure_value_nilability
    return if nullable || !value.nil?

    errors.add(:value, 'must not be nil')
  end
end

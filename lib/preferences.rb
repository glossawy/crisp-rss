# frozen_string_literal: true

module Preferences
  def self.user_config(user: nil)
    Config.new(UserPreferenceOption.all).tap do |cfg|
      next unless user

      user.configs.each do |pref|
        cfg.set(pref.name, pref.value)
      end
    end
  end
end

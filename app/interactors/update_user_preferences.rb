class UpdateUserPreferences
  include Interactor
  include IdentifyModel

  identify User, :user

  before do
    context.configs = context.configs.deep_transform_keys do |k|
      k.to_s.underscore.to_sym
    end
  end

  def call
    context.original_config = user_config.to_h
    user_config.load!(context.configs)

    context.fail!(errors: key_errors) if disallowed_keys.any?

    save_config!
  end

  def rollback
    user_config.load!(context.original_config)

    save_config!
  end

  private

  def key_errors
    disallowed_keys.index_with do |key|
      "#{key} is not a valid configuration option"
    end
  end

  def disallowed_keys
    @disallowed_keys ||= context.configs.keys.reject { |k| user_config.allowed? k }
  end

  def save_config!
    context.user.with_lock do
      set_configs!
      delete_configs!
    end
  end

  def set_configs!
    user_config.to_serialized_h.each do |(name, value)|
      up = UserPreference.find_or_create_by!(
        user_id: context.user.id,
        option: UserPreferenceOption.fetch_by_name(name),
      )
      up.update!(value:)
    end
  end

  def delete_configs!
    context.user.configs
           .joins(:option)
           .where
           .not(user_preference_options: { name: user_config.keys })
           .find_each(&:destroy!)
  end

  def user_config
    @user_config ||= Preferences.user_config(user: context.user)
  end
end

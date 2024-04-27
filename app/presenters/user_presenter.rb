class UserPresenter < SimpleDelegator
  def config_hash
    Preferences.user_config(user: __getobj__).to_h
  end
end

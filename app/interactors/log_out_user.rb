# frozen_string_literal: true

class LogOutUser
  include Interactor

  def call
    user = User.fetch_by_token(context.token)
    context.fail!(reason: 'No user found for token') if user.blank?

    manager = Sessions::Manager.new(user)
    context.session = manager.revoke_session!(context.token)
  rescue Sessions::Manager::SessionNotFound
    context.fail!(reason: 'Token does not match any session')
  end

  def session_manager
    Sessions::Manager.new(context.user)
  end
end

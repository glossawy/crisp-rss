# frozen_string_literal: true

class SignInUser
  include Interactor

  def call
    user = User.find_by(email: context.email)

    context.fail! unless user&.authenticate(context.password)

    token = Sessions::Manager.new(user).create_new_session!

    context.user = user
    context.token = token
  end

  def session_manager
    Sessions::Manager.new(context.user)
  end
end

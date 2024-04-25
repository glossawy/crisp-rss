# frozen_string_literal: true

class ValidateToken
  include Interactor

  def call
    session_token = context.token

    return if session_token && UserSession.active.exists?(session_token:)

    context.fail!
  end
end

# frozen_string_literal: true

class SessionsController < AuthenticatedController
  skip_authentication! only: :create

  def check
    user_session = CurrentSession.session
    render locals: { session: user_session }
  end

  def create
    result = SignInUser.call(create_params)

    if result.success?
      prepare_access_token_headers!(result.session_info)
      head :created
    else
      render status: :bad_request, json: {
        message: 'Login failed',
      }
    end
  end

  def logout
    result = LogOutUser.call(token: CurrentSession.token)

    if result.success?
      render locals: { session: result.session }
    else
      render status: :bad_request, json: {
        message: result.reason,
      }
    end
  end

  private

  def prepare_access_token_headers!(session_info)
    session_info in { user_id:, token: session_token, expires_at: }

    encoded = Sessions::Jwt.new({ user_id:, session_token: }).encode
    response.headers['Access-Token'] = encoded.token
    response.headers['Expire-At'] = expires_at.iso8601
  end

  def create_params
    params.require(:user).permit(:email, :password)
  end
end

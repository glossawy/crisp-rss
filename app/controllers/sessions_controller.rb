# frozen_string_literal: true

class SessionsController < AuthenticatedController
  skip_authentication!

  def check
    user_session = CurrentSession.session

    if user_session.blank?
      render status: :bad_request, json: {
        message: 'Access token not provided with request',
      }
    else
      render locals: { session: user_session }
    end
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

  private

  def prepare_access_token_headers!(session_info)
    session_info in { token:, expires_at: }

    encoded = Sessions::Jwt.new({ session_token: token }).encode
    response.headers['Access-Token'] = encoded.token
    response.headers['Expire-At'] = expires_at.iso8601
  end

  def create_params
    params.require(:user).permit(:email, :password)
  end
end

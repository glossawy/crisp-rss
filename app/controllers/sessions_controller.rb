# frozen_string_literal: true

class SessionsController < AuthenticatedController
  skip_authentication!

  def check
    session = CurrentSession.session

    if session.blank?
      head :not_found
    else
      render locals: { session: CurrentSession.session }
    end
  end

  def create
    result = SignInUser.call(create_params)

    if result.success?
      reset_session
      session[:auth_token] = result.token
      head :created
    else
      head :bad_request
    end
  end

  private

  def create_params
    params.require(:user).permit(:email, :password)
  end
end

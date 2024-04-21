# frozen_string_literal: true

class SessionsController < AuthenticatedController
  skip_authentication!

  def check
    user_session = CurrentSession.session
    session.send :load!
    Rails.logger.info([user_session, session.to_h])

    if user_session.blank?
      head :bad_request
    else
      render locals: { session: user_session }
    end
  end

  def create
    result = SignInUser.call(create_params)

    if result.success?
      reset_session
      session[:auth_token] = result.token
      render 'sessions/check', status: :created, locals: { session: result.session }
    else
      head :bad_request
    end
  end

  private

  def create_params
    params.require(:user).permit(:email, :password)
  end
end

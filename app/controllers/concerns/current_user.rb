# frozen_string_literal: true

module CurrentUser
  extend ActiveSupport::Concern

  def set_current_session
    CurrentSession.session_token = jwt.session_token
  end

  def current_user
    CurrentSession.user
  end

  included do
    before_action :set_current_session

    helper_method :current_user
  end
end

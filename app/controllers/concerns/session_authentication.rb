# frozen_string_literal: true

module SessionAuthentication
  extend ActiveSupport::Concern

  include ActionController::HttpAuthentication::Token::ControllerMethods

  def authenticate!
    return if skip_authentication?

    authenticated = authenticate_with_http_token do |token, _options|
      session_token = Sessions::Jwt::Encoded.new(token).decode.session_token

      ValidateToken.call(token: session_token).success?
    end

    render_unauthenticated unless authenticated
  end

  def skip_authentication?
    skip_authentication_actions.include?(:all) ||
      skip_authentication_actions.include?(action_name.to_sym)
  end

  def render_unauthenticated
    render status: :unauthorized, json: jsend_error(
      'Valid access token not provided with request',
    )
  end

  def skip_authentication_actions
    self.class.skip_authentication_actions.dup
  end

  included do
    before_action :authenticate!

    rescue_from JWT::DecodeError do
      render_unauthenticated
    end
  end

  class_methods do
    def skip_authentication!(only: [:all])
      skip_authentication_actions.concat(Array.wrap(only).map(&:to_sym))
    end

    def skip_authentication_actions
      @skip_authentication_actions ||= []
    end
  end
end

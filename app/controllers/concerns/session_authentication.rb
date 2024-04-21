# frozen_string_literal: true

module SessionAuthentication
  extend ActiveSupport::Concern

  def authenticate!
    return if skip_authentication_actions.include?(:all) || skip_authentication_actions.include?(action_name.to_sym)

    session_token = session[:auth_token]

    render_unauthenticated if session_token.blank?
    render_unauthenticated unless UserSession.active.exists?(session_token:)
  end

  def render_unauthenticated
    respond_to do |r|
      r.json { render status: :unauthorized }
    end
  end

  def skip_authentication_actions
    self.class.skip_authentication_actions.dup
  end

  included do
    before_action :authenticate!
  end

  class_methods do
    def skip_authentication!(only: [:all])
      skip_authentication_actions.concat(only.map(&:to_sym))
    end

    def skip_authentication_actions
      @skip_authentication_actions ||= []
    end
  end
end

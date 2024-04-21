# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::MimeResponds

  include CurrentUser

  def bearer_token
    @bearer_token ||=
      ActionController::HttpAuthentication::Token.token_and_options(request)&.first
  end

  def jwt
    @jwt ||=
      if bearer_token.present?
        Sessions::Jwt::Encoded.new(bearer_token).decode
      else
        Sessions::Jwt.new
      end
  end
end

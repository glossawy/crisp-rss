# frozen_string_literal: true

module AuthHelper
  def encode_jwt(session_or_token)
    token =
      if session_or_token.respond_to? :session_token
        session_or_token.session_token
      else
        session_or_token.to_s
      end

    Sessions::Jwt.new({ session_token: token }).encode.token
  end

  def authorization_headers(session_or_token)
    {
      'Authorization' => "Bearer #{encode_jwt(session_or_token)}",
    }
  end

  def auth_get(*, session:, headers: {}, **kwargs)
    kwargs[:as] ||= :json

    get(*, **kwargs, headers: { **headers, **authorization_headers(session) })
  end

  def auth_post(*, session:, headers: {}, **kwargs)
    kwargs[:as] ||= :json
    post(*, **kwargs, headers: { **headers, **authorization_headers(session) })
  end

  def auth_put(*, session:, headers: {}, **kwargs)
    kwargs[:as] ||= :json
    put(*, **kwargs, headers: { **headers, **authorization_headers(session) })
  end

  def auth_patch(*, session:, headers: {}, **kwargs)
    kwargs[:as] ||= :json
    patch(*, **kwargs, headers: { **headers, **authorization_headers(session) })
  end

  def auth_delete(*, session:, headers: {}, **kwargs)
    kwargs[:as] ||= :json
    delete(*, **kwargs, headers: { **headers, **authorization_headers(session) })
  end
end

# frozen_string_literal: true

module CurrentSession
  SessionInfo = Struct.new(:session) do
    delegate :user, to: :session
    def token = session.session_token
  end

  STORE_KEY = :crisprss_session

  class << self
    def session_token=(session_token)
      session = UserSession.find_by(session_token:)

      RequestStore.store[STORE_KEY] = session.nil? ? nil : SessionInfo.new(session)
    end

    def session_info
      RequestStore.store[STORE_KEY]
    end

    delegate :session, :user, :token, to: :session_info, allow_nil: true
  end
end

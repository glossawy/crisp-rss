# frozen_string_literal: true

module Sessions
  class Manager
    attr_reader :user

    SessionNotFound = Class.new(StandardError)

    SessionInfo = Struct.new(:user_id, :token, :expires_at)

    EXPIRES_IN = 1.day

    def initialize(user)
      @user = user
    end

    delegate :sessions, to: :user

    def active_sessions
      sessions.active
    end

    def create_new_session!
      session = sessions.create!(
        session_token: Sessions::Token.generate_token_value,
        expires_at: EXPIRES_IN.from_now,
      )

      SessionInfo.new(user.id, session.session_token, session.expires_at)
    end

    def revoke_session!(session_token)
      session = sessions.find_by!(session_token:)

      session.expire! if session.active?

      SessionInfo.new(user.id, session.session_token, session.expires_at)
    rescue ActiveRecord::RecordNotFound
      raise SessionNotFound, 'Token does not match a session'
    end
  end
end

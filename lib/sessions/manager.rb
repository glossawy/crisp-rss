# frozen_string_literal: true

module Sessions
  class Manager
    attr_reader :user

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
        session_token: Sessions::Token.new.value,
        expires_at: EXPIRES_IN.from_now
      )

      session.session_token
    end

    def revoke_session!(session_token)
      session = sessions.find_by!(session_token:)

      session.expire! if session.active?
    end
  end
end

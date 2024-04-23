# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Sessions' do
  include AuthHelper

  let(:response_hash) { JSON.parse(response.body, symbolize_names: true) }

  describe 'GET /sessions/check' do
    context 'when not authenticated' do
      it 'returns a 401' do
        json_get sessions_check_path
        expect(response).to have_http_status :unauthorized
      end
    end

    context 'when sessions is expired' do
      let(:user_session) { create(:user_session, :expired) }

      it 'returns a 401' do
        auth_get sessions_check_path, session: user_session

        expect(response).to have_http_status :unauthorized
      end
    end

    context 'when authenticated' do
      let(:user_session) { create(:user_session) }

      it 'returns a 200' do
        auth_get sessions_check_path, session: user_session
        expect(response).to have_http_status :ok
      end

      it 'returns the expiry' do
        auth_get sessions_check_path, session: user_session

        expect(response_hash)
          .to eq(expires_at: user_session.expires_at.iso8601)
      end
    end
  end

  describe 'GET /sessions/logout' do
    it 'returns a 401 when no token provided' do
      json_get sessions_logout_path

      expect(response).to have_http_status :unauthorized
    end

    context 'with an auth token' do
      let(:session) { create :user_session }

      it 'returns a 200' do
        auth_get(sessions_logout_path, session:)

        expect(response).to have_http_status :ok
      end

      it 'returns the new expiry for the session' do
        auth_get(sessions_logout_path, session:)

        expect(response_hash[:expires_at]).to eq session.reload.expires_at.iso8601
      end

      it 'expires the session' do
        expect { auth_get(sessions_logout_path, session:) }
          .to change { session.reload.active? }.from(true).to(false)
      end
    end
  end

  describe 'POST /sessions' do
    let_it_be(:user) { create(:user) }

    it 'returns a 400 when credentials dont match' do
      json_post sessions_path, params: { user: { email: 'no@match.com', password: 'nope!' } }

      expect(response).to have_http_status :bad_request
    end

    context 'when credentials match' do
      let(:params) { { user: { email: user.email, password: user.password } } }

      it 'returns a 201 response' do
        json_post(sessions_path, params:)

        expect(response).to have_http_status(:created)
      end

      it 'returns token headers' do
        json_post(sessions_path, params:)

        expect(response.headers['access-token']).to be_present
        expect(response.headers['expire-at']).to be_present
      end

      it 'returns session token and user in JWT' do
        json_post(sessions_path, params:)

        access_token = response.headers['access-token']
        decoded = Sessions::Jwt::Encoded.new(access_token).decode

        expect(decoded.payload).to eq(
          session_token: user.sessions.last.session_token,
          user_id: user.id
        )
      end
    end
  end
end

require 'rails_helper'

RSpec.describe 'Sessions' do
  include AuthHelper

  describe 'GET /sessions/check' do
    context 'when not authenticated' do
      it 'returns a 404' do
        json_get sessions_check_path
        expect(response).to have_http_status :not_found
      end
    end

    context 'when authenticated' do
      let(:user_session) { create(:user_session) }
      let(:response_hash) { JSON.parse(response.body, symbolize_names: true) }

      before { login!(user_session) }

      it 'returns a 200' do
        json_get sessions_check_path
        expect(response).to have_http_status :ok
      end

      it 'returns the active state and expiry' do
        json_get sessions_check_path

        expect(response_hash)
          .to match(hash_including(active: true, expires_at: user_session.expires_at.iso8601))
      end
    end
  end

  describe 'POST /sessions' do
    let_it_be(:user) { create(:user) }

    it 'returns a 400 when credentials dont match' do
      json_post sessions_path, params: { user: { email: 'no@match.com', password: 'nope!' } }

      expect(response).to have_http_status :bad_request
    end

    it 'returns a 201 when credentials match' do
      json_post sessions_path, params: {
        user: {
          email: user.email,
          password: user.password,
        },
      }

      expect(response).to have_http_status :created
    end
  end
end

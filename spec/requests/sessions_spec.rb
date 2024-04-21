# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Sessions' do
  include AuthHelper

  let(:response_hash) { JSON.parse(response.body, symbolize_names: true) }

  describe 'GET /sessions/check' do
    context 'when not authenticated' do
      it 'returns a 400' do
        json_get sessions_check_path
        expect(response).to have_http_status :bad_request
      end
    end

    context 'when authenticated' do
      let(:user_session) { create(:user_session) }

      before { login!(user_session) }

      it 'returns a 200' do
        json_get sessions_check_path
        expect(response).to have_http_status :ok
      end

      it 'returns the expiry' do
        json_get sessions_check_path

        expect(response_hash)
          .to eq(expires_at: user_session.expires_at.iso8601)
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
    end
  end
end

# frozen_string_literal: true

# == Schema Information
#
# Table name: user_sessions
#
#  id            :bigint           not null, primary key
#  expires_at    :datetime         not null
#  session_token :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :uuid             not null
#
# Indexes
#
#  index_user_sessions_on_session_token  (session_token) UNIQUE
#  index_user_sessions_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe UserSession do
  subject(:session) { create(:user_session) }

  describe 'validations' do
    subject(:session) { build(:user_session, **params) }

    let(:params) { {} }

    it 'is valid' do
      expect(session).to be_valid
    end

    [
      ['expires at is nil', { expires_at: nil }, /blank/],
      ['token is nil', { session_token: nil }, /blank/],
      ['token is too short', { session_token: 'abc' }, /wrong length/],
      ['token is too long', { session_token: 'a' * (Sessions::Token.token_length + 1) }, /wrong length/],
      ['token is not base36', { session_token: '~' * Sessions::Token.token_length }, /lowercase alphanumeric/],
    ].each do |(description, params, message_matcher)|
      context "when #{description}" do
        let(:params) { params }

        it 'fails validation with correct message' do
          expect { session.validate! }.to raise_error(ActiveRecord::RecordInvalid, message_matcher)
        end
      end
    end

    context 'when another session exists with the same token' do
      let_it_be(:existing_session) { create(:user_session) }
      let(:params) { { session_token: existing_session.session_token } }

      it 'fails validation' do
        expect(session).not_to be_valid
      end
    end
  end

  describe 'expire!' do
    around { |ex| Timecop.freeze(&ex) }

    it 'sets expiration to now' do
      expect do
        session.expire!
      end.to change(session, :expires_at).to(Time.current)
    end

    it 'makes the session no longer active' do
      session.expire!
      expect(session).not_to be_active
    end

    context 'when already expired' do
      subject(:session) { create(:user_session, :expired) }

      it 'does not change the expiration time' do
        expect do
          session.expire!
        end.not_to(change do
          session.reload.expires_at
        end)
      end
    end
  end

  describe 'active?' do
    context 'when expiration is in the future' do
      it 'is active' do
        expect(session).to be_active
      end
    end

    context 'when expiration is now' do
      it 'is not active' do
        Timecop.freeze do
          session.update!(expires_at: Time.current)
          expect(session).not_to be_active
        end
      end
    end

    context 'when expiration is in the past' do
      before { session.update!(expires_at: 1.day.ago) }

      it 'is not active' do
        expect(session).not_to be_active
      end
    end
  end
end

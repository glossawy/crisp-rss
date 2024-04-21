# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Sessions::Manager do
  let_it_be(:user) { create(:user) }
  subject(:manager) { manager_instance }

  let(:manager_instance) { described_class.new(user) }

  describe '#create_new_session!' do
    it 'returns a session token' do
      expect(manager.create_new_session!).to be_a String
    end

    it 'creates a new session associated with the user' do
      session_token = manager.create_new_session!
      expect(user.sessions.where(session_token:)).to exist
    end

    it 'creates unique session tokens' do
      st1 = manager.create_new_session!
      st2 = manager.create_new_session!

      expect(st1).not_to eq st2
    end
  end

  describe '#revoke_session!' do
    context 'with a nil token' do
      it 'raises a record not found error' do
        expect { manager.revoke_session!(nil) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'with a blank token' do
      it 'raises a record not found error' do
        expect { manager.revoke_session!('   ') }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'with a token for an active session' do
      let_it_be(:session) { create(:user_session, user:) }

      it 'expires the session' do
        expect do
          manager.revoke_session!(session.session_token)
        end.to change {
          session.reload.active?
        }.from(true).to(false)
      end
    end

    context 'with a token for an expired session' do
      let_it_be(:session) { create(:user_session, :expired, user:) }

      it 'does not change the expiration time' do
        expect do
          manager.revoke_session!(session.session_token)
        end.not_to(change { session.reload.expires_at })
      end
    end
  end

  describe '#active_sessions' do
    subject(:manager) { manager_instance.active_sessions }

    context 'with no pre-existing sessions' do
      it 'returns an empty result' do
        expect(manager).to be_empty
      end
    end

    context 'with active sessions' do
      let_it_be(:active_sessions) do
        create_list(:user_session, 3, user:)
      end

      it 'returns the active sessions' do
        expect(manager).to match_array(active_sessions)
      end
    end

    context 'with active, expired, and archived sessions' do
      let_it_be(:active_sessions) { create_list(:user_session, 3, user:) }
      let_it_be(:expired_sessions) do
        create_list(:user_session, 3, :expired, user:)
      end

      it 'returns only the active sessions' do
        expect(manager).to match_array(active_sessions)
      end
    end
  end
end

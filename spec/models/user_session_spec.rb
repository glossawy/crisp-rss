# == Schema Information
#
# Table name: user_sessions
#
#  id            :integer          not null, primary key
#  deleted_at    :datetime
#  expires_at    :datetime         not null
#  session_token :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :integer          not null
#
# Indexes
#
#  index_user_sessions_on_session_token  (session_token) UNIQUE
#  index_user_sessions_on_user_id        (user_id)
#
# Foreign Keys
#
#  user_id  (user_id => users.id)
#
require "rails_helper"

RSpec.describe UserSession, type: :model do
  subject(:session) { create :user_session }

  describe "validations" do
    subject { build :user_session, **params }
    let(:params) { {} }

    it "is valid" do
      expect(subject).to be_valid
    end

    [
      ["expires at is nil", {expires_at: nil}, /blank/],
      ["token is nil", {session_token: nil}, /blank/],
      ["token is too short", {session_token: "abc"}, /wrong length/],
      ["token is too long", {session_token: "a" * (Sessions::Token.token_length + 1)}, /wrong length/],
      ["token is not base36", {session_token: "~" * Sessions::Token.token_length}, /lowercase alphanumeric/]
    ].each do |(description, params, message_matcher)|
      context "when #{description}" do
        let(:params) { params }

        it "fails validation with correct message" do
          expect { subject.validate! }.to raise_error(ActiveRecord::RecordInvalid, message_matcher)
        end
      end
    end

    context "when another session exists with the same token" do
      let_it_be(:existing_session) { create :user_session }
      let(:params) { {session_token: existing_session.session_token} }

      it "fails validation" do
        expect(subject).not_to be_valid
      end
    end
  end

  describe "expire!" do
    around(:each) { |ex| Timecop.freeze(&ex) }

    it "sets expiration to now" do
      expect {
        subject.expire!
      }.to change {
        subject.expires_at
      }.to(Time.current)
    end

    it "makes the session no longer active" do
      subject.expire!
      expect(subject).not_to be_active
    end

    context "when already expired" do
      subject { create(:user_session, :expired) }

      it "does not change the expiration time" do
        expect {
          subject.expire!
        }.not_to change {
          subject.reload.expires_at
        }
      end
    end
  end

  describe "active?" do
    context "when expiration is in the future" do
      it "is active" do
        expect(subject).to be_active
      end
    end

    context "when expiration is now" do
      it "is not active" do
        Timecop.freeze do
          subject.update!(expires_at: Time.current)
          expect(subject).not_to be_active
        end
      end
    end

    context "when expiration is in the past" do
      before { subject.update!(expires_at: 1.day.ago) }

      it "is not active" do
        expect(subject).not_to be_active
      end
    end
  end

  describe "#destroy" do
    it "expires an active session" do
      expect {
        subject.destroy!
      }.to change {
        subject.active?
      }.from(true).to(false)
      expect(subject.expires_at).to be <= Time.current
    end
  end
end

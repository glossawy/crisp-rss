# == Schema Information
#
# Table name: users
#
#  id            :integer          not null, primary key
#  deleted_at    :datetime
#  display_name  :string           not null
#  email         :string           not null
#  password_hash :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_users_on_display_name   (display_name) UNIQUE
#  index_users_on_email          (email) UNIQUE
#  index_users_on_password_hash  (password_hash)
#
require "rails_helper"

RSpec.describe User, type: :model do
  let_it_be(:user) { create :user }
  subject { user }

  describe ".fetch_by_token" do
    subject { described_class.fetch_by_token(session_token) }

    context "when no matching session exists" do
      let(:session_token) { "test" }

      it "returns nil" do
        expect(subject).to be_nil
      end
    end

    context "when a matching sessions exists" do
      let_it_be(:session) { create :user_session, user: }
      let(:session_token) { session.session_token }

      it "returns the user" do
        expect(subject).to eq user
      end

      context "when the session is expired" do
        before { session.expire! }

        it "returns nil" do
          expect(subject).to be_nil
        end
      end
    end
  end

  describe "validations" do
    subject(:user) { build :user, **params }
    let(:params) { {} }

    it "is valid" do
      expect(user).to be_valid
    end

    [
      ["email is missing", {email: nil}, /blank/],
      ["email is blank", {email: ""}, /blank/],
      # Additional validation for emails below

      ["display name is missing", {display_name: nil}, /blank/],
      ["display name is blank", {display_name: ""}, /blank/],
      ["display name is too short", {display_name: "a"}, /between 2 and 255/],
      ["display name is too long", {display_name: "a" * 256}, /between 2 and 255/],
      ["display name has spaces", {display_name: "this is a name"}, /whitespace/],

      ["password is missing", {password: nil}, /blank/],
      ["password is blank", {password: ""}, /blank/],
      ["password is too short", {password: "a"}, /minimum is 8/],
      ["password is too long", {password: "a" * 5000}, /too long/]
    ].each do |(description, params, message_matcher)|
      context "when #{description}" do
        let(:params) { params }
        it "fails validation" do
          expect { user.validate! }.to raise_error(ActiveRecord::RecordInvalid, message_matcher)
        end
      end
    end

    valid_emails = <<~VALID_EMAILS.split("\n")
      email@example.com
      firstname.lastname@example.com
      email@subdomain.example.com
      firstname+lastname@example.com
      email@123.123.123.123
      1234567890@example.com
      email@example-one.com
      _______@example.com
      email@example.name
      email@example.museum
      email@example.co.jp
      firstname-lastname@example.com
    VALID_EMAILS

    invalid_emails = <<~INVALID_EMAILS.split("\n")
      plainaddress
      #@%^%#\$@#\$@#.com
      @example.com
      Joe Smith <email@example.com>
      email.example.com
      email@example@example.com
      .email@example.com
      email.@example.com
      email..email@example.com
      あいうえお@example.com
      email@example.com (Joe Smith)
      email@example
      email@-example.com
      email@111.222.333.44444
      email@example..com
      Abc..123@example.com
    INVALID_EMAILS

    valid_emails.each do |email|
      context "when email is #{email}" do
        let(:params) { {email:} }

        it "is valid" do
          expect(user).to be_valid
        end
      end
    end

    invalid_emails.each do |email|
      context "when email is #{email}" do
        let(:params) { {email:} }

        it "fails validation" do
          expect { user.validate! }.to raise_error(ActiveRecord::RecordInvalid)
        end
      end
    end
  end
end

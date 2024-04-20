require "rails_helper"

RSpec.describe(SecuredWithArgon2) do
  subject(:test_instance) { test_class.new }
  let(:test_class) do
    Class.new do
      include ActiveModel::Model
      include SecuredWithArgon2

      def self.name = "TestClass"

      attr_accessor :password_hash, :password_hash_was

      secured_with_argon2!
    end
  end

  it "has all password attributes defined" do
    expect(subject).to respond_to(:password, :password_confirmation, :password_challenge)
  end

  describe "#argon2_profile" do
    it "returns an insecure profile in test environments" do
      expect(subject.argon2_profile).to eq :unsafe_cheapest
    end

    it "returns low memory cost profile by default" do
      allow(Rails.env).to receive(:test?).and_return(false)

      expect(subject.argon2_profile).to eq :rfc_9106_low_memory
    end

    it "returns high memory cost profile with appropriate env var" do
      allow(Rails.env).to receive(:test?).and_return(false)
      allow(Rails.env).to receive(:[]).with("CRISP_RSS_HIGH_MEMORY").and_return("1")

      expect(subject.argon2_profile).to eq :rfc_9106_high_memory
    end
  end

  describe "#argon2_secret" do
    it "returns nil by default" do
      expect(subject.argon2_secret).to be_nil
    end

    context "with CRISP_RSS_SECRET_KEY set" do
      let(:secret_key) { "topsecret" }
      before do
        expect(Rails.env).to receive(:[]).with("CRISP_RSS_SECRET_KEY").and_return(secret_key)
      end

      it "returns the secret key value" do
        expect(subject.argon2_secret).to eq secret_key
      end
    end
  end

  describe "#authenticate" do
    let(:actual_password) { "this-is-an-actual-password" }

    before do
      test_instance.password = actual_password
    end

    it "returns nil if passwords do not match" do
      expect(subject.authenticate("not-it")).to be_nil
    end

    it "returns self when passwords match" do
      expect(subject.authenticate(actual_password)).to be test_instance
    end

    context "when no password is currently set" do
      let(:actual_password) { nil }

      it "returns nil" do
        expect(subject.authenticate("password")).to be_nil
      end
    end
  end

  describe "setting a new password" do
    before { test_instance.password = new_password }

    context "when new value is blank" do
      let(:new_password) { "" }

      it "sets password to nil" do
        expect(subject.password).to be_nil
      end

      it "sets password hash to nil" do
        expect(subject.password_hash).to be_nil
      end

      it "has a validation error for being blank" do
        expect(subject).not_to be_valid
        expect(subject.errors.messages_for(:password)).to match_array([/blank/])
      end
    end

    context "when new value is too long" do
      let(:new_password) { "a" * 400 }

      it "sets password hash" do
        expect(subject.password_hash).to match_password new_password
      end

      it "has a validation error for being too long" do
        expect(subject).not_to be_valid
        expect(subject.errors.messages_for(:password)).to match_array([/long/])
      end
    end

    context "when new value is a valid password" do
      let(:new_password) { "thisIsAValidPassword" }

      it "sets password" do
        expect(subject.password).to eq new_password
      end

      it "sets password hash" do
        expect(subject.password_hash).to match_password(new_password)
      end

      it "is valid" do
        expect(subject).to be_valid
      end
    end
  end

  describe "changing a password" do
    let(:previous_password) { "previous" }

    before do
      test_instance.password = previous_password
      test_instance.password_hash_was = test_instance.password_hash
      test_instance.password = new_password
    end

    context "when new password is blank" do
      let(:new_password) { "" }

      it "is not valid" do
        expect(subject).not_to be_valid
      end
    end

    context "when new password is valid" do
      let(:new_password) { "a-valid-password" }

      it "is valid without a challenge value" do
        expect(subject).to be_valid
      end

      it "is invalid with an invalid challenge value" do
        subject.password_challenge = "not-correct"
        expect(subject).not_to be_valid
        expect(subject.errors.messages_for(:password_challenge)).not_to be_blank
      end

      it "is valid when challenge value is previous password" do
        subject.password_challenge = previous_password
        expect(subject).to be_valid
      end
    end
  end
end

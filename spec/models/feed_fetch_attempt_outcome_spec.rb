# == Schema Information
#
# Table name: feed_fetch_attempt_outcomes
#
#  id                    :integer          not null, primary key
#  is_success            :boolean
#  reason                :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  feed_fetch_attempt_id :integer          not null
#
# Indexes
#
#  index_feed_fetch_attempt_outcomes_on_feed_fetch_attempt_id  (feed_fetch_attempt_id)
#
# Foreign Keys
#
#  feed_fetch_attempt_id  (feed_fetch_attempt_id => feed_fetch_attempts.id)
#
require "rails_helper"

RSpec.describe FeedFetchAttemptOutcome, type: :model do
  subject(:outcome) { create :feed_fetch_attempt_outcome, **params }
  let(:params) { {} }

  context "when success flag not set" do
    it "is pending" do
      expect(outcome).to be_pending
    end

    it "is not a success" do
      expect(outcome).not_to be_success
    end

    it "is not a failure" do
      expect(outcome).not_to be_failure
    end
  end

  context "when success flag is set" do
    let(:params) { {is_success:} }

    context "when flag is true" do
      let(:is_success) { true }

      it "is not pending" do
        expect(outcome).not_to be_pending
      end

      it "is a success" do
        expect(outcome).to be_success
      end

      it "is not a failure" do
        expect(outcome).not_to be_failure
      end
    end

    context "when flag is false" do
      let(:is_success) { false }

      it "is not pending" do
        expect(outcome).not_to be_pending
      end

      it "is not a success" do
        expect(outcome).not_to be_success
      end

      it "is a failure" do
        expect(outcome).to be_failure
      end
    end
  end
end

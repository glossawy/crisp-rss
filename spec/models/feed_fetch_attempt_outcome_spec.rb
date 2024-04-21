# frozen_string_literal: true

# == Schema Information
#
# Table name: feed_fetch_attempt_outcomes
#
#  id                    :integer          not null, primary key
#  reason                :string
#  state                 :string
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
require 'rails_helper'

RSpec.describe FeedFetchAttemptOutcome do
  subject(:outcome) { create(:feed_fetch_attempt_outcome, **params) }

  let(:params) { {} }

  context 'when state is set' do
    let(:params) { { state: } }

    context 'when pending' do
      let(:state) { 'pending' }

      it 'is pending' do
        expect(outcome).to be_pending
      end

      it 'is not a success' do
        expect(outcome).not_to be_success
      end

      it 'is not a failure' do
        expect(outcome).not_to be_failure
      end
    end

    context 'when success' do
      let(:state) { 'success' }

      it 'is not pending' do
        expect(outcome).not_to be_pending
      end

      it 'is a success' do
        expect(outcome).to be_success
      end

      it 'is not a failure' do
        expect(outcome).not_to be_failure
      end
    end

    context 'when failure' do
      let(:state) { 'failure' }

      it 'is not pending' do
        expect(outcome).not_to be_pending
      end

      it 'is not a success' do
        expect(outcome).not_to be_success
      end

      it 'is a failure' do
        expect(outcome).to be_failure
      end
    end
  end
end

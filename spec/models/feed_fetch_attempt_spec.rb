# frozen_string_literal: true

# == Schema Information
#
# Table name: feed_fetch_attempts
#
#  id         :bigint           not null, primary key
#  perform_at :datetime         not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  feed_id    :bigint           not null
#
# Indexes
#
#  index_feed_fetch_attempts_on_feed_id  (feed_id)
#
# Foreign Keys
#
#  fk_rails_...  (feed_id => feeds.id)
#
require 'rails_helper'

RSpec.describe FeedFetchAttempt do
  subject(:attempt) { create(:feed_fetch_attempt) }

  describe 'validations' do
    subject(:attempt) { build_stubbed(:feed_fetch_attempt, **params) }

    let(:params) { {} }

    it 'is valid' do
      expect(attempt).to be_valid
    end

    context 'when perform at is now' do
      let(:params) { { perform_at: Time.current } }

      around { |ex| Timecop.freeze(&ex) }

      it 'is valid' do
        expect(attempt).to be_valid
      end
    end

    [
      ['perform at is missing', { perform_at: nil }, /blank/],
      ['perform at is in the past', { perform_at: 1.hour.ago }, /future/],
    ].each do |(description, params, message_matcher)|
      context "when #{description}" do
        let(:params) { params }

        it 'fails validation' do
          expect { attempt.validate! }.to raise_error(ActiveRecord::RecordInvalid, message_matcher)
        end
      end
    end
  end
end

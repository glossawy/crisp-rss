# frozen_string_literal: true

# == Schema Information
#
# Table name: feeds
#
#  id         :integer          not null, primary key
#  interval   :integer          not null
#  url        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :integer          not null
#
# Indexes
#
#  index_feeds_on_user_id  (user_id)
#
# Foreign Keys
#
#  user_id  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Feed do
  subject(:feed) { create(:feed) }

  describe 'validations' do
    subject(:feed) { build(:feed, **params) }

    let(:params) { {} }

    it 'is valid' do
      expect(feed).to be_valid
    end

    [
      ['feed url is missing', { url: nil }, /blank/],
      ['feed url is blank', { url: '' }, /blank/],
      ['feed url is not a url', { url: 'notaurl' }, /valid URL/],

      ['interval is missing', { interval: nil }, /blank/],
      ['interval is not an integer', { interval: 0.5 }, /integer/],
      ['interval is too small', { interval: 0 }, /greater than/],
      ['interval is negative', { interval: -2 }, /greater than/],
    ].each do |(description, params, message_matcher)|
      context "when #{description}" do
        let(:params) { params }

        it 'fails validation' do
          expect { feed.validate! }.to raise_error(ActiveRecord::RecordInvalid, message_matcher)
        end
      end
    end
  end
end

# frozen_string_literal: true

require 'sessions/token'

RSpec.describe Sessions::Token do
  describe '.generate_token_value' do
    subject(:token) { described_class.generate_token_value }

    it 'returns a token of the right length' do
      expect(token.length).to eq described_class::BASE36_LEN
    end
  end
end

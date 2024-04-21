# frozen_string_literal: true

require 'sessions/token'

RSpec.describe Sessions::Token do
  context 'without an initialization value' do
    subject(:token) { described_class.new }

    it 'generates a token value' do
      expect(token.value).to match(/[a-f0-9]+/i)
    end
  end

  context 'with an initialization value' do
    subject(:token) { described_class.new(value) }

    let(:value) { 'token' }

    it 'uses initialization value as token value' do
      expect(token.value).to eq value
    end
  end
end

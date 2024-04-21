# frozen_string_literal: true

module Sessions
  class Token
    attr_reader :value

    ENTROPY_BITS = 128
    BASE36_LEN = Math.log(2**ENTROPY_BITS, 36).ceil

    def self.token_length
      BASE36_LEN
    end

    def self.generate_token_value
      SecureRandom.base36(BASE36_LEN)
    end

    def initialize(value = generate_token_value)
      @value = value
    end

    delegate :generate_token_value, to: :class
  end
end

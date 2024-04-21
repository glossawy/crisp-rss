# frozen_string_literal: true

module Sessions
  module Token
    attr_reader :value

    ENTROPY_BITS = 128
    BASE36_LEN = Math.log(2**ENTROPY_BITS, 36).ceil

    def self.token_length
      BASE36_LEN
    end

    def self.generate_token_value
      SecureRandom.base36(BASE36_LEN)
    end
  end
end

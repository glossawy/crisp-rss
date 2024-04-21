module Sessions
  class Jwt
    ALGORITHM = 'hs512'.freeze
    KEYGEN = [ENV.fetch('CRISPRSS_JWT_SALT'), 512].freeze

    def self.secret
      Rails.application.key_generator.generate_key(*KEYGEN)
    end

    Encoded = Struct.new(:token) do
      def decode
        payload, _headers = JWT.decode(token, Jwt.secret, true, verify_iat: true)
        Jwt.new(payload)
      end
    end

    attr_reader :payload

    def initialize(payload = {})
      @payload = payload.deep_symbolize_keys
    end

    def session_token = payload[:session_token]

    def session_token=(token)
      payload[:session_token] = token
    end

    def encode
      Encoded.new(JWT.encode(payload, Jwt.secret))
    end
  end
end

# frozen_string_literal: true

RSpec::Matchers.define :match_password do |plaintext|
  match do |hashed|
    Argon2::Password.verify_password(
      plaintext,
      hashed,
      secret || SecuredWithArgon2.argon2_secret,
    )
  end

  chain :with_secret, :secret
end

RSpec::Matchers.alias_matcher :matches_password, :match_password

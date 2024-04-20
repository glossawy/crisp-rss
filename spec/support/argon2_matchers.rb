RSpec::Matchers.define :match_password do |plaintext|
  match do |hashed|
    Argon2::Password.verify_password(
      plaintext,
      hashed,
      secret
    )
  end

  chain :with_secret, :secret
end

RSpec::Matchers.alias_matcher :matches_password, :match_password

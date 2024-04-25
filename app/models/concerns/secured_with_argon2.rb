# frozen_string_literal: true

# A very nearly identical copy of ActiveModel::SecurePassword
# but with Argon2 instead of BCrypt as well as some application
# specific configuration
module SecuredWithArgon2
  extend ActiveSupport::Concern

  ARGON2_MAX_INPUT_BYTES = 127
  ARGON2_KEYGEN = [ENV.fetch('CRISPRSS_ARGON2_SALT'), 512].freeze

  def self.argon2_secret
    Rails.application.key_generator.generate_key(*ARGON2_KEYGEN)
  end

  def argon2_secret = SecuredWithArgon2.argon2_secret

  def self.argon2_profile
    if Rails.env.test?
      :unsafe_cheapest
    elsif Rails.env['CRISP_RSS_HIGH_MEMORY'] == '1'
      :rfc_9106_high_memory
    else
      :rfc_9106_low_memory
    end
  end

  def argon2_profile = SecuredWithArgon2.argon2_profile

  class_methods do
    # rubocop:disable Metrics/AbcSize, Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity
    def secured_with_argon2!(password_attr = :password)
      attr_reader password_attr
      attr_accessor :"#{password_attr}_confirmation", :"#{password_attr}_challenge"

      define_method(:"#{password_attr}=") do |plaintext|
        if plaintext.blank?
          instance_variable_set(:"@#{password_attr}", nil)
          public_send(:"#{password_attr}_hash=", nil)
        else
          instance_variable_set(:"@#{password_attr}", plaintext)
          hashed = Argon2::Password.create(plaintext, {
                                             profile: argon2_profile,
                                             secret: argon2_secret,
                                           },)
          public_send(:"#{password_attr}_hash=", hashed)
        end
      end

      define_method(:"authenticate_#{password_attr}") do |plaintext|
        hashed = public_send(:"#{password_attr}_hash")
        return if hashed.blank?

        self if Argon2::Password.verify_password(plaintext, hashed, argon2_secret)
      end

      alias_method :authenticate, :"authenticate_#{password_attr}"

      validate do |record|
        record.errors.add(password_attr, :blank) if record.public_send(:"#{password_attr}_hash").blank?
      end

      validate do |record|
        challenge = record.public_send(:"#{password_attr}_challenge")
        if challenge
          if record.respond_to?(:"#{password_attr}_hash_was")
            hash_was = record.public_send(:"#{password_attr}_hash_was")
          end
          if hash_was.blank? ||
             !Argon2::Password.verify_password(
               challenge, hash_was, argon2_secret,
             )
            record.errors.add(:"#{password_attr}_challenge")
          end
        end
      end

      # Validates that the password does not exceed the maximum allowed bytes for BCrypt (72 bytes).
      validate do |record|
        plaintext = record.public_send(password_attr)
        if plaintext.present? && plaintext.bytesize > ARGON2_MAX_INPUT_BYTES
          record.errors.add(password_attr, :password_too_long)
        end
      end

      validates password_attr, confirmation: { allow_blank: true }
    end
    # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity
  end
end

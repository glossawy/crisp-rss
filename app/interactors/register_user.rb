# frozen_string_literal: true

class RegisterUser
  include Interactor

  def call
    context.fail!(errors: new_user.errors.to_hash(true)) unless new_user.save

    context.user = new_user
  end

  def rollback
    context.user.destroy_fully!
  end

  private

  def new_user
    @new_user ||= User.new(display_name:, email:, password:, password_confirmation:)
  end

  def display_name = context.params[:display_name]
  def email = context.params[:email]
  def password = context.params[:password]
  def password_confirmation = context.params[:confirm_password]
end

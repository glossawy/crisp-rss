# frozen_string_literal: true

class UsersController < AuthenticatedController
  before_action :fetch_user!, only: %i[show]

  def show
    render locals: { user: @user }
  end

  private

  def fetch_user!
    user_id = params.require(:id)
    @user = User.find(params.require(:id))

    return if @user.present?

    render status: :not_found, json: {
      message: "User #{user_id} not found",
    }
  end
end

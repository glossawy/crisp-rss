# frozen_string_literal: true

class UsersController < AuthenticatedController
  include RestrictToCurrentUser

  before_action :fetch_user!
  before_action :current_user_only!, except: :show

  def show
    render locals: { user: to_presenter(@user) }
  end

  def update
    result = UpdateUserPreferences.call(user: @user, configs: update_params[:configs] || {})

    if result.success?
      render :show, locals: { user: to_presenter(@user) }
    elsif result.errors
      render status: :unprocessable_entity, json: jsend_fail(result.errors)
    else
      render status: :internal_server_error, json: jsend_error(result.reason)
    end
  end

  private

  def update_params
    params.require(:user).permit(
      configs: {},
    )
  end

  def to_presenter(user)
    UserPresenter.new(user)
  end

  def user_id
    params.require(:id)
  end

  def fetch_user!
    @user = User.find(user_id)

    return if @user.present?

    render status: :not_found, json: jsend_fail(
      id: 'User not found',
    )
  end
end

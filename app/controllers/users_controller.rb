# frozen_string_literal: true

class UsersController < AuthenticatedController
  include RestrictToCurrentUser

  skip_authentication! only: :create

  before_action :fetch_user!, except: :create
  before_action :current_user_only!, only: :update

  def show
    render locals: { user: to_presenter(@user) }
  end

  def create
    result = RegisterUser.call(params: create_params)

    if result.success?
      render :show, status: :created, locals: { user: to_presenter(result.user) }
    elsif result.errors
      render status: :unprocessable_entity, json: jsend_fail(result.errors)
    else
      render status: :internal_server_error, json: jsend_error(result.reason)
    end
  end

  def update
    result = UpdateUserPreferences.call(user: @user, configs: update_params[:configs] || {})

    if result.success?
      render :show, locals: { user: to_presenter(@user) }
    elsif result.errors
      render status: :unprocessable_entity, json: jsend_fail(config_errors(result.errors))
    else
      render status: :internal_server_error, json: jsend_error(result.reason)
    end
  end

  private

  def create_params
    params.require(:user).permit(
      :displayName, :email, :password, :passwordConfirmation,
    ).transform_keys(&:underscore)
  end

  def update_params
    params.require(:user).permit(
      configs: {},
    )
  end

  def config_errors(errors)
    errors.transform_keys { |k| k.to_s.camelize(:lower) }
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

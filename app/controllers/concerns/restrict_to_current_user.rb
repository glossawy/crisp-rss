# frozen_string_literal: true

module RestrictToCurrentUser
  extend ActiveSupport::Concern

  included do
    private

    def current_user_only!
      uid = respond_to?(:user_id, true) ? user_id : params.require(:user_id)

      return if current_user&.id == uid

      render_unauthorized
    end

    def render_unauthorized
      render status: :unauthorized, json: jsend_error(
        'You do not have access to this resource',
      )
    end
  end
end

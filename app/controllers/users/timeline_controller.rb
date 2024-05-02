# frozen_string_literal: true

module Users
  class TimelineController < AuthenticatedController
    include RestrictToCurrentUser

    before_action :current_user_only!

    def index
      result = AssembleTimeline.call(user_id: params.require(:user_id))

      if result.success?
        render locals: { entries: to_presenters(result.entries) }
      else
        render status: :internal_server_error, json: jsend_error(result.reason)
      end
    end

    private

    def to_presenter(entry)
      TimelineEntryPresenter.new(entry)
    end

    def to_presenters(entries)
      Array.wrap(entries).map { |e| to_presenter(e) }
    end
  end
end

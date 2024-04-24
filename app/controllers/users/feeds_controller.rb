module Users
  class FeedsController < AuthenticatedController
    before_action :ensure_access!

    def index
      result = FetchFeeds.call(user_id: params.require(:user_id))

      if result.success?
        render locals: { feeds: to_presenters(result.feeds) }
      else
        render status: :bad_request, json: {
          message: result.reason,
        }
      end
    end

    private

    def ensure_access!
      return if CurrentSession.session&.user_id == params.require(:user_id)

      render status: :unauthorized, json: {
        message: 'Not authorized to access this resource',
      }
    end

    def to_presenters(feeds)
      Array.wrap(feeds).map do |feed|
        FeedPresenter.new(feed)
      end
    end
  end
end

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

    def show # rubocop:disable Metrics/MethodLength
      result = FetchFeeds.call(
        user_id: params.require(:user_id),
        feed_ids: [params.require(:id)],
      )

      if result.success?
        render locals: { feed: to_presenters(result.feeds).first }
      elsif result.feeds.empty?
        render status: :not_found, json: {
          message: 'Resource not found for user',
        }
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

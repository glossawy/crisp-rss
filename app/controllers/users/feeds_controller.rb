# frozen_string_literal: true

module Users
  class FeedsController < AuthenticatedController
    include RestrictToCurrentUser

    before_action :current_user_only!

    def index
      result = FetchFeeds.call(user_id: params.require(:user_id))

      if result.success?
        presenters = to_presenters(result.feeds)
        render locals: { feeds: presenters.sort_by(&:title) }
      else
        render status: :bad_request, json: jsend_error(result.reason)
      end
    end

    def show
      result = FetchFeeds.call(
        user_id: params.require(:user_id),
        feed_ids: [params.require(:id)],
      )

      if result.success? && result.feeds.present?
        render locals: { feed: to_presenter(result.feeds.first) }
      elsif result.feeds.empty?
        render status: :not_found, json: jsend_fail(
          id: 'Not found for user',
        )
      else
        render status: :bad_request, json: {
          message: result.reason,
        }
      end
    end

    def create # rubocop:disable Metrics/AbcSize
      result = AddUserFeed.call(
        user_id: params.require(:user_id), params: create_params,
      )

      if result.success?
        render status: :created, locals: { feed: to_presenter(result.feed) }
      elsif result.errors
        render status: :unprocessable_entity, json: jsend_fail(
          url: result.errors[:url], interval: result.errors[:interval],
        )
      else
        Rails.logger.error(result.error)
        render status: :bad_request, json: jsend_error(result.reason)
      end
    end

    def destroy
      result = DeleteFeed.call(
        user_id: params.require(:user_id),
        feed_id: params.require(:id),
      )

      if result.success?
        render locals: { feed: to_presenter(result.feed) }
      elsif result.reason == :not_found
        render status: :not_found, json: jsend_fail(
          id: 'Not found for user',
        )
      else
        render status: :internal_server_error, json: jsend_error(result.reason)
      end
    end

    private

    def invalid_params(params, errors)
      params.keys.index_with { |key| errors[key]&.first }.compact
    end

    def create_params
      params.require(:feed).permit(
        :url,
        :interval,
      )
    end

    def to_presenter(feed)
      FeedPresenter.new(feed)
    end

    def to_presenters(feeds)
      Array.wrap(feeds).map do |feed|
        to_presenter(feed)
      end
    end
  end
end

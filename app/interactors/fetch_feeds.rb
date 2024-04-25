# frozen_string_literal: true

class FetchFeeds
  include Interactor
  include IdentifyModel

  identify User, :user

  def call
    feeds = context.user.feeds
    feeds = feeds.where(id: context.feed_ids) if context.feed_ids.present?

    context.feeds = feeds.to_a
  end
end

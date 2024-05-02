# frozen_string_literal: true

class UpdateFeed
  include Interactor
  include IdentifyModel

  identify User, :user
  identify Feed, :feed, using: -> { context.user.feeds }

  def call
    context.fail!(reason: :not_found) if context.feed.blank?

    if perform_update
      sync_feed
    else
      context.fail!(errors: field_errors)
    end
  end

  private

  def sync_feed
    context.feed.reload
    refresh_feed if url_changed?
  end

  def field_errors
    context.feed.errors.to_hash(true)
  end

  def refresh_feed
    result = RefreshFeed.call(feed: context.feed)
    context.fail!(reason: result.reason) unless result.success?
  end

  def url_changed?
    context.feed.previous_changes.key? :url
  end

  def perform_update
    context.feed.update(context.updates)
  end
end

# frozen_string_literal: true

class DeleteFeed
  include Interactor
  include IdentifyModel

  identify User, :user
  identify Feed, :feed, using: -> { context.user.feeds }

  def call
    context.fail!(reason: :not_found) if context.feed.blank?
    context.fail!(reason: :not_destroyed) unless context.feed.destroy
  end
end

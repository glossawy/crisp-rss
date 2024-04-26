class DeleteFeed
  include Interactor
  include IdentifyModel

  identify User, :user

  before do
    Rails.logger.info(context.feed_id)
    context.feed = context.user.feeds.find_by(id: context.feed_id)
  end

  def call
    context.fail!(reason: :not_found) if context.feed.blank?
    context.fail!(reason: :not_destroyed) unless context.feed.destroy
  end
end

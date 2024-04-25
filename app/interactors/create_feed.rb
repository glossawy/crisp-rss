# frozen_string_literal: true

class CreateFeed
  include Interactor
  include IdentifyModel

  identify User, :user

  def call
    if new_feed.valid?
      context.feed = new_feed
    else
      context.fail!(errors: new_feed.errors.to_hash(true))
    end
  end

  def rollback
    context.feed.destroy!
  end

  private

  def new_feed
    @new_feed ||= context.user.feeds.create(
      url: context.params[:url],
      interval: context.params[:interval],
    )
  end
end

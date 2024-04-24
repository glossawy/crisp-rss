class FetchFeeds
  include Interactor



  before do
    if context.user_id
      context.user = User.find_by(id: context.user_id)
      context.fail!(reason: 'User not found') if context.user.blank?
    end

    context.fail!(reason: 'User must be provided') if context.user.blank?
  end

  def call
    context.feeds = context.user.feeds.to_a
  end
end

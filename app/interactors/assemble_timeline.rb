class AssembleTimeline
  include Interactor
  include IdentifyModel

  identify User, :user

  def call
    context.entries = entries.to_a
  end

  def entries
    @entries ||=
      Entry
      .includes(:feed)
      .joins(:feed)
      .where(feeds: { user_id: context.user.id })
      .sort_by_recency
  end
end

class RefreshFeed
  include Interactor

  def call
    Feed.transaction do
      context.feed = Feed.lock.find(context.feed_id)

      update_feed! if due_for_refresh?
    end
  end

  private

  def due_for_refresh?
    context.feed.due_for_refresh?
  end

  def update_feed!
    new_content = Rss::Fetcher.new(context.feed.url).feed_xml

    context.feed.update!(
      content: new_content,
      last_fetched_at: Time.current,
    )
  rescue HTTPX::Error => e
    context.feed.update!(
      error: "Failed to fetch: #{e.message}",
      last_fetched_at: time.current,
    )
  end
end

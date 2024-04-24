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

    # Validate content is parseable
    Rss::Parser.new(new_content).parse!

    context.feed.update!(
      content: new_content,
      last_fetched_at: Time.current,
    )
  rescue Rss::Parser::PresenterMissing, Feedjira::NoParserAvailable
    error! :unsupported
  rescue HTTPX::Error
    error! :unreachable
  end

  def succeed!(content)
    context.feed.update!(
      content:,
      last_fetched_at: Time.current,
    )
  end

  def error!(reason)
    context.feed.update!(
      error: reason,
      last_fetched_at: Time.current,
    )

    context.fail!(reason:, error: $ERROR_INFO)
  end
end

class FeedPresenter
  attr_reader :feed

  def initialize(feed)
    @feed = feed
  end

  def error
    feed.error_message
  end

  def rss_presenter
    @rss_presenter ||= Rss::Parser.new(feed.content).parse!
  end

  def source_url
    rss_presenter.feed_url || feed.url
  end

  def site_url
    rss_presenter.site_url ||
      derive_site_url
  end

  def title
    rss_presenter.title ||
      source_url
  end

  def entry_count
    rss_presenter.entries.size
  end

  def last_updated_at
    rss_presenter.updated_at
  end

  delegate :last_fetched_at, to: :feed
  delegate :description, to: :rss_presenter

  private

  def derive_site_url
    url = URI.parse(source_url)

    "#{url.scheme}://#{url.host}"
  end
end

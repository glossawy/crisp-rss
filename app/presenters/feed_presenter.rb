# frozen_string_literal: true

class FeedPresenter
  attr_reader :feed

  def initialize(feed)
    @feed = feed
  end

  def error
    feed.error_message
  end

  def rss_presenter
    return nil if feed.content.blank?

    @rss_presenter ||= Rss::Parser.new(feed.content).parse!
  end

  def source_url
    rss_presenter&.feed_url || feed.url
  end

  def site_url
    rss_presenter&.site_url ||
      derive_site_url
  end

  def title
    rss_presenter&.title ||
      source_url
  end

  def description
    rss_presenter&.description ||
      ''
  end

  def entry_count
    entries.size
  end

  def last_updated_at
    rss_presenter&.updated_at
  end

  def entries
    (rss_presenter&.entries || []).map do |entry|
      FeedEntryPresenter.new(entry)
    end
  end

  def ttl
    (next_fetch_at - Time.current).in_milliseconds.ceil
  end

  delegate :id, :last_fetched_at, :next_fetch_at, to: :feed

  private

  def derive_site_url
    url = URI.parse(source_url)

    "#{url.scheme}://#{url.host}"
  end
end

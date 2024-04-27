# frozen_string_literal: true

class RefreshFeed
  include Interactor
  include IdentifyModel

  identify Feed, :feed

  def call
    context.feed.with_lock do
      update_feed! if due_for_refresh?
    end
  end

  private

  def due_for_refresh?
    context.feed.due_for_refresh? || context.force
  end

  def update_feed!
    new_content = Rss::Fetcher.new(context.feed.url).feed_xml

    # Validate content is parseable
    presenter = Rss::Parser.new(new_content).parse!
    create_or_update_entries!(presenter)

    context.feed.update!(
      content: new_content,
      title: presenter.title,
      site_url: presenter.site_url,
      source_url: presenter.feed_url,
      last_modified_at: presenter.updated_at,
      last_fetched_at: Time.current,
    )
  rescue Rss::Parser::PresenterMissing, Feedjira::NoParserAvailable
    error! :unsupported
  rescue HTTPX::Error
    error! :unreachable
  end

  def create_or_update_entries!(presenter)
    guid_entries = presenter.entries.index_by(&:id)
    existing_entries = context.feed.entries.where(guid: guid_entries.keys).to_a
    new_entries = guid_entries.except(*existing_entries.map(&:guid)).values

    existing_entries.each do |current_entry|
      updated_entry = guid_entries[current_entry.guid]
      current_entry.update!(
        authors: updated_entry.authors,
        content: updated_entry.content,
        summary: updated_entry.summary,
        title: updated_entry.title,
        url: updated_entry.url,
        modified_at: updated_entry.updated_at,
        published_at: updated_entry.published_at,
      )
    end

    context.feed.entries.create!(
      new_entries.map do |entry|
        {
          authors: entry.authors,
          content: entry.content,
          summary: entry.summary,
          title: entry.title,
          url: entry.url,
          modified_at: entry.updated_at,
          published_at: entry.published_at,
          guid: entry.id,
        }
      end,
    )
  end

  def succeed!(content)
    context.feed.update!(
      content:,
      last_fetched_at: Time.current,
    )
  end

  def error!(reason)
    context.feed.update!(
      error_message: reason,
      last_fetched_at: Time.current,
    )

    context.fail!(reason:, error: $ERROR_INFO)
  end
end

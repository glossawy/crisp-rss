# frozen_string_literal: true

class FeedEntryPresenter
  attr_reader :entry

  def initialize(entry)
    @entry = entry
  end

  def content
    Rails::HTML5::SafeListSanitizer.new(prune: true).sanitize(entry.content)
  end

  delegate :url,
           :summary,
           :title,
           :published_at,
           :guid,
           :authors,
           to: :entry
end

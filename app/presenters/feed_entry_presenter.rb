# frozen_string_literal: true

class FeedEntryPresenter
  attr_reader :entry

  def initialize(entry)
    @entry = entry
  end

  def guid
    entry.id
  end

  def authors
    Array.wrap(entry.authors)
  end

  delegate :url, :summary, :content, to: :entry
end

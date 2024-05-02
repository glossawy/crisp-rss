# frozen_string_literal: true

class TimelineEntryPresenter
  def initialize(entry)
    @entry = entry
  end

  def feed
    @feed ||= FeedPresenter.new(@entry.feed)
  end

  def entry
    @entry ||= FeedEntryPresenter.new(@entry)
  end

  delegate_missing_to :entry
end

# frozen_string_literal: true

class ScheduleRefreshesJob < ApplicationJob
  def perform
    Feed.needs_refresh.in_batches do |feed_relation|
      feed_relation.pluck(:id).each do |feed_id|
        RefreshFeedJob.perform_later(feed_id)
      end
    end
  end
end

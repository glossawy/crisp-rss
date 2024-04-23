class RefreshFeedJob < ApplicationJob
  include GoodJob::ActiveJobExtensions::Concurrency

  good_job_control_concurrency_with(
    perform_limit: 1,
    perform_throttle: [5, 5.minutes],
    key: -> { "#{self.class.name}-#{queue_name}-#{arguments.first}" },
  )

  def perform(feed_id)
    RefreshFeed.call(feed_id:)
  end
end

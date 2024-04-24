class RefreshFeedJob < ApplicationJob
  include GoodJob::ActiveJobExtensions::Concurrency

  good_job_control_concurrency_with(
    perform_limit: 1,
    perform_throttle: [5, 5.minutes],
    key: -> { "#{self.class.name}-#{queue_name}-#{arguments.first}" },
  )

  def perform(feed_id)
    result = RefreshFeed.call(feed_id:)

    return if result.success?

    Rails.logger.info(
      "Failed to refresh feed #{feed_id}, #{result.reason}",
    )

    raise result.error
  end
end

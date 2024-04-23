# frozen_string_literal: true

Rails.application.configure do
  config.good_job.enable_cron = true
  config.good_job.cron = {
    refresh_due_feeds: {
      cron: '* * * * *',
      class: 'ScheduleRefreshesJob',
      description: 'Schedule refresh jobs for all feeds that need refreshed',
    },
  }
end

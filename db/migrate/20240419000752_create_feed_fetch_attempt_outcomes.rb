# frozen_string_literal: true

class CreateFeedFetchAttemptOutcomes < ActiveRecord::Migration[7.1]
  def change
    create_table :feed_fetch_attempt_outcomes do |t|
      t.references :feed_fetch_attempt, null: false, foreign_key: true
      t.string :state
      t.string :reason

      t.timestamps
    end
  end
end

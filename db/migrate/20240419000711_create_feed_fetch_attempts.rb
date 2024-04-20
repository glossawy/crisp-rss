class CreateFeedFetchAttempts < ActiveRecord::Migration[7.1]
  def change
    create_table :feed_fetch_attempts do |t|
      t.references :feed, null: false, foreign_key: true
      t.timestamp :perform_at, null: false

      t.timestamps
    end
  end
end

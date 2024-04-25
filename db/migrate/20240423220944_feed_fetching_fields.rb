# frozen_string_literal: true

class FeedFetchingFields < ActiveRecord::Migration[7.1]
  def change
    change_table :feeds, bulk: true do |t|
      t.string :error_message
      t.binary :content
      t.timestamp :last_fetched_at
    end
  end
end

# frozen_string_literal: true

class CreateFeeds < ActiveRecord::Migration[7.1]
  def change
    create_table :feeds do |t|
      t.references :user, null: false, foreign_key: true
      t.string :url, null: false
      t.integer :interval, null: false

      t.timestamps
    end
  end
end

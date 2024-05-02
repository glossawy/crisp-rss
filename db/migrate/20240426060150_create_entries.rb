# frozen_string_literal: true

class CreateEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :entries do |t|
      t.references :feed
      t.string :guid, null: false
      t.string :title
      t.string :summary
      t.binary :content
      t.string :url

      t.string :authors, array: true, null: false, default: []

      t.timestamp :published_at
      t.timestamp :modified_at

      t.timestamps
    end

    add_index :entries, %i[feed_id guid], unique: true
  end
end

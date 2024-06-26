# frozen_string_literal: true

class AddDeletedAtToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :deleted_at, :timestamp
  end
end

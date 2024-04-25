# frozen_string_literal: true

class ExpiresAtUserSession < ActiveRecord::Migration[7.1]
  def change
    change_table :user_sessions, bulk: true do |t|
      t.remove :revoked_at, type: :timestamp
      t.remove :deleted_at, type: :timestamp

      t.timestamp :expires_at, null: false, default: 'CURRENT_TIMESTAMP'
    end
  end
end

class ExpiresAtUserSession < ActiveRecord::Migration[7.1]
  def change
    remove_column :user_sessions, :revoked_at, :timestamp
    add_column :user_sessions, :expires_at, :timestamp, null: false
  end
end

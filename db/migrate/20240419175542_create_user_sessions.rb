# frozen_string_literal: true

class CreateUserSessions < ActiveRecord::Migration[7.1]
  def change
    create_table :user_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :session_token, null: false
      t.timestamp :revoked_at
      t.timestamp :deleted_at

      t.timestamps
    end
    add_index :user_sessions, :session_token, unique: true
  end
end

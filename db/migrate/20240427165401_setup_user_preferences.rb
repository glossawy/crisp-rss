# frozen_string_literal: true

class SetupUserPreferences < ActiveRecord::Migration[7.1]
  def change
    create_table :user_preference_options do |t|
      t.string :name, null: false
      t.string :value_type, null: false
      t.boolean :nullable, null: false, default: false
      t.string :default_value

      t.timestamps
    end

    add_index :user_preference_options, :name, unique: true

    create_table :user_preferences do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :user_preference_option
      t.string :value

      t.timestamps
    end

    add_index :user_preferences, %i[user_id user_preference_option_id], unique: true
  end
end

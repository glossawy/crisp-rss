# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_04_19_181509) do
  create_table "feed_fetch_attempt_outcomes", force: :cascade do |t|
    t.integer "feed_fetch_attempt_id", null: false
    t.string "state"
    t.string "reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feed_fetch_attempt_id"], name: "index_feed_fetch_attempt_outcomes_on_feed_fetch_attempt_id"
  end

  create_table "feed_fetch_attempts", force: :cascade do |t|
    t.integer "feed_id", null: false
    t.datetime "perform_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feed_id"], name: "index_feed_fetch_attempts_on_feed_id"
  end

  create_table "feeds", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "url", null: false
    t.integer "interval", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_feeds_on_user_id"
  end

  create_table "user_sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "session_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "expires_at", null: false
    t.index ["session_token"], name: "index_user_sessions_on_session_token", unique: true
    t.index ["user_id"], name: "index_user_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "display_name", null: false
    t.string "email", null: false
    t.string "password_hash", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["display_name"], name: "index_users_on_display_name", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["password_hash"], name: "index_users_on_password_hash"
  end

  add_foreign_key "feed_fetch_attempt_outcomes", "feed_fetch_attempts"
  add_foreign_key "feed_fetch_attempts", "feeds"
  add_foreign_key "feeds", "users"
  add_foreign_key "user_sessions", "users"
end

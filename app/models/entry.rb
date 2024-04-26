# == Schema Information
#
# Table name: entries
#
#  id           :bigint           not null, primary key
#  authors      :string           default([]), not null, is an Array
#  content      :binary
#  guid         :string           not null
#  modified_at  :datetime
#  published_at :datetime
#  summary      :string
#  title        :string
#  url          :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  feed_id      :bigint
#
# Indexes
#
#  index_entries_on_feed_id           (feed_id)
#  index_entries_on_feed_id_and_guid  (feed_id,guid) UNIQUE
#
class Entry < ApplicationRecord
  belongs_to :feed
end

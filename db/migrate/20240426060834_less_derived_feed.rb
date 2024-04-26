class LessDerivedFeed < ActiveRecord::Migration[7.1]
  def change
    change_table :feeds, bulk: true do |t|
      t.string :title
      t.string :description

      t.string :site_url
      t.string :source_url

      t.timestamp :last_modified_at
    end
  end
end

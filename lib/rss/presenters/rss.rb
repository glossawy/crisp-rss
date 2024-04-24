module Rss
  module Presenters
    class Rss
      attr_reader :root

      def initialize(root)
        @root = root
      end

      def site_url = root.url
      def updated_at = root.last_modified

      delegate :title,
               :description,
               :feed_url,
               to: :root

      def entries
        root.entries.map { |entry| Entry.new(entry) }
      end

      Entry = Struct.new(:entry) do

        def authors
          Array.wrap(entry.author.presence)
        end

        def published_at = entry.published
        def updated_at = entry.updated

        delegate :id,
                 :url,
                 :title,
                 :summary,
                 :content,
                 to: :entry
      end
    end
  end
end

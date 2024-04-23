module Rss
  module Providers
    class Direct
      attr_reader :feed_xml

      def initialize(xml)
        @feed_xml = xml
      end

      def feed_url
        "data:application/rss+xml;base64,#{as_base64}"
      end

      private

      def as_base64
        Base64.encode64(feed_xml)
      end
    end
  end
end

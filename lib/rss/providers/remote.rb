module Rss
  module Providers
    class Remote
      attr_reader :url

      def initialize(url)
        @url = url
      end

      def feed_url = url

      def feed_xml
        response.body.to_s
      end

      private

      def response
        @response ||= HTTPX.plugin(:follow_redirects).get(
          url,
          headers: {
            'Accept' => 'application/rss+xml,application/atom+xml,application/xml,text/xml',
            'User-Agent' => 'CrispRSS/1.0',
          }
        )
      end
    end
  end
end

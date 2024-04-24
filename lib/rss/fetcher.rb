module Rss
  class Fetcher
    attr_reader :url

    def initialize(url)
      @url = url
    end

    def feed_xml
      response.body.to_s
    end

    private

    def response
      @response ||= fetch!.tap do |resp|
        Rails.logger.info("Fetch for #{url} returned a #{resp.status}")
        resp.raise_for_status
      end
    end

    def fetch!
      HTTPX.plugin(:follow_redirects).get(
        url,
        headers: {
          'Accept' => 'application/rss+xml,application/atom+xml,application/xml,text/xml',
          'User-Agent' => 'CrispRSS/1.0',
        },
      )
    end
  end
end

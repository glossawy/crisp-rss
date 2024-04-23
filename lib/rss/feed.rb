module Rss
  class Feed
    attr_reader :provider

    PresenterMissing = Class.new(StandardError)

    def initialize(provider)
      @provider = provider
    end

    def source_url
      presenter.feed_url ||
        provider.try(:feed_url) ||
        data_url
    end

    def xml = provider.feed_xml

    def presenter
      case parsed
      when Feedjira::Parser::RSS
        Rss::Presenters::Rss.new(parsed)
      when Feedjira::Parser::Atom
        Rss::Presenters::Atom.new(parsed)
      else
        raise PresenterMissing, "Missing presenter for parser: #{parsed.class.name}"
      end
    end

    def parsed
      @parsed ||= Feedjira.parse(xml)
    end

    private

    def data_url
      "data:application/rss+xml;base64,#{Base64.encode64(xml)}"
    end
  end
end

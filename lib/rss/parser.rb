module Rss
  class Parser
    attr_reader :feed_xml

    PresenterMissing = Class.new(StandardError)

    def initialize(feed_xml)
      @feed_xml = feed_xml
    end

    def parse!
      case parsed
      when Feedjira::Parser::RSS
        Rss::Presenters::Rss.new(parsed)
      when Feedjira::Parser::Atom
        Rss::Presenters::Atom.new(parsed)
      else
        raise PresenterMissing, "Missing presenter for parser: #{parsed.class.name}"
      end
    end

    private

    def parsed
      @parsed ||= Feedjira.parse(feed_xml)
    end
  end
end

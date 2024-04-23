module Rss
  module Providers
    class Cached
      attr_reader :provider, :cache_key, :ttl

      def self.cached_delegate(method_id, to:)
        define_method(method_id) do
          cache(method_id) do
            send(to).public_send(method_id)
          end
        end
      end

      def initialize(provider, key:, ttl:)
        @provider = provider
        @cache_key = key
        @ttl = ttl
      end

      cached_delegate :feed_url, to: :provider
      cached_delegate :feed_xml, to: :provider

      private

      def cache(subkey, &)
        Rails.cache.fetch("#{cache_key}:#{subkey}", expires_in: ttl, &)
      end
    end
  end
end

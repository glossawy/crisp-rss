module Preferences
  module OptionTypes
    class DefaultWrapper
      attr_reader :wrapped, :default

      def initialize(type, default:)
        @wrapped = type
        @default = default
      end

      def serialize(value)
        wrapped.serialize(value || default)
      end

      def deserialize(value)
        return default if value.nil?

        wrapped.deserialize(value)
      end
    end
  end
end

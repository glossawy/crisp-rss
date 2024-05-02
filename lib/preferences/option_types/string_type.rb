# frozen_string_literal: true

module Preferences
  module OptionTypes
    class StringType
      def serialize(value)
        value.to_s
      end

      def deserialize(value)
        value
      end
    end

    register StringType, as: :string
  end
end

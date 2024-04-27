module Preferences
  module OptionTypes
    NotFound = Class.new(StandardError)

    def self.available_types
      @available_types ||= {}.with_indifferent_access
    end

    def self.register(type_class, as:)
      available_types[as] = type_class
    end

    def self.for(name, opts = {})
      raise NotFound, "#{name} is not a defined type" unless available_types.key?(name)

      type = available_types[name].new
      type = DefaultWrapper.new(type, default: opts[:default]) if opts.key? :default
      type
    end
  end

  Dir["#{__dir__}/option_types/*.rb"].each { |f| require f }
end

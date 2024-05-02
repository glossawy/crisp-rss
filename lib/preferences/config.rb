# frozen_string_literal: true

module Preferences
  class Config
    class NotAllowed < StandardError
      attr_reader :config_name

      def initialize(name)
        super("#{name} is not allowed for this config")
        @config_name = name
      end
    end

    attr_reader :allowed_options, :config_data

    def initialize(allowed_options)
      @config_data = {}.with_indifferent_access
      @allowed_options = allowed_options
    end

    def allowed?(name)
      option_types.key? name
    end

    def set(name, value)
      raise NotAllowed, name unless allowed?(name)

      config_data[name] = option_types[name].serialize(value)
    end

    def get(name)
      return unless config_data.key? name

      option_types[name].deserialize(config_data[name])
    end

    def load!(config_values)
      config_values.each do |(key, value)|
        set(key, value)
      end
    end

    delegate :keys, to: :config_data

    def to_serialized_h
      serialized_config.deep_symbolize_keys
    end

    def to_h
      deserialized_config.deep_symbolize_keys
    end

    private

    def serialized_config
      empty_config.to_h { |k, v| [k, option_types[k].serialize(v)] }.merge(config_data.to_h)
    end

    def deserialized_config
      empty_config.merge(config_data.to_h).to_h { |k, v| [k, option_types[k].deserialize(v)] }
    end

    def empty_config
      option_types.transform_values { nil }
    end

    def option_types
      @option_types ||= allowed_options.each_with_object({}.with_indifferent_access) do |upo, ot|
        ot[upo.name.to_sym] = OptionTypes.for(upo.value_type, default: upo.default_value)
      end
    end
  end
end

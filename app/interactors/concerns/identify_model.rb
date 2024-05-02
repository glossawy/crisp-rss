# frozen_string_literal: true

module IdentifyModel
  extend ActiveSupport::Concern

  IdentificationError = Class.new(StandardError)

  class_methods do
    def identify(model_class, context_attr, using: proc { model_class })
      before do
        current_value = context.public_send(context_attr)
        record_id = context.public_send(:"#{context_attr}_id")

        next unless current_value.nil?
        raise IdentifyModel::IdentificationError, "Cannot identify #{model_class} without id" if record_id.nil?

        record = instance_exec(&using).find_by(id: record_id)
        context.public_send(:"#{context_attr}=", record)
      end
    end

    def identify_many(model_class, context_attr, using: proc { model_class })
      singular_attr = context_attr.to_s.singularize

      before do
        current_values = context.public_send(context_attr)
        record_ids = context.public_send(:"#{singular_attr}_ids")

        next unless current_values.nil?

        if record_ids.nil?
          raise IdentifyModel::IdentificationError, "Cannot identify #{model_class.to_s.pluralize} without ids"
        end

        records = instance_exec(&using).where(id: record_ids).to_a
        context.public_send(:"#{context_attr}=", records)
      end
    end
  end
end

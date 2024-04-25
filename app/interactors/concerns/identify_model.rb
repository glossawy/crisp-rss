# frozen_string_literal: true

module IdentifyModel
  extend ActiveSupport::Concern

  class_methods do
    def identify(model_class, context_attr)
      before do
        current_value = context.public_send(context_attr)
        record_id = context.public_send(:"#{context_attr}_id")

        if current_value.blank? && record_id.present?
          record = model_class.find_by(id: record_id)

          context.public_send(:"#{context_attr}=", record)
        end
      end
    end

    def identify_many(model_class, context_attr)
      singular_attr = context_attr.to_s.singularize

      before do
        current_values = context.public_send(context_attr)
        record_ids = context.public_send(:"#{singular_attr}_ids")

        if current_values.blank? && record_ids.present?
          records = model_class.where(id: record_ids).to_a

          context.public_send(:"#{context_attr}=", records)
        end
      end
    end
  end
end

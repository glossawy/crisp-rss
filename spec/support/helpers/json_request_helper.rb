# frozen_string_literal: true

module JsonRequestHelper
  def json_get(*, **) = get(*, **, as: :json)
  def json_patch(*, **) = patch(*, **, as: :json)
  def json_post(*, **) = post(*, **, as: :json)
  def json_put(*, **) = put(*, **, as: :json)
  def json_delete(*, **) = delete(*, **, as: :json)
end

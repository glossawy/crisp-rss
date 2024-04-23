# frozen_string_literal: true

json.user do
  json.id user.id
  json.display_name user.display_name
  json.email user.email
end

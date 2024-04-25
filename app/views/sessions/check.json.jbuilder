# frozen_string_literal: true

json.jsend_success do
  json.expires_at session.expires_at.iso8601
end

# frozen_string_literal: true

module JSendResponses
  def jsend_success(data)
    {
      status: 'success',
      data:,
    }
  end

  def jsend_fail(data)
    {
      status: 'fail',
      data:,
    }
  end

  def jsend_error(message)
    {
      status: 'error',
      message:,
    }
  end
end

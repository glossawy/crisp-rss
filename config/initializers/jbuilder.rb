class Jbuilder
  def jsend_success(&)
    status :success
    data(&)
  end

  def jsend_error(error_message)
    status :error
    message error_message
  end

  def jsend_fail(&)
    status :fail
    data(&)
  end
end

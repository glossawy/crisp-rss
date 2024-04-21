module AuthHelper
  def login!(user_session)
    CurrentSession.session_token = user_session.session_token

    allow_any_instance_of(ApplicationController) # rubocop:disable RSpec/AnyInstance
      .to receive(:set_current_session)
  end
end

# frozen_string_literal: true

class AddUserFeed
  include Interactor::Organizer

  organize CreateFeed, RefreshFeed
end

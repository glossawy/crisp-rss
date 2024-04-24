# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  get '/sessions/check', to: 'sessions#check'
  get '/sessions/logout', to: 'sessions#logout'

  resources :sessions, only: %i[create]
  resources :users, only: %i[show] do
    resources :feeds, module: :users, only: %i[show index]
  end
end

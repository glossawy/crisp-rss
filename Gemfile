source 'https://rubygems.org'

ruby '3.2.2'

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem 'rails', '~> 7.1.3', '>= 7.1.3.2'

# Use sqlite3 as the database for Active Record
gem 'sqlite3', '~> 1.4'

# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '>= 5.0'

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[windows jruby]

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin Ajax possible
# gem "rack-cors"

gem "acts_as_paranoid", "~> 0.9.0"
gem "argon2", "~> 2.3"
gem "feedjira", "~> 3.2"
gem "validate_url", "~> 1.0"
gem "validates_email_format_of", "~> 1.8"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri windows]
  gem "annotate", "~> 3.2"
end

group :development do
  gem 'rubocop', '~> 1.63'
end

group :test do
  gem "factory_bot", "~> 6.4"
  gem "rspec", "~> 3.13"
  gem "rspec-rails", "~> 6.1"
  gem "test-prof", "~> 1.3"
  gem "timecop", "~> 0.9.8"
end
